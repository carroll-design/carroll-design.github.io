// Image pipeline (PLAN §2.1, §2.5).
//
// Drop original photos into assets-src/ (gitignored — originals may carry
// EXIF/GPS metadata and are never committed), then run `npm run images`.
// Each original is resized to 640w and 1280w WebP in public/images/, named
// <basename>-640.webp / <basename>-1280.webp. sharp strips metadata by
// default, so the committed copies are EXIF-free. Existing outputs are
// skipped; delete them to regenerate.
//
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SRC = "assets-src";
const OUT = path.join("public", "images");
const PHOTO_WIDTHS = [640, 1280];
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);

if (!fs.existsSync(SRC)) {
  console.log(`No ${SRC}/ directory — nothing to do.`);
  process.exit(0);
}
fs.mkdirSync(OUT, { recursive: true });

let made = 0;

const posix = (p) => p.split(path.sep).join("/");

/** Render every image directly inside `dir` into `OUT/subdir`. */
function render(dir, widths, subdir = "") {
  if (!fs.existsSync(dir)) return;
  const outDir = subdir ? path.join(OUT, subdir) : OUT;
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) continue;
    const ext = path.extname(file).toLowerCase();
    if (!EXTS.has(ext)) continue;
    const base = path.basename(file, path.extname(file));
    fs.mkdirSync(outDir, { recursive: true });
    for (const w of widths) {
      const out = path.join(outDir, `${base}-${w}.webp`);
      if (fs.existsSync(out)) {
        console.log(`skip   ${out} (exists)`);
        continue;
      }
      // sharp-cli reads --input as a glob, where a backslash is an escape
      // character, so Windows separators silently match nothing ("No input
      // files"). Hand it POSIX separators on every platform.
      execFileSync(
        "npx",
        [
          "--yes",
          "sharp-cli",
          "--input",
          posix(full),
          "--output",
          posix(out),
          "resize",
          String(w),
        ],
        { stdio: "inherit", shell: process.platform === "win32" },
      );
      made++;
    }
  }
}

render(SRC, PHOTO_WIDTHS);

console.log(made ? `done — ${made} file(s) written.` : "done — nothing new.");
