//! AnkiConnect bridge. Requests go out from Rust because AnkiConnect only sends
//! CORS headers for origins in its `webCorsOriginList`, which does not include
//! the Tauri webview origin by default.

use std::time::Duration;

use serde_json::{json, Value};

const DEFAULT_URL: &str = "http://127.0.0.1:8765";
const ANKI_CONNECT_VERSION: u64 = 6;

fn validate_url(raw: &str) -> Result<url::Url, String> {
    let url = url::Url::parse(raw).map_err(|e| format!("bad AnkiConnect URL: {}", e))?;
    if url.scheme() != "http" && url.scheme() != "https" {
        return Err("AnkiConnect URL must be http(s)".into());
    }
    let local = match url.host() {
        Some(url::Host::Domain(d)) => d.eq_ignore_ascii_case("localhost"),
        Some(url::Host::Ipv4(ip)) => ip.is_loopback(),
        Some(url::Host::Ipv6(ip)) => ip.is_loopback(),
        None => false,
    };
    if !local {
        return Err("AnkiConnect URL must point to this computer (localhost)".into());
    }
    Ok(url)
}

/// Calls one AnkiConnect action and returns its `result`, or its `error` as Err.
#[tauri::command]
pub async fn anki_connect(url: Option<String>, action: String, params: Option<Value>) -> Result<Value, String> {
    let url = validate_url(url.as_deref().filter(|u| !u.trim().is_empty()).unwrap_or(DEFAULT_URL))?;
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(30))
        .no_proxy()
        .build()
        .map_err(|e| e.to_string())?;
    let body = json!({
        "action": action,
        "version": ANKI_CONNECT_VERSION,
        "params": params.unwrap_or_else(|| json!({})),
    });
    let res = client
        .post(url)
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Anki is not reachable (is Anki open with AnkiConnect installed?): {}", e))?;
    let value: Value = res
        .json()
        .await
        .map_err(|e| format!("bad AnkiConnect response: {}", e))?;
    match value.get("error") {
        Some(Value::Null) | None => Ok(value.get("result").cloned().unwrap_or(Value::Null)),
        Some(err) => Err(err.as_str().map(str::to_string).unwrap_or_else(|| err.to_string())),
    }
}

#[cfg(test)]
mod tests {
    use super::validate_url;

    #[test]
    fn only_loopback_urls_are_allowed() {
        assert!(validate_url("http://127.0.0.1:8765").is_ok());
        assert!(validate_url("http://localhost:8765").is_ok());
        assert!(validate_url("http://[::1]:8765").is_ok());
        assert!(validate_url("http://192.168.0.2:8765").is_err());
        assert!(validate_url("http://example.com").is_err());
        assert!(validate_url("file:///etc/passwd").is_err());
    }
}
