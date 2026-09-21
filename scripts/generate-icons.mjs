// Renders the "C" monogram using the site's paper/ink/accent palette to the
// PNG icon set:
//   public/icons/icon-192.png, public/icons/icon-512.png  (web app manifest)
//   src/app/apple-icon.png                                 (apple-touch-icon)
//   src/app/favicon.ico                                    (48px, PNG-in-ICO)
// favicon.ico exists for crawlers: Google's favicon picker wants a raster
// icon at a multiple of 48px and still probes the legacy /favicon.ico path
// (it 404'd before this). Browsers keep preferring icon.svg via its link tag.
// Uses next/og's ImageResponse (satori) because it renders text with real
// fonts; sharp's SVG rasterizer drops <text> on this platform.
// PNGs are full-bleed squares: Apple and maskable contexts apply their own
// rounding; the in-tab favicon stays icon.svg.
//
// Run: npm run icons  (needs network once, for the Newsreader font)

import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og.js";

const PAPER = "#bfd0d8";
const BROWN = "#3a2418";

async function loadGoogleFont(family, text) {
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/,
  );
  if (!resource) throw new Error(`font fetch failed for ${family}`);
  const res = await fetch(resource[1]);
  if (!res.ok) throw new Error(`font download failed for ${family}`);
  return res.arrayBuffer();
}

function monogram(size) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: PAPER,
        color: BROWN,
        fontFamily: "Newsreader",
        fontWeight: 700,
        fontSize: size * 0.92,
        lineHeight: 1,
        paddingTop: size * 0.03,
      },
      children: "C",
    },
  };
}

async function renderPng(font, size) {
  const image = new ImageResponse(monogram(size), {
    width: size,
    height: size,
    fonts: [{ name: "Newsreader", data: font, style: "normal", weight: 600 }],
  });
  return Buffer.from(await image.arrayBuffer());
}

function write(outFile, buf) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, buf);
  console.log(`wrote ${outFile} (${buf.length} bytes)`);
}

async function render(font, size, outFile) {
  write(outFile, await renderPng(font, size));
}

// ICO container with a single PNG-encoded 48x48 entry (valid since Vista;
// universally read by browsers and crawlers): 6-byte ICONDIR + one 16-byte
// ICONDIRENTRY, then the raw PNG.
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header.writeUInt8(size === 256 ? 0 : size, 6); // width
  header.writeUInt8(size === 256 ? 0 : size, 7); // height
  header.writeUInt8(0, 8); // palette
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // color planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14); // image bytes
  header.writeUInt32LE(22, 18); // image offset
  return Buffer.concat([header, png]);
}

const font = await loadGoogleFont("Newsreader:wght@700", "C");
await render(font, 1024, "public/icons/icon-1024.png");
await render(font, 512, "public/icons/icon-512.png");
await render(font, 256, "public/icons/icon-256.png");
await render(font, 192, "public/icons/icon-192.png");
await render(font, 180, "src/app/apple-icon.png");
write("src/app/favicon.ico", pngToIco(await renderPng(font, 96), 96));
