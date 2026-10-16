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
            let tail = &text[byte_index..];
            dictionary_scan::lookup_words(tail, &lang_id, |t, exact| {
                // Hebrew has no deinflection rules and no single-letter skip
                // in the engine, so it gives a plain exact match.
                let l = if exact { DictionaryLanguage::Hebrew } else { lang };
                run_lookup(&st, t, 0, Some(l))
            })
            .await
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
