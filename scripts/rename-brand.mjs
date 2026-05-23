// One-off brand-rename script. Uses Node's fs which writes proper UTF-8
// (PowerShell 5.1 Set-Content -Encoding utf8 mojibakes multi-byte chars).
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const EXTS = [".tsx", ".ts", ".json", ".md"];
const SKIP = new Set(["node_modules", ".next", ".internal", ".git", "scripts"]);

const REPLACEMENTS = [
  ["caboblock.org", "fixvesta.com"],
  ["caborank-arch/caboblock", "caborank-arch/Fixvesta"],
  ["Caboblock", "FixVesta"],
  ["caboblock", "fixvesta"],
];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (EXTS.some((e) => p.endsWith(e))) processFile(p);
  }
}

function processFile(p) {
  let body = readFileSync(p, "utf8");
  let changed = false;
  for (const [from, to] of REPLACEMENTS) {
    if (body.includes(from)) {
      body = body.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(p, body, "utf8");
    console.log("✓", p.replace(root + "\\", ""));
  }
}

walk(root);
console.log("done");
