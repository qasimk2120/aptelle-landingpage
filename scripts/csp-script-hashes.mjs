// Regenerate the CSP script-src hashes for the Cloudflare "Security headers"
// Transform Rule.
//
// WHY: aptelle.com is static (GitHub Pages behind Cloudflare). The CSP lives in
// a Cloudflare Transform Rule, and script-src pins a SHA-256 hash for each inline
// <script type="module"> Astro emits (no 'unsafe-inline'). If you edit any inline
// script — or bump Astro and its minified output changes — the hash changes and
// that script gets silently blocked.
//
// This reads the LIVE deployed pages (not a local build) on purpose: the minified
// inline-script bytes can differ slightly between a local build and the GitHub
// Actions build, and only the deployed bytes matter for the CSP. So run this AFTER
// your push has finished deploying.
//
// USAGE (Node 18+):
//   node scripts/csp-script-hashes.mjs
//
// Then: Cloudflare dashboard > aptelle.com > Rules > Overview >
//   "Security headers (CSP + friends)" > edit the Content-Security-Policy value,
//   replacing the script-src section with the line this prints.

import { createHash } from "node:crypto";

const BASE = "https://aptelle.com";

// Representative pages covering every unique inline script (Base = consent/tab/
// menu on all pages, hero/Turnstile on homes, gate on /validate, photo fallback
// on /team). Locale pages share the same scripts, but a couple are included as a
// guard against per-locale differences.
const PATHS = [
  "/", "/fr/", "/de/", "/ar/",
  "/team/", "/validate/", "/joined/", "/contact/", "/privacy/", "/terms/",
  "/this-path-does-not-exist-404/",
];

const re = /<script type="module">([\s\S]*?)<\/script>/g;
const hashes = new Set();

for (const p of PATHS) {
  const res = await fetch(BASE + p);
  const html = await res.text();
  let m;
  while ((m = re.exec(html)) !== null) {
    hashes.add(`'sha256-${createHash("sha256").update(m[1], "utf8").digest("base64")}'`);
  }
}

const list = [...hashes].sort();
console.log(`Found ${list.length} unique inline module scripts across ${PATHS.length} pages.\n`);
console.log("Paste this as the script-src section of the Cloudflare CSP:\n");
console.log(`script-src 'self' ${list.join(" ")} https://challenges.cloudflare.com;`);
