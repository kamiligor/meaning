/**
 * Generate logo.svg with text converted to paths (no font dependency).
 * Uses Satori + project fonts (Fraunces, Libre Baskerville).
 *
 * Usage: npx tsx src/scripts/generate-logo.ts
 */

import satori from "satori";
import { loadFonts } from "../lib/fonts";
import fs from "fs";
import path from "path";

async function main() {
  const fonts = await loadFonts();

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: 220,
          height: 96,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        children: [
          {
            type: "span",
            props: {
              style: {
                fontFamily: "Fraunces",
                fontWeight: 800,
                fontSize: 36,
                lineHeight: 1,
                color: "#1E2A36",
              },
              children: "Just",
            },
          },
          {
            type: "span",
            props: {
              style: {
                fontFamily: "LibreBaskerville",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: 1,
                color: "#8A99A8",
                marginTop: 3,
              },
              children: "have a little",
            },
          },
          {
            type: "span",
            props: {
              style: {
                fontFamily: "Fraunces",
                fontWeight: 800,
                fontSize: 36,
                lineHeight: 1,
                color: "#7B9E8C",
                marginTop: 1,
              },
              children: "meaning",
            },
          },
        ],
      },
    },
    { width: 220, height: 96, fonts }
  );

  const outPath = path.join(process.cwd(), "public", "logo.svg");
  fs.writeFileSync(outPath, svg, "utf-8");
  console.log(`Logo saved to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
