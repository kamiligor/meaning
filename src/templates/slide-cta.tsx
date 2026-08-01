import type { PostData } from "@/lib/posts";
import type { ColorPalette } from "@/lib/palettes";
import { SLIDE_WIDTH, SLIDE_HEIGHT } from "@/lib/constants";
import { LogoMark } from "./components/logo-mark";
import { AccentText } from "./components/text-utils";

export function SlideCTATemplate(post: PostData, palette: ColorPalette) {
  const hashtags: string[] = (() => {
    try {
      return JSON.parse(post.hashtags);
    } catch {
      return post.hashtags.split(/\s+/).filter(Boolean);
    }
  })();

  // Show max 4 hashtags on the slide
  const displayTags = hashtags.slice(0, 4);
  const logoVariant = (post.logoVariant === "dark" ? "dark" : "light") as "light" | "dark";
  const followLabel = post.locale === "pl" ? "Obserwuj" : "Follow";

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
      {/* Background blob (approximated since no radial-gradient in Satori) */}
      <div
        style={{
          position: "absolute",
          width: 750,
          height: 750,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: palette.primaryPale,
          opacity: 0.35,
        }}
      />

      {/* Logo */}
      <div style={{ display: "flex" }}>
        <LogoMark size="lg" variant={logoVariant} palette={palette} locale={post.locale} />
      </div>

      {/* Handle name */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 600,
          color: palette.textDark,
          letterSpacing: 0.5,
          marginTop: 35,
          marginBottom: 8,
        }}
      >
        @justhavealittlemeaning
      </div>

      {/* Handle bio */}
      <div
        style={{
          fontSize: 24,
          color: palette.textLight,
          letterSpacing: 1,
          marginBottom: 50,
        }}
      >
        {post.handleBio || "psychology · life hacks · mental health"}
      </div>

      {/* CTA text */}
      <div
        style={{
          fontFamily: "Fraunces",
          fontSize: 78,
          fontWeight: 800,
          color: palette.textDark,
          lineHeight: 1.2,
          maxWidth: 820,
          marginBottom: 55,
          textAlign: "center" as const,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AccentText
          text={post.ctaText || "Follow for {more} psychology life hacks"}
          accentStyle={{ color: palette.primary }}
        />
      </div>

      {/* Follow button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "26px 65px",
          background: palette.primary,
          color: "#fff",
          fontSize: 24,
          letterSpacing: 4,
          textTransform: "uppercase" as const,
          fontWeight: 600,
          borderRadius: 50,
        }}
      >
        <span>{followLabel}</span>
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Hashtag pills */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          display: "flex",
          gap: 20,
        }}
      >
        {displayTags.map((tag, i) => (
          <div
            key={i}
            style={{
              color: palette.textLight,
              fontSize: 20,
              letterSpacing: 1,
              background: palette.bgCool,
              padding: "12px 24px",
              borderRadius: 22,
              fontWeight: 500,
            }}
          >
            {tag.startsWith("#") ? tag : `#${tag}`}
          </div>
        ))}
      </div>
    </div>
  );
}
