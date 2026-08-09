use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};

const MAX_DOCUMENT_PATH_BYTES: usize = 32_768;
const MAX_METADATA_BYTES: usize = 1_000_000;
const MAX_NODES: usize = 10_000;

#[derive(Debug, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct CardsMetadata {
    version: u8,
    nodes: HashMap<String, NodeLayout>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct NodeLayout {
    x: f64,
    y: f64,
    width: f64,
    height: f64,
}

fn metadata_root() -> PathBuf {
    if let Some(override_dir) = std::env::var_os("GLYPH_CARDS_METADATA_DIR") {
        return PathBuf::from(override_dir);
    }
    #[cfg(target_os = "windows")]
    {
        PathBuf::from(r"D:\SYSTEM\.mindmap\views")
    }
    #[cfg(not(target_os = "windows"))]
    {
        std::env::var_os("HOME")
            .map(PathBuf::from)
            .unwrap_or_else(std::env::temp_dir)
            .join(".mindmap")
            .join("views")
    }
}

fn document_key(path: &str) -> String {
    let normalized = if cfg!(target_os = "windows") {
        path.replace('/', "\\").to_lowercase()
    } else {
        path.to_string()
    };
    let mut hash = 0xcbf29ce484222325_u64;
    for byte in normalized.as_bytes() {
        hash ^= u64::from(*byte);
        hash = hash.wrapping_mul(0x100000001b3);
    }
    format!("{hash:016x}.json")
}

fn metadata_path(root: &Path, document_path: &str) -> PathBuf {
    root.join(document_key(document_path))
}

fn validate_document_path(path: &str) -> Result<(), String> {
    if path.is_empty() || path.len() > MAX_DOCUMENT_PATH_BYTES {
        return Err("Invalid Cards document path".to_string());
    }
    Ok(())
}

fn validate_payload(payload: &str) -> Result<(), String> {
    if payload.len() > MAX_METADATA_BYTES {
        return Err("Cards metadata payload is too large".to_string());
    }
    let parsed: CardsMetadata = serde_json::from_str(payload)
        .map_err(|error| format!("Invalid Cards metadata: {error}"))?;
    if parsed.version != 1 {
        return Err("Unsupported Cards metadata version".to_string());
    }
    if parsed.nodes.len() > MAX_NODES {
        return Err("Cards metadata contains too many nodes".to_string());
    }
    for (id, node) in parsed.nodes {
        let valid_id = id.strip_prefix("card-").is_some_and(|suffix| {
            suffix.len() == 8 && suffix.bytes().all(|b| b.is_ascii_hexdigit())
        });
        if !valid_id {
            return Err("Invalid Cards metadata node id".to_string());
        }
        if ![node.x, node.y, node.width, node.height]
            .into_iter()
            .all(f64::is_finite)
            || node.width <= 0.0
            || node.height <= 0.0
        {
            return Err("Invalid Cards metadata geometry".to_string());
        }
    }
    Ok(())
}

fn read_at(root: &Path, document_path: &str) -> Result<Option<String>, String> {
    validate_document_path(document_path)?;
    let path = metadata_path(root, document_path);
    match fs::read_to_string(path) {
        Ok(payload) => {
            validate_payload(&payload)?;
            Ok(Some(payload))
        }
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(error) => Err(format!("Failed to read Cards metadata: {error}")),
    }
}

fn write_at(root: &Path, document_path: &str, payload: &str) -> Result<(), String> {
    validate_document_path(document_path)?;
    validate_payload(payload)?;
    fs::create_dir_all(root).map_err(|error| format!("Failed to create metadata dir: {error}"))?;
    let target = metadata_path(root, document_path);
    let mut temp = tempfile::NamedTempFile::new_in(root)
        .map_err(|error| format!("Failed to create metadata temp file: {error}"))?;
    temp.write_all(payload.as_bytes())
        .and_then(|_| temp.as_file().sync_all())
        .map_err(|error| format!("Failed to write Cards metadata: {error}"))?;
    temp.persist(&target)
        .map_err(|error| format!("Failed to replace Cards metadata: {}", error.error))?;
    Ok(())
}

#[tauri::command]
pub fn read_cards_metadata(document_path: String) -> Result<Option<String>, String> {
    read_at(&metadata_root(), &document_path)
}

#[tauri::command]
pub fn write_cards_metadata(document_path: String, payload: String) -> Result<(), String> {
    write_at(&metadata_root(), &document_path, &payload)
}

#[cfg(test)]
mod tests {
    use super::*;

    const PAYLOAD: &str =
        r#"{"version":1,"nodes":{"card-1234abcd":{"x":1,"y":2,"width":300,"height":180}}}"#;

    #[test]
    fn round_trips_metadata_outside_the_markdown_source() {
        let dir = tempfile::tempdir().unwrap();
        write_at(dir.path(), r"D:\notes\one.md", PAYLOAD).unwrap();
        assert_eq!(
            read_at(dir.path(), r"D:\notes\one.md").unwrap().as_deref(),
            Some(PAYLOAD)
        );
        assert_eq!(fs::read_dir(dir.path()).unwrap().count(), 1);
    }

    #[test]
    fn returns_none_when_metadata_does_not_exist() {
        let dir = tempfile::tempdir().unwrap();
        assert_eq!(read_at(dir.path(), r"D:\notes\missing.md").unwrap(), None);
    }

    #[test]
    fn rejects_invalid_json_on_read() {
        let dir = tempfile::tempdir().unwrap();
        let path = metadata_path(dir.path(), r"D:\notes\broken.md");
        fs::write(path, r#"{"version":1,"nodes":"broken"}"#).unwrap();
        assert!(read_at(dir.path(), r"D:\notes\broken.md").is_err());
    }

    #[test]
    fn atomically_replaces_existing_metadata_without_temp_files() {
        let dir = tempfile::tempdir().unwrap();
        let document = r"D:\notes\one.md";
        write_at(dir.path(), document, PAYLOAD).unwrap();
        let updated =
            r#"{"version":1,"nodes":{"card-1234abcd":{"x":99,"y":2,"width":300,"height":180}}}"#;
        write_at(dir.path(), document, updated).unwrap();

        assert_eq!(
            read_at(dir.path(), document).unwrap().as_deref(),
            Some(updated)
        );
        assert_eq!(fs::read_dir(dir.path()).unwrap().count(), 1);
    }

    #[test]
    fn rejects_payloads_that_could_duplicate_source_text() {
        let dir = tempfile::tempdir().unwrap();
        let payload = r#"{"version":1,"nodes":{"card-1234abcd":{"x":1,"y":2,"width":300,"height":180,"text":"secret"}}}"#;
        assert!(write_at(dir.path(), "note.md", payload).is_err());
    }

    #[test]
    fn rejects_unbounded_paths_and_payloads() {
        let dir = tempfile::tempdir().unwrap();
        assert!(read_at(dir.path(), "").is_err());
        assert!(read_at(dir.path(), &"x".repeat(MAX_DOCUMENT_PATH_BYTES + 1)).is_err());
        assert!(write_at(dir.path(), "note.md", &" ".repeat(MAX_METADATA_BYTES + 1)).is_err());
    }

    #[test]
    fn rejects_more_nodes_than_the_layout_contract_allows() {
        let nodes = (0..=MAX_NODES)
            .map(|index| format!(r#""card-{index:08x}":{{"x":1,"y":2,"width":300,"height":180}}"#))
            .collect::<Vec<_>>()
            .join(",");
        let payload = format!(r#"{{"version":1,"nodes":{{{nodes}}}}}"#);
        assert!(validate_payload(&payload).is_err());
    }

    #[test]
    fn hashes_document_paths_into_opaque_file_names() {
        let key = document_key(r"D:\private\Client Name\strategy.md");
        assert_eq!(key.len(), 21);
        assert!(!key.contains("Client"));
        assert!(key.ends_with(".json"));
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn normalizes_windows_path_case_and_separators() {
        assert_eq!(
            document_key(r"D:\Notes\Strategy.md"),
            document_key("d:/notes/strategy.md")
        );
    }
}
