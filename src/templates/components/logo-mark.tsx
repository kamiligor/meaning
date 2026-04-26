import type { ColorPalette } from "@/lib/palettes";
import fs from "fs";
import path from "path";

type LogoSize = "sm" | "lg";
type LogoVariant = "light" | "dark" | "ghost" | "ghost-dark";

interface LogoMarkProps {
  size: LogoSize;
  variant: LogoVariant;
  palette: ColorPalette;
}

// Read base SVG once at module load (build-time only, used by Satori)
const baseSvg = fs.readFileSync(
  path.join(process.cwd(), "public", "logo.svg"),
  "utf-8",
);

const sizes = {
  sm: { height: 48, padding: 16, bracketWidth: 10 },
  lg: { height: 96, padding: 30, bracketWidth: 18 },
} as const;

function recolor(
  svg: string,
  justColor: string,
  haveLittleColor: string,
  meaningColor: string,
): string {
  return svg
    .replace(/fill="#1E2A36"/g, `fill="${justColor}"`)
    .replace(/fill="#8A99A8"/g, `fill="${haveLittleColor}"`)
    .replace(/fill="#7B9E8C"/g, `fill="${meaningColor}"`);
}

function getLogoSrc(variant: LogoVariant, palette: ColorPalette): string {
  let svg = baseSvg;

  switch (variant) {
    case "light":
      break;
    case "dark":
      svg = recolor(svg, "#ffffff", "#ffffff4D", palette.primaryLight);
      break;
    case "ghost":
      break;
    case "ghost-dark":
      svg = recolor(svg, "#ffffff", "#ffffff", "#ffffff");
      break;
  }

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function getStyle(variant: LogoVariant, palette: ColorPalette) {
  switch (variant) {
    case "light":
      return { opacity: 1, bracket: palette.primary, bracketOpacity: 0.3 };
    case "dark":
      return { opacity: 1, bracket: palette.primary, bracketOpacity: 0.3 };
    case "ghost":
      return { opacity: 0.25, bracket: palette.primary, bracketOpacity: 0.1 };
    case "ghost-dark":
      return { opacity: 0.1, bracket: palette.primary, bracketOpacity: 0.06 };
  }
}

export function LogoMark({ size, variant, palette }: LogoMarkProps) {
  const s = sizes[size];
  const v = getStyle(variant, palette);
  const src = getLogoSrc(variant, palette);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: `0 ${s.padding}px`,
      }}
    >
      {/* Left bracket */}
      <div
        style={{
          position: "absolute",
          left: -12,
          top: "10%",
          width: s.bracketWidth,
          height: "80%",
          borderTop: `1.5px solid ${v.bracket}`,
          borderBottom: `1.5px solid ${v.bracket}`,
          borderLeft: `1.5px solid ${v.bracket}`,
          borderRadius: "5px 0 0 5px",
          opacity: v.bracketOpacity,
        }}
      />
      {/* Right bracket */}
      <div
        style={{
          position: "absolute",
          right: -12,
          top: "10%",
          width: s.bracketWidth,
          height: "80%",
          borderTop: `1.5px solid ${v.bracket}`,
          borderBottom: `1.5px solid ${v.bracket}`,
          borderRight: `1.5px solid ${v.bracket}`,
          borderRadius: "0 5px 5px 0",
          opacity: v.bracketOpacity,
        }}
      />

      {/* Logo from SVG — single source of truth */}
      <img
        src={src}
        alt="Just have a little meaning"
        style={{ height: s.height, opacity: v.opacity }}
      />
    </div>
  );
}
