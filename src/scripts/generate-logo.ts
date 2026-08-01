/**
 * Generate the brand logos with text converted to paths (no font dependency).
 * Uses Satori + project fonts (Fraunces, Libre Baskerville).
 *
 * English (justmeaning.com): Just / have a little / meaning
 * Polish  (poprostusens.pl):  po prostu / sens
 *
 * Usage: npx tsx src/scripts/generate-logo.ts
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { loadFonts } from "../lib/fonts";
import fs from "fs";
import path from "path";

const INK = "#1E2A36";
const SLATE = "#8A99A8";
const SAGE = "#7B9E8C";

const W = 220;
const H = 96;

interface Line {
  text: string;
  font: "Fraunces" | "LibreBaskerville";
  size: number;
  color: string;
  italic?: boolean;
  marginTop?: number;
}

function span(line: Line, scale: number) {
  return {
    type: "span",
    props: {
      style: {
        fontFamily: line.font,
        fontWeight: line.font === "Fraunces" ? 800 : 400,
        ...(line.italic ? { fontStyle: "italic" } : {}),
        fontSize: line.size * scale,
        lineHeight: 1,
        color: line.color,
        ...(line.marginTop ? { marginTop: line.marginTop * scale } : {}),
      },
      children: line.text,
    },
  };
}

function lockup(
  lines: Line[],
  width: number,
  height: number,
  scale: number,
  background?: string
) {
  return {
    type: "div",
    props: {
      style: {
        width,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // SVG logos stay transparent; only the raster copy gets a ground.
        ...(background ? { backgroundColor: background } : {}),
      },
      children: lines.map((l) => span(l, scale)),
    },
  };
}

const EN: Line[] = [
  { text: "Just", font: "Fraunces", size: 36, color: INK },
  { text: "have a little", font: "LibreBaskerville", size: 12, color: SLATE, italic: true, marginTop: 3 },
  { text: "meaning", font: "Fraunces", size: 36, color: SAGE, marginTop: 1 },
];

const PL: Line[] = [
  { text: "po prostu", font: "Fraunces", size: 22, color: INK },
  { text: "sens", font: "Fraunces", size: 44, color: SAGE, marginTop: 5 },
];

async function main() {
  const fonts = await loadFonts();
  const publicDir = path.join(process.cwd(), "public");

  for (const [file, lines] of [
    ["logo.svg", EN],
    ["logo-pl.svg", PL],
  ] as const) {
    const svg = await satori(
      lockup(lines, W, H, 1) as unknown as React.ReactNode,
      { width: W, height: H, fonts }
    );
    const out = path.join(publicDir, file);
    fs.writeFileSync(out, svg, "utf-8");
    console.log(`${file} written`);
  }

  // Raster copy of the Polish logo for structured data, matching the
  // proportions of the existing logo.png.
  const PNG_W = 1256;
  const PNG_H = 904;
  const pngSvg = await satori(
    lockup(PL, PNG_W, PNG_H, 4, "#FFFFFF") as unknown as React.ReactNode,
    { width: PNG_W, height: PNG_H, fonts }
  );
  const png = new Resvg(pngSvg, { background: "#FFFFFF" }).render().asPng();
  fs.writeFileSync(path.join(publicDir, "logo-pl.png"), png);
  console.log("logo-pl.png written");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
