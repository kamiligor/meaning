import type { ColorPalette } from "@/lib/palettes";
import { LogoMark } from "./logo-mark";

type WatermarkVariant = "ghost" | "ghost-dark";

interface WatermarkProps {
  variant: WatermarkVariant;
  palette: ColorPalette;
  locale?: string;
}

export function Watermark({ variant, palette, locale }: WatermarkProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 45,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <LogoMark size="sm" variant={variant} palette={palette} locale={locale} />
    </div>
  );
}
