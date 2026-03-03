import type { Post } from "@/db/schema";
import type { ColorPalette } from "@/lib/palettes";
import { SLIDE_WIDTH, SLIDE_HEIGHT } from "@/lib/constants";
import { Watermark } from "./components/watermark";
import { iconMap } from "./components/svg-icons";
import { AccentText } from "./components/text-utils";

export function SlideTitleTemplate(post: Post, palette: ColorPalette, options?: { arrowDown?: boolean }) {
  const IconComponent = post.iconType && post.iconType !== "none"
    ? iconMap[post.iconType]
    : null;

  return (
    <div
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: palette.bgWhite,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Outfit",
      }}
    >
      {/* Background circle top-right */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 550,
          height: 550,
          borderRadius: "50%",
          background: palette.primaryPale,
          opacity: 0.6,
        }}
      />
      {/* Background circle bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: -180,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: palette.secondaryPale,
          opacity: 0.5,
        }}
      />

      {/* Topic tag pill */}
      <div
        style={{
          position: "absolute",
          top: 70,
          display: "flex",
          color: palette.primary,
          fontSize: 18,
          letterSpacing: 5,
          textTransform: "uppercase" as const,
          fontWeight: 600,
          background: palette.primaryPale,
          padding: "14px 34px",
          borderRadius: 30,
        }}
      >
        {post.topicTag}
      </div>

      {/* Icon */}
      {IconComponent && (
        <div style={{ marginBottom: 50, display: "flex" }}>
          <IconComponent color={palette.primary} size={110} />
        </div>
      )}

      {/* Headline */}
      <div
        style={{
          fontFamily: "Fraunces",
          fontWeight: 800,
          fontSize: 82,
          lineHeight: 1.12,
          color: palette.textDark,
          maxWidth: 800,
          padding: "0 60px",
          display: "flex",
          textAlign: "center" as const,
          justifyContent: "center",
        }}
      >
        <AccentText
          text={post.headline}
          accentStyle={{ color: palette.primary }}
        />
      </div>

      {/* Subtitle with arrow */}
      <div
        style={{
          marginTop: 50,
          color: palette.textLight,
          fontSize: 20,
          letterSpacing: 3,
          textTransform: "uppercase" as const,
          fontWeight: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: options?.arrowDown ? 16 : 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {post.subtitle || "Swipe to learn why"}
          {!options?.arrowDown && (
            <svg width="45" height="12" viewBox="0 0 45 12">
              <line x1="0" y1="6" x2="35" y2="6" stroke={palette.primary} strokeWidth="2" />
              <polyline
                points="30,1 35,6 30,11"
                fill="none"
                stroke={palette.primary}
                strokeWidth="2"
              />
            </svg>
          )}
        </div>
        {options?.arrowDown && (
          <svg width="12" height="45" viewBox="0 0 12 45">
            <line x1="6" y1="0" x2="6" y2="35" stroke={palette.primary} strokeWidth="2" />
            <polyline
              points="1,30 6,35 11,30"
              fill="none"
              stroke={palette.primary}
              strokeWidth="2"
            />
          </svg>
        )}
      </div>

      <Watermark variant="ghost" palette={palette} />
    </div>
  );
}
