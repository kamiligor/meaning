import type { Post } from "@/db/schema";
import type { ColorPalette } from "@/lib/palettes";
import { SLIDE_WIDTH, SLIDE_HEIGHT } from "@/lib/constants";
import { Watermark } from "./components/watermark";
import { iconMap, SunIcon } from "./components/svg-icons";
import { AccentText } from "./components/text-utils";

export function SlideQuoteTemplate(post: Post, palette: ColorPalette, options?: { hideIcon?: boolean }) {
  const QuoteIcon = post.quoteIconType && iconMap[post.quoteIconType]
    ? iconMap[post.quoteIconType]
    : SunIcon;

  return (
    <div
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: palette.bgCool,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Outfit",
      }}
    >
      {/* Concentric circles */}
      <div
        style={{
          width: 480,
          height: 480,
          borderRadius: "50%",
          border: "1px solid rgba(123,158,140,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Orbit dots */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: palette.primary,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: palette.primary,
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 15,
            transform: "translateY(-50%)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: palette.primary,
            opacity: 0.4,
          }}
        />

        {/* Middle circle */}
        <div
          style={{
            width: 380,
            height: 380,
            borderRadius: "50%",
            border: "1px solid rgba(123,158,140,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Inner circle with gradient (Satori doesn't support radial-gradient, using linear) */}
          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${palette.primaryPale} 0%, rgba(181,206,222,0.3) 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!options?.hideIcon && <QuoteIcon color={palette.primary} size={80} />}
          </div>
        </div>
      </div>

      {/* Quote text */}
      <div
        style={{
          fontFamily: "Fraunces",
          fontSize: 50,
          fontWeight: 700,
          color: palette.textDark,
          lineHeight: 1.4,
          maxWidth: 780,
          padding: "0 80px",
          marginTop: 65,
          textAlign: "center" as const,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AccentText
          text={post.quote}
          accentStyle={{ color: palette.primary }}
        />
      </div>

      {/* Divider */}
      <div
        style={{
          width: 45,
          height: 2.5,
          background: palette.primary,
          marginTop: 35,
          opacity: 0.4,
        }}
      />

      {/* Attribution */}
      {post.quoteAttribution && (
        <div
          style={{
            marginTop: 22,
            color: palette.textLight,
            fontSize: 17,
            letterSpacing: 4,
            textTransform: "uppercase" as const,
            fontWeight: 500,
          }}
        >
          {post.quoteAttribution}
        </div>
      )}

      <Watermark variant="ghost" palette={palette} />
    </div>
  );
}
