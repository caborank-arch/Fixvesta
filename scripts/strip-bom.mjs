// Strip UTF-8 BOM from JSON/MD/TS files that PowerShell may have added.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const EXTS = [".json", ".md", ".tsx", ".ts", ".mjs", ".js", ".css"];
const SKIP = new Set(["node_modules", ".next", ".internal", ".git"]);
const BOM = "﻿";

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (EXTS.some((e) => p.endsWith(e))) {
      const body = readFileSync(p, "utf8");
      if (body.startsWith(BOM)) {
        writeFileSync(p, body.slice(1), "utf8");
        console.log("stripped BOM:", p.replace(root + "\\", ""));
      }
    }
  }
}
walk(root);
console.log("done");
