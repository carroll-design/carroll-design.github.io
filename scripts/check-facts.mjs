// Fact-integrity, PII, and style gate (PLAN §2.4, §2.5).
//
// Scans content/ and src/ for:
//   1. Unverified-claim markers ("[" + "VERIFY"): every factual claim not
//      taken verbatim from the resume carries one until the site owner signs
//      off.
//   2. PII that must never ship: phone numbers, the 88001 zip code.
//   3. Em dashes (U+2014): banned site-wide by rule (2026-07-16). Use a
//      comma, colon, semicolon, or middot instead; en dash only for ranges.
//
// Locally this warns and exits 0 so dev is never blocked. In CI (CI env var
// set, as on Vercel, or --ci flag) any finding exits 1 and blocks the deploy.

import fs from "node:fs";
import path from "node:path";

const ROOTS = ["content", "src"];
const EXTENSIONS = new Set([".md", ".mdx", ".ts", ".tsx", ".css", ".json"]);

// "[" + "VERIFY" is split so this file never flags itself via src scans of
// sibling tooling; the pattern matches the marker form "[VERIFY: ...]".
const MARKER = "[" + "VERIFY";

// Written as an escape so this file can never violate the rule it enforces.
const EM_DASH = "\u2014";

const PII_CHECKS = [
  { name: "phone number", re: /\(?\b\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b/ },
  { name: "zip code", re: /\b88001\b/ },
];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(path.extname(entry.name))) yield full;
  }
}

const findings = [];
for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      const at = `${file.replaceAll("\\", "/")}:${i + 1}`;
      if (line.includes(MARKER)) {
        findings.push({ at, kind: "unverified claim", line: line.trim() });
      }
      if (line.includes(EM_DASH)) {
        findings.push({ at, kind: "em dash (banned)", line: line.trim() });
      }
      for (const check of PII_CHECKS) {
        if (check.re.test(line)) {
          findings.push({ at, kind: `PII: ${check.name}`, line: line.trim() });
        }
      }
    });
  }
}

const ci = Boolean(process.env.CI) || process.argv.includes("--ci");

// Resume freshness. content/resume.mdx carries the month the PDF was regenerated, and
// nothing forces the two to agree, so a replaced PDF can silently keep an old
// date on the page.
//
// Local-only by design. In CI the repo is a fresh clone, so every file's mtime
// is the checkout time and the PDF would always look newer than any month we
// claim. Running this on Vercel would fail every deploy for no reason.
if (!ci) {
  try {
    const resume = fs.readFileSync(path.join("content", "resume.mdx"), "utf8");
    const claimed = resume.match(/^updated:\s*"?(\d{4})-(\d{2})"?\s*$/m);
    const pdf = path.join("public", "resume", "cameron-carroll-resume.pdf");
    if (claimed && fs.existsSync(pdf)) {
      const claimedEnd = new Date(Number(claimed[1]), Number(claimed[2]), 1);
      const built = fs.statSync(pdf).mtime;
      if (built >= claimedEnd) {
        console.log(
          `check:facts note: public/resume/cameron-carroll-resume.pdf was modified ` +
            `${built.toISOString().slice(0, 10)}, after the "updated: ` +
            `${claimed[1]}-${claimed[2]}" claimed in content/resume.mdx. ` +
            `Bump that field if you replaced the PDF.\n`,
        );
      }
    }
  } catch {
    // Freshness is a convenience check; never let it break the real gate.
  }
}

if (findings.length === 0) {
  console.log("check:facts clean: no unverified claims, no PII, no em dashes.");
  process.exit(0);
}

console.log(`check:facts: ${findings.length} finding(s):\n`);
for (const f of findings) {
  console.log(`  [${f.kind}] ${f.at}`);
  console.log(`      ${f.line.slice(0, 120)}\n`);
}

if (ci) {
  console.error(
    "CI mode: failing the build. Unverified claims and PII cannot reach the live site.",
  );
  process.exit(1);
}
console.log("Local mode: warning only (CI would fail).");
process.exit(0);
