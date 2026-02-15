import { readFile } from "fs/promises";
import { join } from "path";

type SatoriFont = {
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: "normal" | "italic";
};

let cache: SatoriFont[] | null = null;

export async function loadFonts(): Promise<SatoriFont[]> {
  if (cache) return cache;

  const dir = join(process.cwd(), "public", "fonts");

  const entries: { file: string; name: string; weight: SatoriFont["weight"]; style: SatoriFont["style"] }[] = [
    { file: "Outfit-Regular.ttf", name: "Outfit", weight: 400, style: "normal" },
    { file: "Outfit-Medium.ttf", name: "Outfit", weight: 500, style: "normal" },
    { file: "Outfit-SemiBold.ttf", name: "Outfit", weight: 600, style: "normal" },
    { file: "Outfit-Bold.ttf", name: "Outfit", weight: 700, style: "normal" },
    { file: "Fraunces-SemiBold.ttf", name: "Fraunces", weight: 600, style: "normal" },
    { file: "Fraunces-Bold.ttf", name: "Fraunces", weight: 700, style: "normal" },
    { file: "Fraunces-ExtraBold.ttf", name: "Fraunces", weight: 800, style: "normal" },
    { file: "Fraunces-Black.ttf", name: "Fraunces", weight: 900, style: "normal" },
    { file: "LibreBaskerville-Regular.ttf", name: "LibreBaskerville", weight: 400, style: "normal" },
    { file: "LibreBaskerville-Italic.ttf", name: "LibreBaskerville", weight: 400, style: "italic" },
    { file: "LibreBaskerville-Bold.ttf", name: "LibreBaskerville", weight: 700, style: "normal" },
  ];

  cache = await Promise.all(
    entries.map(async (e) => ({
      name: e.name,
      data: (await readFile(join(dir, e.file))).buffer as ArrayBuffer,
      weight: e.weight,
      style: e.style,
    }))
  );

  return cache;
}
