import type { ColorPalette } from "@/db/schema";
import { LogoMark } from "./logo-mark";

type WatermarkVariant = "ghost" | "ghost-dark";

interface WatermarkProps {
  variant: WatermarkVariant;
  palette: ColorPalette;
}

export function Watermark({ variant, palette }: WatermarkProps) {
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
      <LogoMark size="sm" variant={variant} palette={palette} />
    </div>
  );
}
