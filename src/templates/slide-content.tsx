import type { Post, ColorPalette } from "@/db/schema";
import type { ContentSection } from "@/lib/content-sections";
import { SLIDE_WIDTH, SLIDE_HEIGHT } from "@/lib/constants";
import { Watermark } from "./components/watermark";
import { HighlightText } from "./components/text-utils";

export function SlideContentTemplate(post: Post, palette: ColorPalette, section?: ContentSection) {
  return (
    <div
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "120px 120px",
        background: palette.textDark,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Outfit",
      }}
    >
      {/* Background gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60%",
          height: "100%",
          background: `linear-gradient(135deg, transparent 0%, rgba(123,158,140,0.08) 100%)`,
        }}
      />

      {/* Large section number */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 70,
          fontFamily: "Fraunces",
          fontSize: 160,
          fontWeight: 900,
          color: "rgba(123,158,140,0.08)",
          lineHeight: 1,
        }}
      >
        {section?.sectionNumber ?? post.sectionNumber ?? "01"}
      </div>

      {/* Side dots */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 7,
            height: 28,
            borderRadius: 4,
            background: palette.primary,
            opacity: 1,
          }}
        />
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: palette.primary,
            opacity: 0.3,
          }}
        />
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: palette.primary,
            opacity: 0.3,
          }}
        />
      </div>

      {/* Tag with line prefix */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 35,
            height: 2.5,
            background: palette.primary,
          }}
        />
        <span
          style={{
            color: palette.primaryLight,
            fontSize: 16,
            letterSpacing: 5,
            textTransform: "uppercase" as const,
            fontWeight: 600,
          }}
        >
          {section?.tag ?? post.contentTag ?? "Why it works"}
        </span>
      </div>

      {/* Main text */}
      <div
        style={{
          fontFamily: "Fraunces",
          fontSize: 46,
          fontWeight: 600,
          lineHeight: 1.5,
          maxWidth: 850,
          display: "flex",
        }}
      >
        <HighlightText
          text={section?.body ?? post.contentBody}
          highlightColor={palette.primaryLight}
          highlightBg="rgba(123,158,140,0.12)"
          baseColor="rgba(255,255,255,0.92)"
        />
      </div>

      <Watermark variant="ghost-dark" palette={palette} />
    </div>
  );
}
