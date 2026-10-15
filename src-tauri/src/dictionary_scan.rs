//! Word-aware scanning for space-delimited languages.
//!
//! Manatan tries every character prefix of the text after the cursor, which
//! suits Japanese but not European languages: an unknown "começamos" ends up
//! showing "come", and "don’t" never matches the "don't" entry. This layer
//! sits in front of the engine and:
//! - stops the scan at sentence punctuation;
//! - also looks up variants with normalized apostrophes and without combining
//!   marks (stress marks, stray accents);
//! - drops matches that end in the middle of a word;
//! - falls back to accent-folded text, and to compound heads for languages
//!   that glue words together (German, Dutch, Nordic, Finnish, Hungarian).

use std::collections::HashSet;
use std::future::Future;

use serde_json::Value;
use unicode_normalization::char::{decompose_canonical, is_combining_mark};

/// Languages whose words are separated by spaces and whose scripts the
/// engine lowercases. Others keep the engine's plain prefix scan.
pub fn is_word_language(language: &str) -> bool {
    matches!(
        language,
        "english"
            | "spanish"
            | "french"
            | "german"
            | "portuguese"
            | "italian"
            | "dutch"
            | "norwegian"
            | "swedish"
            | "danish"
            | "finnish"
            | "estonian"
            | "latvian"
            | "romanian"
            | "polish"
            | "czech"
            | "hungarian"
            | "turkish"
            | "indonesian"
            | "vietnamese"
            | "tagalog"
            | "maltese"
            | "welsh"
            | "bulgarian"
            | "russian"
            | "ukrainian"
            | "greek"
            | "latin"
            | "mongolian"
    )
}

/// Languages that write compounds as one word, where the first dictionary
/// word inside an unknown long word is still a useful answer.
pub fn is_compounding_language(language: &str) -> bool {
    matches!(
        language,
        "german" | "dutch" | "swedish" | "norwegian" | "danish" | "finnish" | "estonian" | "hungarian"
    )
}

const APOSTROPHES: [char; 5] = ['\'', '’', '‘', 'ʼ', '`'];

fn is_word_char(c: char) -> bool {
    c.is_alphabetic() || is_combining_mark(c)
}

/// Cuts the scan text at the end of the clause the cursor is in. A period
/// ends it only before whitespace, so "e.g" and "3.5" stay intact.
pub fn clip_clause(text: &str) -> &str {
    let mut it = text.char_indices().peekable();
    while let Some((i, c)) = it.next() {
        let stop = match c {
            ',' | ';' | ':' | '!' | '?' | '¡' | '¿' | '…' | '"' | '“' | '”' | '„' | '«' | '»' | '‹' | '›'
            | '(' | ')' | '[' | ']' | '{' | '}' | '—' | '–' | '\n' | '\r' | '\t' | '/' | '♪' => true,
            '.' => it.peek().map_or(true, |(_, n)| n.is_whitespace()),
            _ => false,
        };
        if stop {
            return &text[..i];
        }
    }
    text
}

/// A text rewritten for lookup, with the original char count reached after
/// each rewritten char (`map[k]` = original chars covered by `k` chars).
#[derive(Debug, Clone)]
pub struct Variant {
    pub text: String,
    map: Vec<usize>,
}

impl Variant {
    fn identity(text: &str) -> Self {
        let n = text.chars().count();
        Variant { text: text.to_string(), map: (0..=n).collect() }
    }

    /// Original chars covered by the first `len` chars of this variant.
    pub fn original_len(&self, len: usize) -> usize {
        self.map.get(len).copied().unwrap_or_else(|| *self.map.last().unwrap_or(&0))
    }
}

fn rewrite(text: &str, mut f: impl FnMut(char, &mut String)) -> Variant {
    let mut out = String::with_capacity(text.len());
    let mut map = vec![0usize];
    for (i, c) in text.chars().enumerate() {
        let before = out.len();
        f(c, &mut out);
        let added = out[before..].chars().count();
        if added == 0 {
            // A dropped char (a combining mark) belongs to the char before it.
            if map.len() > 1 {
                *map.last_mut().unwrap() = i + 1;
            }
        } else {
            map.extend(std::iter::repeat(i + 1).take(added));
        }
    }
    Variant { text: out, map }
}

fn with_apostrophe(text: &str, to: char) -> Variant {
    rewrite(text, |c, out| out.push(if APOSTROPHES.contains(&c) { to } else { c }))
}

fn without_combining_marks(text: &str) -> Variant {
    rewrite(text, |c, out| {
        let mut parts = Vec::new();
        decompose_canonical(c, |d| parts.push(d));
        if parts.iter().all(|d| is_combining_mark(*d)) {
            // A lone combining mark (stress mark, stray accent) is dropped.
            return;
        }
        out.push(c);
    })
}

/// Latin, Greek and Cyrillic letters with their accents removed: é → e,
/// ñ → n, ї → і. Used only when nothing matched the text as written.
fn folded(text: &str) -> Variant {
    rewrite(text, |c, out| {
        if is_combining_mark(c) {
            return;
        }
        let mut base = None;
        decompose_canonical(c, |d| {
            if base.is_none() {
                base = Some(d);
            }
        });
        out.push(match c {
            'ø' => 'o',
            'Ø' => 'O',
            'ł' => 'l',
            'Ł' => 'L',
            'đ' => 'd',
            'Đ' => 'D',
            'ı' => 'i',
            _ => base.unwrap_or(c),
        });
    })
}

/// The texts to look up, most faithful first. The fallback (accent-folded)
/// is returned apart since it only runs when the rest finds nothing.
pub fn variants(text: &str) -> (Vec<Variant>, Option<Variant>) {
    let mut list = vec![Variant::identity(text)];
    let mut push = |v: Variant| {
        if !list.iter().any(|x| x.text == v.text) {
            list.push(v);
        }
    };
    if text.contains(APOSTROPHES) {
        push(with_apostrophe(text, '\''));
        push(with_apostrophe(text, '’'));
    }
    let stripped = without_combining_marks(&with_apostrophe(text, '\'').text);
    if stripped.text.chars().count() != text.chars().count() {
        // Map back through the apostrophe rewrite, which keeps char counts.
        push(stripped);
    }
    let fold = folded(&with_apostrophe(text, '\'').text);
    let fallback = (!list.iter().any(|x| x.text == fold.text)).then_some(fold);
    (list, fallback)
}

/// True when a match of `len` chars from the start of `chars` ends at a word
/// boundary: not between two letters and not on whitespace.
pub fn ends_on_boundary(chars: &[char], len: usize) -> bool {
    if len == 0 || len > chars.len() {
        return false;
    }
    let last = chars[len - 1];
    if last.is_whitespace() {
        return false;
    }
    match chars.get(len) {
        None => true,
        Some(&next) => !(is_word_char(last) && is_word_char(next)),
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

/// Word-aware lookup of `tail` (the text from the cursor on). `run` looks
/// up one text with the engine and returns its `{ terms, kanji }` response;
/// with `exact` it matches the text as is, with no deinflection and no
/// single-letter skip (the engine ignores one-letter words such as "é", "à"
/// or "y" in normal lookups).
pub async fn lookup_words<F, Fut>(tail: &str, lang_id: &str, run: F) -> Result<Value, String>
where
    F: Fn(String, bool) -> Fut,
    Fut: Future<Output = Result<Value, String>>,
{
    let tail = clip_clause(tail);
    let chars: Vec<char> = tail.chars().collect();
    let (variants, fallback) = variants(tail);

    let mut first: Option<Value> = None;
    // (term, match length in original chars, pass order)
    let mut hits: Vec<(Value, usize, usize)> = Vec::new();
    let mut partial: Vec<(Value, usize, usize)> = Vec::new();
    let collect = |res: &mut Value, variant: &Variant, pass: usize,
                   hits: &mut Vec<(Value, usize, usize)>, partial: &mut Vec<(Value, usize, usize)>| {
        for mut term in take_terms(res) {
            let len = variant.original_len(term_match_len(&term));
            term["matchLen"] = Value::from(len);
            if ends_on_boundary(&chars, len) {
                hits.push((term, len, pass));
            } else if len > 1 {
                partial.push((term, len, pass));
            }
        }
    };

    for (pass, variant) in variants.iter().enumerate() {
        let mut res = run(variant.text.clone(), false).await?;
        collect(&mut res, variant, pass, &mut hits, &mut partial);
        if first.is_none() {
            first = Some(res);
        }
    }
    if hits.is_empty() {
        if let Some(variant) = &fallback {
            let mut res = run(variant.text.clone(), false).await?;
            collect(&mut res, variant, variants.len(), &mut hits, &mut partial);
        }
    }
    if chars.first().is_some_and(|c| is_word_char(*c)) && !chars.get(1).is_some_and(|c| is_word_char(*c)) {
        let word = chars[0].to_string();
        let lower = word.to_lowercase();
        let mut texts = vec![word.clone()];
        if lower != word {
            texts.push(lower);
        }
        for text in texts {
            let mut res = run(text, true).await?;
            for mut term in take_terms(&mut res) {
                term["matchLen"] = Value::from(1);
                hits.push((term, 1, 0));
            }
        }
    }
    if hits.is_empty() && is_compounding_language(lang_id) {
        // An unknown compound: show the dictionary words it starts with.
        hits = partial;
    }

    // Longest match first; at equal length the more faithful pass wins, and
    // the engine's own order (priority, frequency) is kept within a pass.
    hits.sort_by(|a, b| b.1.cmp(&a.1).then(a.2.cmp(&b.2)));
    let mut seen = HashSet::new();
    let terms: Vec<Value> = hits
        .into_iter()
        .filter(|(term, _, _)| seen.insert(term_key(term)))
        .map(|(term, _, _)| term)
        .collect();

    let mut out = first.unwrap_or_else(|| serde_json::json!({ "kanji": [] }));
    out["terms"] = Value::Array(terms);
    Ok(out)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn clips_at_clause_punctuation() {
        assert_eq!(clip_clause("hello, world"), "hello");
        assert_eq!(clip_clause("e.g. this"), "e.g");
        assert_eq!(clip_clause("3.5 times"), "3.5 times");
        assert_eq!(clip_clause("Stop. Run"), "Stop");
        assert_eq!(clip_clause("end."), "end");
        assert_eq!(clip_clause("l’homme qui"), "l’homme qui");
    }

    #[test]
    fn boundary_rule() {
        let c: Vec<char> = "running fast".chars().collect();
        assert!(ends_on_boundary(&c, 7));
        assert!(!ends_on_boundary(&c, 3));
        assert!(!ends_on_boundary(&c, 8));
        assert!(ends_on_boundary(&c, 12));
        let c: Vec<char> = "don’t go".chars().collect();
        assert!(ends_on_boundary(&c, 5));
        assert!(ends_on_boundary(&c, 4));
        assert!(!ends_on_boundary(&c, 2));
        let c: Vec<char> = "well-known".chars().collect();
        assert!(ends_on_boundary(&c, 4));
        assert!(ends_on_boundary(&c, 10));
    }

    #[test]
    fn apostrophe_variants_keep_lengths() {
        let (v, _) = variants("don’t");
        let texts: Vec<_> = v.iter().map(|x| x.text.as_str()).collect();
        assert!(texts.contains(&"don't"));
        assert!(texts.contains(&"don’t"));
        for x in &v {
            assert_eq!(x.original_len(5), 5);
        }
    }

    #[test]
    fn stress_marks_are_removed_and_mapped_back() {
        // "приве́т" with U+0301 after е: 7 chars as written, 6 without it.
        let text = "приве\u{301}т мир";
        let (v, _) = variants(text);
        let s = v.iter().find(|x| x.text == "привет мир").expect("stripped variant");
        assert_eq!(s.original_len(5), 6);
        assert_eq!(s.original_len(6), 7);
        assert_eq!(s.original_len(3), 3);
        assert_eq!(s.original_len(10), text.chars().count());
    }

    #[test]
    fn folding_is_a_fallback() {
        let (v, fallback) = variants("começamos");
        assert_eq!(v.len(), 1);
        assert_eq!(fallback.unwrap().text, "comecamos");
        let (_, fallback) = variants("plain");
        assert!(fallback.is_none());
        let (_, fallback) = variants("Łódź");
        assert_eq!(fallback.unwrap().text, "Lodz");
    }
}
