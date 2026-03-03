import type { ColorPalette } from "@/db/schema";

type LogoSize = "sm" | "lg";
type LogoVariant = "light" | "dark" | "ghost" | "ghost-dark";

interface LogoMarkProps {
  size: LogoSize;
  variant: LogoVariant;
  palette: ColorPalette;
}

const sizes = {
  sm: {
    padding: 16,
    bracketWidth: 10,
    just: { fontSize: 24 },
    haveLittle: { fontSize: 8, margin: "2px 0 -3px 0" },
    meaning: { fontSize: 24 },
  },
  lg: {
    padding: 30,
    bracketWidth: 18,
    just: { fontSize: 54 },
    haveLittle: { fontSize: 16, margin: "4px 0 -8px 0" },
    meaning: { fontSize: 54 },
  },
} as const;

function getColors(variant: LogoVariant, palette: ColorPalette) {
  switch (variant) {
    case "light":
      return {
        just: palette.textDark,
        haveLittle: palette.textLight,
        meaning: palette.primary,
        bracket: palette.primary,
        bracketOpacity: 0.3,
      };
    case "dark":
      return {
        just: "#fff",
        haveLittle: "rgba(255,255,255,0.3)",
        meaning: palette.primaryLight,
        bracket: palette.primary,
        bracketOpacity: 0.3,
      };
    case "ghost":
      return {
        just: "rgba(30,42,54,0.2)",
        haveLittle: "rgba(138,153,168,0.35)",
        meaning: "rgba(123,158,140,0.3)",
        bracket: palette.primary,
        bracketOpacity: 0.1,
      };
    case "ghost-dark":
      return {
        just: "rgba(255,255,255,0.12)",
        haveLittle: "rgba(255,255,255,0.1)",
        meaning: "rgba(163,196,179,0.12)",
        bracket: palette.primary,
        bracketOpacity: 0.06,
      };
  }
}

export function LogoMark({ size, variant, palette }: LogoMarkProps) {
  const s = sizes[size];
  const c = getColors(variant, palette);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
          borderTop: `1.5px solid ${c.bracket}`,
          borderBottom: `1.5px solid ${c.bracket}`,
          borderLeft: `1.5px solid ${c.bracket}`,
          borderRadius: "5px 0 0 5px",
          opacity: c.bracketOpacity,
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
          borderTop: `1.5px solid ${c.bracket}`,
          borderBottom: `1.5px solid ${c.bracket}`,
          borderRight: `1.5px solid ${c.bracket}`,
          borderRadius: "0 5px 5px 0",
          opacity: c.bracketOpacity,
        }}
      />

      <span
        style={{
          fontFamily: "Fraunces",
          fontWeight: 800,
          fontSize: s.just.fontSize,
          lineHeight: 1.05,
          color: c.just,
        }}
      >
        just
      </span>
      <span
        style={{
          fontFamily: "LibreBaskerville",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: s.haveLittle.fontSize,
          lineHeight: 1,
          color: c.haveLittle,
          margin: s.haveLittle.margin,
        }}
      >
        have a little
      </span>
      <span
        style={{
          fontFamily: "Fraunces",
          fontWeight: 800,
          fontSize: s.meaning.fontSize,
          lineHeight: 1.05,
          color: c.meaning,
        }}
      >
        meaning
      </span>
    </div>
  );
}
