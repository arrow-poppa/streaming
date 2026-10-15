//! Word audio from a local-audio-yomichan database (Forvo, NHK16, Shinmeikai8,
//! JPod101, ...). Accepts either `android.db` (audio stored as blobs in the
//! `android` table) or `entries.db` next to the `<source>_files/` folders.

use std::path::{Path, PathBuf};

use base64::{engine::general_purpose::STANDARD as B64, Engine as _};
use rusqlite::{Connection, OpenFlags, OptionalExtension};
use serde::Serialize;

const DEFAULT_SOURCE_ORDER: &[&str] = &["nhk16", "shinmeikai8", "forvo", "jpod", "jpod_alternate", "ozk5"];
const MAX_RESULTS: usize = 32;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LocalAudioEntry {
    pub source: String,
    pub speaker: Option<String>,
    pub file: String,
    pub label: String,
}

// `immutable=1`: the database never changes while Harbor runs, so SQLite skips
// file locking. Locks can fail on Flatpak document-portal (FUSE) paths and on
// network shares.
fn sqlite_uri(path: &str) -> String {
    let p = path.replace('\\', "/");
    let mut uri = String::from(if p.starts_with('/') { "file://" } else { "file:///" });
    for b in p.bytes() {
        match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'.' | b'_' | b'~' | b'/' | b':' => uri.push(b as char),
            _ => uri.push_str(&format!("%{:02X}", b)),
        }
    }
    uri.push_str("?mode=ro&immutable=1");
    uri
}

fn open_read_only(db_path: &str) -> Result<Connection, String> {
    if !Path::new(db_path).is_file() {
        return Err(format!(
            "local audio database not found or not readable: {} (choose it again in Settings → Anime)",
            db_path
        ));
    }
    Connection::open_with_flags(
        sqlite_uri(db_path),
        OpenFlags::SQLITE_OPEN_READ_ONLY | OpenFlags::SQLITE_OPEN_URI | OpenFlags::SQLITE_OPEN_NO_MUTEX,
    )
    .map_err(|e| format!("open local audio database: {}", e))
}

fn source_rank(source: &str, order: &[String]) -> usize {
    order
        .iter()
        .position(|s| s == source)
        .or_else(|| DEFAULT_SOURCE_ORDER.iter().position(|s| *s == source).map(|p| p + order.len()))
        .unwrap_or(usize::MAX)
}

fn label_for(source: &str, speaker: Option<&str>, display: Option<&str>) -> String {
    let base = match display.map(str::trim).filter(|d| !d.is_empty()) {
        Some(d) => d.to_string(),
        None => source.to_string(),
    };
    match speaker.map(str::trim).filter(|s| !s.is_empty()) {
        Some(s) if !base.contains(s) => format!("{} ({})", base, s),
        _ => base,
    }
}

fn query_entries(
    conn: &Connection,
    term: &str,
    reading: Option<&str>,
    order: &[String],
) -> Result<Vec<LocalAudioEntry>, String> {
    let sql = "SELECT source, speaker, display, file FROM entries \
               WHERE expression = ?1 AND (?2 IS NULL OR reading IS NULL OR reading = ?2)";
    let mut stmt = conn.prepare(sql).map_err(|e| format!("query local audio: {}", e))?;
    let rows = stmt
        .query_map(rusqlite::params![term, reading], |row| {
            let source: String = row.get(0)?;
            let speaker: Option<String> = row.get(1)?;
            let display: Option<String> = row.get(2)?;
            let file: String = row.get(3)?;
            Ok(LocalAudioEntry {
                label: label_for(&source, speaker.as_deref(), display.as_deref()),
                source,
                speaker,
                file,
            })
        })
        .map_err(|e| format!("query local audio: {}", e))?;
    let mut out: Vec<LocalAudioEntry> = rows.filter_map(Result::ok).collect();
    out.sort_by_key(|e| source_rank(&e.source, order));
    out.truncate(MAX_RESULTS);
    Ok(out)
}

/// Lists audio entries for `term`, best source first. `sources` overrides the
/// source priority (ids such as "forvo", "nhk16").
#[tauri::command]
pub async fn local_audio_lookup(
    db_path: String,
    term: String,
    reading: Option<String>,
    sources: Option<Vec<String>>,
) -> Result<Vec<LocalAudioEntry>, String> {
    tokio::task::spawn_blocking(move || {
        let conn = open_read_only(&db_path)?;
        let order = sources.unwrap_or_default();
        let reading = reading.filter(|r| !r.trim().is_empty());
        let mut found = query_entries(&conn, &term, reading.as_deref(), &order)?;
        if found.is_empty() {
            if let Some(r) = reading.as_deref().filter(|r| *r != term) {
                found = query_entries(&conn, r, Some(r), &order)?;
            }
        }
        Ok(found)
    })
    .await
    .map_err(|e| format!("local audio task failed: {}", e))?
}

fn mime_for(file: &str) -> &'static str {
    match Path::new(file)
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_ascii_lowercase())
        .as_deref()
    {
        Some("mp3") => "audio/mpeg",
        Some("ogg") | Some("oga") => "audio/ogg",
        Some("opus") => "audio/ogg; codecs=opus",
        Some("m4a") | Some("aac") | Some("mp4") => "audio/mp4",
        Some("wav") => "audio/wav",
        Some("flac") => "audio/flac",
        _ => "application/octet-stream",
    }
}

fn has_android_table(conn: &Connection) -> bool {
    conn.query_row(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'android'",
        [],
        |_| Ok(()),
    )
    .optional()
    .ok()
    .flatten()
    .is_some()
}

fn read_from_folder(db_path: &str, source: &str, file: &str) -> Result<Vec<u8>, String> {
    let root = Path::new(db_path)
        .parent()
        .ok_or_else(|| "bad database path".to_string())?
        .join(format!("{}_files", source));
    let root = root
        .canonicalize()
        .map_err(|_| {
            format!(
                "audio folder {}_files not found next to the database (on Flatpak, pick android.db instead)",
                source
            )
        })?;
    let full: PathBuf = root
        .join(file)
        .canonicalize()
        .map_err(|_| format!("audio file missing: {}", file))?;
    if !full.starts_with(&root) {
        return Err("audio path escapes its source folder".into());
    }
    std::fs::read(&full).map_err(|e| format!("read audio: {}", e))
}

/// Returns the audio for one entry from `local_audio_lookup` as a data URL.
#[tauri::command]
pub async fn local_audio_data(db_path: String, source: String, file: String) -> Result<String, String> {
    tokio::task::spawn_blocking(move || {
        let conn = open_read_only(&db_path)?;
        let bytes = if has_android_table(&conn) {
            conn.query_row(
                "SELECT data FROM android WHERE file = ?1 AND source = ?2",
                rusqlite::params![file, source],
                |row| row.get::<_, Vec<u8>>(0),
            )
            .optional()
            .map_err(|e| format!("read local audio: {}", e))?
            .ok_or_else(|| format!("audio not in database: {}", file))?
        } else {
            read_from_folder(&db_path, &source, &file)?
        };
        Ok(format!("data:{};base64,{}", mime_for(&file), B64.encode(&bytes)))
    })
    .await
    .map_err(|e| format!("local audio task failed: {}", e))?
}

#[cfg(test)]
mod tests {
    use super::*;

    fn fixture(dir: &Path, with_android: bool) -> String {
        let path = dir.join(if with_android { "android.db" } else { "entries.db" });
        let conn = Connection::open(&path).unwrap();
        conn.execute_batch(
            "CREATE TABLE entries (id integer PRIMARY KEY NOT NULL, expression text NOT NULL, reading text,
               source text NOT NULL, speaker text, display text, file text NOT NULL);
             INSERT INTO entries (expression, reading, source, speaker, display, file) VALUES
               ('食べる', 'たべる', 'forvo', 'strawberrybrown', NULL, 'strawberrybrown/食べる.mp3'),
               ('食べる', 'たべる', 'nhk16', NULL, 'NHK16 食べる', 'audio/taberu.opus'),
               ('食べる', 'しょくべる', 'jpod', NULL, NULL, 'bad.mp3');",
        )
        .unwrap();
        if with_android {
            conn.execute_batch(
                "CREATE TABLE android (id integer PRIMARY KEY NOT NULL, file text NOT NULL, source text NOT NULL, data blob NOT NULL);
                 INSERT INTO android (file, source, data) VALUES ('strawberrybrown/食べる.mp3', 'forvo', x'494433');",
            )
            .unwrap();
        } else {
            let folder = dir.join("forvo_files").join("strawberrybrown");
            std::fs::create_dir_all(&folder).unwrap();
            std::fs::write(folder.join("食べる.mp3"), b"ID3").unwrap();
        }
        path.to_string_lossy().into_owned()
    }

    #[test]
    fn sqlite_uri_escapes_paths() {
        assert_eq!(sqlite_uri("/home/a b/ä#.db"), "file:///home/a%20b/%C3%A4%23.db?mode=ro&immutable=1");
        assert_eq!(sqlite_uri(r"C:\Audio\android.db"), "file:///C:/Audio/android.db?mode=ro&immutable=1");
    }

    fn temp_dir(name: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!("harbor-local-audio-{}-{}", name, std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[tokio::test]
    async fn lookup_orders_sources_and_filters_reading() {
        let dir = temp_dir("lookup áudio local #1");
        let db = fixture(&dir, true);
        let found = local_audio_lookup(db, "食べる".into(), Some("たべる".into()), None).await.unwrap();
        let sources: Vec<&str> = found.iter().map(|e| e.source.as_str()).collect();
        assert_eq!(sources, vec!["nhk16", "forvo"]);
        assert_eq!(found[1].label, "forvo (strawberrybrown)");
    }

    #[tokio::test]
    async fn reads_audio_from_android_db_and_from_folders() {
        let dir = temp_dir("android");
        let db = fixture(&dir, true);
        let url = local_audio_data(db, "forvo".into(), "strawberrybrown/食べる.mp3".into()).await.unwrap();
        assert_eq!(url, "data:audio/mpeg;base64,SUQz");

        let dir = temp_dir("folder");
        let db = fixture(&dir, false);
        let url = local_audio_data(db.clone(), "forvo".into(), "strawberrybrown/食べる.mp3".into()).await.unwrap();
        assert_eq!(url, "data:audio/mpeg;base64,SUQz");
        assert!(local_audio_data(db, "forvo".into(), "../../etc/passwd".into()).await.is_err());
    }
}
