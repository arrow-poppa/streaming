import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const retiredEndpoints = /https:\/\/harbor\.site\/updates\/(?:latest|versions-beta)\.json/;
for (const file of readdirSync("src-tauri").filter((name) => /^tauri.*\.conf\.json$/.test(name))) {
  assert.doesNotMatch(readFileSync(join("src-tauri", file), "utf8"), retiredEndpoints, file + ": retired update endpoint");
}
function verifyAssets(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) verifyAssets(file);
    else if (/\.(js|html|json)$/.test(entry.name)) {
      assert.doesNotMatch(readFileSync(file, "utf8"), retiredEndpoints, file + ": retired update endpoint");
    }
  }
}
verifyAssets("dist");
console.log("PASS: retired update endpoints are absent from native config and production assets");
