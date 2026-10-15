//! Yomitan dictionary lookups for subtitle mining.
//!
//! The engine is Manatan's `manatan-yomitan-server` crate (MIT). Its axum
//! handlers are called in-process, so no extra localhost port is opened.

use std::sync::Arc;

use axum::body::to_bytes;
use axum::extract::{Path, Query, State};
use axum::response::IntoResponse;
use axum::Json;
use base64::{engine::general_purpose::STANDARD as B64, Engine as _};
use manatan_yomitan_server::handlers::{self, DictionaryAction, DictionaryLanguage, LookupParams};
use manatan_yomitan_server::{import, lookup::LookupService, state::AppState, ServerState};
use serde_json::Value;
use tauri::{AppHandle, Manager};
use tokio::sync::OnceCell;

use crate::dictionary_scan;

const MAX_MEDIA_BYTES: usize = 16 * 1024 * 1024;

static ENGINE: OnceCell<ServerState> = OnceCell::const_new();

async fn engine(app: &AppHandle) -> Result<ServerState, String> {
    ENGINE
        .get_or_try_init(|| async {
            let dir = app
                .path()
                .app_data_dir()
                .map_err(|e| e.to_string())?
                .join("dictionaries");
            tokio::task::spawn_blocking(move || ServerState {
                app: AppState::new(dir),
                lookup: Arc::new(LookupService::new()),
            })
            .await
            .map_err(|e| format!("dictionary engine init failed: {}", e))
        })
        .await
        .cloned()
}

fn utf16_to_byte_offset(text: &str, utf16_index: usize) -> usize {
    let mut units = 0usize;
    for (byte, ch) in text.char_indices() {
        if units >= utf16_index {
            return byte;
        }
        units += ch.len_utf16();
    }
    text.len()
}

fn parse_language(language: Option<String>) -> Option<DictionaryLanguage> {
    language
        .filter(|l| !l.trim().is_empty())
        .and_then(|l| serde_json::from_value(Value::String(l.trim().to_ascii_lowercase())).ok())
}

async fn run_lookup(st: &ServerState, text: String, index: usize, language: Option<DictionaryLanguage>) -> Result<Value, String> {
    let params = LookupParams {
        index: Some(index),
        text,
        group: Some(true),
        language,
    };
    match handlers::lookup_handler(State(st.clone()), Query(params)).await {
        Ok(Json(res)) => serde_json::to_value(res).map_err(|e| e.to_string()),
        Err((_, Json(err))) => Err(err
            .get("message")
            .and_then(|m| m.as_str())
            .unwrap_or("lookup failed")
            .to_string()),
    }
}

fn take_terms(res: &mut Value) -> Vec<Value> {
    match res.get_mut("terms").map(Value::take) {
        Some(Value::Array(terms)) => terms,
        _ => Vec::new(),
    }
}

fn term_match_len(term: &Value) -> usize {
    term.get("matchLen").and_then(Value::as_u64).unwrap_or(0) as usize
}

fn term_key(term: &Value) -> (String, String) {
    let field = |k: &str| term.get(k).and_then(Value::as_str).unwrap_or("").to_string();
    (field("headword"), field("reading"))
}

/// Word-aware lookup for space-delimited languages (see `dictionary_scan`).
async fn lookup_words(st: &ServerState, text: &str, byte_index: usize, lang_id: &str, language: DictionaryLanguage) -> Result<Value, String> {
    let tail = dictionary_scan::clip_clause(&text[byte_index..]);
    let chars: Vec<char> = tail.chars().collect();
    let (variants, fallback) = dictionary_scan::variants(tail);

    let mut first: Option<Value> = None;
    // (term, match length in original chars, pass order)
    let mut hits: Vec<(Value, usize, usize)> = Vec::new();
    let mut partial: Vec<(Value, usize, usize)> = Vec::new();
    let collect = |res: &mut Value, variant: &dictionary_scan::Variant, pass: usize,
                       hits: &mut Vec<(Value, usize, usize)>, partial: &mut Vec<(Value, usize, usize)>| {
        for mut term in take_terms(res) {
            let len = variant.original_len(term_match_len(&term));
            term["matchLen"] = Value::from(len);
            if dictionary_scan::ends_on_boundary(&chars, len) {
                hits.push((term, len, pass));
            } else if len > 1 {
                partial.push((term, len, pass));
            }
        }
    };

    for (pass, variant) in variants.iter().enumerate() {
        let mut res = run_lookup(st, variant.text.clone(), 0, Some(language)).await?;
        collect(&mut res, variant, pass, &mut hits, &mut partial);
        if first.is_none() {
            first = Some(res);
        }
    }
    if hits.is_empty() {
        if let Some(variant) = &fallback {
            let mut res = run_lookup(st, variant.text.clone(), 0, Some(language)).await?;
            collect(&mut res, variant, variants.len(), &mut hits, &mut partial);
        }
    }
    if hits.is_empty() && dictionary_scan::is_compounding_language(lang_id) {
        // An unknown compound: show the dictionary words it starts with.
        hits = partial;
    }

    // Longest match first; at equal length the more faithful pass wins, and
    // the engine's own order (priority, frequency) is kept within a pass.
    hits.sort_by(|a, b| b.1.cmp(&a.1).then(a.2.cmp(&b.2)));
    let mut seen = std::collections::HashSet::new();
    let terms: Vec<Value> = hits
        .into_iter()
        .filter(|(term, _, _)| seen.insert(term_key(term)))
        .map(|(term, _, _)| term)
        .collect();

    let mut out = first.unwrap_or_else(|| serde_json::json!({ "kanji": [] }));
    out["terms"] = Value::Array(terms);
    Ok(out)
}

/// Looks up the text starting at `index` (a UTF-16 offset, as JS strings count).
/// Returns Manatan's grouped lookup response: `{ terms: [...], kanji: [...] }`,
/// where each term's `matchLen` is counted in Unicode scalar values.
#[tauri::command]
pub async fn dict_lookup(
    app: AppHandle,
    text: String,
    index: usize,
    language: Option<String>,
) -> Result<Value, String> {
    let st = engine(&app).await?;
    let byte_index = utf16_to_byte_offset(&text, index);
    let lang_id = language.as_deref().unwrap_or("").trim().to_ascii_lowercase();
    let parsed = parse_language(language);
    match parsed {
        Some(lang) if dictionary_scan::is_word_language(&lang_id) => {
            lookup_words(&st, &text, byte_index, &lang_id, lang).await
        }
        _ => run_lookup(&st, text, byte_index, parsed).await,
    }
}

#[tauri::command]
pub async fn dict_import(app: AppHandle, path: String) -> Result<String, String> {
    let st = engine(&app).await?;
    let app_state = st.app.clone();
    app_state.set_loading(true);
    let res = tokio::task::spawn_blocking(move || {
        let bytes = std::fs::read(&path).map_err(|e| format!("read {}: {}", path, e))?;
        import::import_zip(&app_state, &bytes).map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| format!("import task failed: {}", e));
    st.app.set_loading(false);
    res?
}

#[tauri::command]
pub async fn dict_list(app: AppHandle) -> Result<Value, String> {
    let st = engine(&app).await?;
    Ok(handlers::list_dictionaries_handler(State(st)).await.0)
}

/// `action` uses Manatan's shape: `{ "action": "Delete", "payload": { "id": 1 } }`,
/// also `Toggle { id, enabled }` and `Reorder { order }`.
#[tauri::command]
pub async fn dict_manage(app: AppHandle, action: Value) -> Result<Value, String> {
    let action: DictionaryAction =
        serde_json::from_value(action).map_err(|e| format!("bad dictionary action: {}", e))?;
    let st = engine(&app).await?;
    Ok(handlers::manage_dictionaries_handler(State(st), Json(action)).await.0)
}

/// Returns a media file referenced by a dictionary entry (images in
/// structured content) as a data URL.
#[tauri::command]
pub async fn dict_media(app: AppHandle, dictionary: String, path: String) -> Result<String, String> {
    let st = engine(&app).await?;
    let res = handlers::dict_media_handler(Path((dictionary, path)), State(st))
        .await
        .into_response();
    if !res.status().is_success() {
        return Err(format!("media not found ({})", res.status()));
    }
    let mime = res
        .headers()
        .get(axum::http::header::CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("application/octet-stream")
        .to_string();
    let bytes = to_bytes(res.into_body(), MAX_MEDIA_BYTES)
        .await
        .map_err(|e| format!("read media: {}", e))?;
    Ok(format!("data:{};base64,{}", mime, B64.encode(&bytes)))
}

#[cfg(test)]
mod tests {
    use super::utf16_to_byte_offset;

    #[test]
    fn utf16_offsets_map_to_byte_offsets() {
        let s = "a食べ😀る";
        assert_eq!(utf16_to_byte_offset(s, 0), 0);
        assert_eq!(utf16_to_byte_offset(s, 1), 1);
        assert_eq!(utf16_to_byte_offset(s, 2), 4);
        assert_eq!(utf16_to_byte_offset(s, 3), 7);
        assert_eq!(utf16_to_byte_offset(s, 5), 11);
        assert_eq!(utf16_to_byte_offset(s, 99), s.len());
    }
}
