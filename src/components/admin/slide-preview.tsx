"use client";

import { DEFAULT_PALETTE } from "@/lib/constants";
import type { ContentSection } from "@/lib/content-sections";

interface PostData {
  topicTag: string;
  headline: string;
  subtitle: string;
  iconType: string;
  contentTag: string;
  contentBody: string;
  sectionNumber: string;
  contentSlides?: ContentSection[];
  quote: string;
  quoteAttribution: string;
  ctaText: string;
  hashtags: string;
  handleBio: string;
  colorPalette: string;
  logoVariant: string;
}

interface SlidePreviewProps {
  data: PostData;
  activeSlide: number;
  onSlideChange: (index: number) => void;
}

const p = DEFAULT_PALETTE;

function renderAccent(text: string, color: string) {
  if (!text) return null;
  const parts = text.split(/(\{[^}]+\})/);
  return parts.map((part, i) => {
    if (part.startsWith("{") && part.endsWith("}")) {
      return (
        <span key={i} style={{ color }}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderHighlight(text: string, color: string) {
  if (!text) return null;
  const paragraphs = text.split(/\n\n/);
  return paragraphs.map((para, pi) => {
    const parts = para.split(/(\{[^}]+\})/);
    return (
      <span key={pi} className={pi > 0 ? "mt-3 block" : ""}>
        {parts.map((part, i) => {
          if (part.startsWith("{") && part.endsWith("}")) {
            return (
              <span
                key={i}
                className="rounded px-1"
                style={{
                  color,
                  background: "rgba(123,158,140,0.12)",
                }}
              >
                {part.slice(1, -1)}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  });
}

const ICON_MAP: Record<string, string> = {
  clock: "\u23F0",
  sun: "\u2600\uFE0F",
  brain: "\uD83E\uDDE0",
  heart: "\u2764\uFE0F",
  leaf: "\uD83C\uDF3F",
};

function SlideTitle({ data }: { data: PostData }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        aspectRatio: "4/5",
        background: p.bgWhite,
        fontFamily: "var(--font-outfit), sans-serif",
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-[8%] -right-[6%] w-[40%] h-[40%] rounded-full"
        style={{ background: p.primaryPale, opacity: 0.6 }}
      />
      <div
        className="absolute -bottom-[13%] -left-[8%] w-[37%] h-[37%] rounded-full"
        style={{ background: "#e9f1f6", opacity: 0.5 }}
      />

      {/* Topic tag */}
      <div
        className="absolute top-[5%] text-[0.45em] font-semibold tracking-[0.3em] uppercase rounded-full px-4 py-1.5"
        style={{ color: p.primary, background: p.primaryPale }}
      >
        {data.topicTag || "Topic Tag"}
      </div>

      {/* Icon */}
      {data.iconType && data.iconType !== "none" && (
        <div className="text-[2em] mb-3 opacity-70">
          {ICON_MAP[data.iconType] || ""}
        </div>
      )}

      {/* Headline */}
      <div
        className="text-[1.65em] font-extrabold leading-tight text-center px-[10%] max-w-[85%]"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: p.textDark,
        }}
      >
        {renderAccent(data.headline || "Your {Headline} Here", p.primary)}
      </div>

      {/* Subtitle */}
      <div
        className="mt-3 text-[0.5em] tracking-[0.2em] uppercase font-medium flex items-center gap-1.5"
        style={{ color: p.textLight }}
      >
        {data.subtitle || "Swipe to learn why"}
        <span style={{ color: p.primary }}>&rarr;</span>
      </div>
    </div>
  );
}

function SlideContent({ data, section }: { data: PostData; section?: ContentSection }) {
  const tag = section?.tag ?? data.contentTag ?? "Why it works";
  const body = section?.body ?? data.contentBody ?? "";
  const sectionNumber = section?.sectionNumber ?? data.sectionNumber ?? "01";

  return (
    <div
      className="relative flex flex-col justify-center overflow-hidden px-[10%] py-[8%]"
      style={{
        aspectRatio: "4/5",
        background: p.textDark,
        fontFamily: "var(--font-outfit), sans-serif",
      }}
    >
      {/* Section number */}
      <div
        className="absolute top-[3%] right-[6%] font-extrabold"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "3.2em",
          color: "rgba(123,158,140,0.08)",
        }}
      >
        {sectionNumber}
      </div>

      {/* Side dots */}
      <div className="absolute left-[5%] top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
        <div
          className="w-1 h-3 rounded-sm"
          style={{ background: p.primary }}
        />
        <div
          className="w-1 h-1 rounded-full"
          style={{ background: p.primary, opacity: 0.3 }}
        />
        <div
          className="w-1 h-1 rounded-full"
          style={{ background: p.primary, opacity: 0.3 }}
        />
      </div>

      {/* Tag */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-0.5" style={{ background: p.primary }} />
        <span
          className="text-[0.4em] tracking-[0.3em] uppercase font-semibold"
          style={{ color: p.primaryLight }}
        >
          {tag}
        </span>
      </div>

      {/* Content body */}
      <div
        className="text-[0.95em] font-semibold leading-relaxed"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "rgba(255,255,255,0.92)",
        }}
      >
        {renderHighlight(
          body || "Your content with {highlighted} words goes here.",
          p.primaryLight
        )}
      </div>
    </div>
  );
}

function SlideQuote({ data }: { data: PostData }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        aspectRatio: "4/5",
        background: p.bgCool,
        fontFamily: "var(--font-outfit), sans-serif",
      }}
    >
      {/* Concentric circles */}
      <div
        className="w-[35%] aspect-square rounded-full flex items-center justify-center"
        style={{ border: `1px solid rgba(123,158,140,0.15)` }}
      >
        <div
          className="w-[80%] aspect-square rounded-full flex items-center justify-center"
          style={{ border: `1px solid rgba(123,158,140,0.12)` }}
        >
          <div
            className="w-[75%] aspect-square rounded-full flex items-center justify-center text-[1.5em]"
            style={{
              background: `linear-gradient(135deg, ${p.primaryPale}, rgba(181,206,222,0.3))`,
            }}
          >
            {ICON_MAP[data.iconType] || ICON_MAP.sun}
          </div>
        </div>
      </div>

      {/* Quote text */}
      <div
        className="text-[1.05em] font-bold text-center px-[8%] mt-5 leading-snug"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: p.textDark,
        }}
      >
        {renderAccent(
          data.quote || 'Your {inspirational} quote goes here',
          p.primary
        )}
      </div>

      {/* Divider */}
      <div
        className="w-8 h-0.5 mt-3"
        style={{ background: p.primary, opacity: 0.4 }}
      />

      {/* Attribution */}
      {data.quoteAttribution && (
        <div
          className="mt-2 text-[0.4em] tracking-[0.25em] uppercase font-medium"
          style={{ color: p.textLight }}
        >
          {data.quoteAttribution}
        </div>
      )}
    </div>
  );
}

function SlideCTA({ data }: { data: PostData }) {
  const hashtags = (() => {
    try {
      const parsed = JSON.parse(data.hashtags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return data.hashtags
        ? data.hashtags.split(/[\s,]+/).filter(Boolean)
        : [];
    }
  })();

  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        aspectRatio: "4/5",
        background: p.bgWhite,
        fontFamily: "var(--font-outfit), sans-serif",
      }}
    >
      {/* Background blob */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-square rounded-full"
        style={{ background: p.primaryPale, opacity: 0.35 }}
      />

      {/* Logo text */}
      <div className="flex flex-col items-center relative z-10">
        <span
          className="text-[0.3em] italic"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: p.textLight,
          }}
        >
          just
        </span>
        <span
          className="text-[1.1em] font-extrabold -mt-0.5"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: data.logoVariant === "dark" ? "#fff" : p.textDark,
          }}
        >
          have
        </span>
        <span
          className="text-[0.3em] italic -mt-0.5"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: p.primary,
          }}
        >
          a little
        </span>
        <span
          className="text-[1.1em] font-extrabold -mt-0.5"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: p.primary,
          }}
        >
          meaning
        </span>
      </div>

      {/* Handle */}
      <div className="text-[0.5em] font-semibold mt-3" style={{ color: p.textDark }}>
        @justhavealittlemeaning
      </div>
      <div className="text-[0.38em] mt-0.5 tracking-wider" style={{ color: p.textLight }}>
        {data.handleBio || "psychology \u00B7 life hacks \u00B7 mental health"}
      </div>

      {/* CTA text */}
      <div
        className="text-[1.15em] font-extrabold text-center px-[10%] mt-4 leading-tight"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: p.textDark,
        }}
      >
        {renderAccent(
          data.ctaText || "Follow for {more} psychology life hacks",
          p.primary
        )}
      </div>

      {/* Follow button */}
      <div
        className="mt-4 px-6 py-2 rounded-full text-white text-[0.45em] tracking-[0.25em] uppercase font-semibold flex items-center gap-1.5"
        style={{ background: p.primary }}
      >
        Follow <span className="text-[1.2em]">+</span>
      </div>

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div className="absolute bottom-[5%] flex gap-2 flex-wrap justify-center px-4">
          {hashtags.slice(0, 4).map((tag: string, i: number) => (
            <span
              key={i}
              className="text-[0.32em] font-medium px-2.5 py-1 rounded-full"
              style={{
                color: p.textLight,
                background: p.bgCool,
              }}
            >
              {tag.startsWith("#") ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function SlidePreview({ data, activeSlide, onSlideChange }: SlidePreviewProps) {
  const sections = data.contentSlides && data.contentSlides.length > 0
    ? data.contentSlides
    : [{ tag: data.contentTag, body: data.contentBody, sectionNumber: data.sectionNumber }];

  const slideComponents = [
    <SlideTitle key="title" data={data} />,
    ...sections.map((s, i) => <SlideContent key={`content-${i}`} data={data} section={s} />),
    <SlideQuote key="quote" data={data} />,
    <SlideCTA key="cta" data={data} />,
  ];

  const slideLabels = [
    "Title",
    ...sections.map((_, i) => sections.length > 1 ? `Content ${i + 1}` : "Content"),
    "Quote",
    "CTA",
  ];

  const safeActive = Math.min(activeSlide, slideComponents.length - 1);

  return (
    <div>
      {/* Active slide */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-[#F1F4F6] text-[16px]">
        {slideComponents[safeActive]}
      </div>

      {/* Slide selector thumbnails */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {slideLabels.map((label, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSlideChange(i)}
            className={`flex-1 min-w-0 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition ${
              safeActive === i
                ? "bg-[#7B9E8C] text-white"
                : "bg-[#F1F4F6] text-[#8A99A8] hover:bg-[#e4e9ed]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
