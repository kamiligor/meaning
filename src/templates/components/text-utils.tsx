import type { CSSProperties } from "react";

/**
 * Splits text into words, preserving which words are accent-marked via {curly braces}.
 * Returns array of { word, isAccent } for word-by-word rendering in Satori flex layout.
 */
function parseMarkedText(text: string): { word: string; isAccent: boolean }[] {
  const result: { word: string; isAccent: boolean }[] = [];
  const parts = text.split(/(\{[^}]+\})/);

  for (const part of parts) {
    if (part.startsWith("{") && part.endsWith("}")) {
      const inner = part.slice(1, -1);
      const words = inner.split(/\s+/).filter(Boolean);
      for (const w of words) {
        result.push({ word: w, isAccent: true });
      }
    } else {
      const words = part.split(/\s+/).filter(Boolean);
      for (const w of words) {
        result.push({ word: w, isAccent: false });
      }
    }
  }
  return result;
}

/**
 * Renders text with {accent} markers as word-by-word flex items.
 * Each word gets proper spacing via marginRight.
 */
export function AccentText({
  text,
  accentStyle,
  baseStyle,
}: {
  text: string;
  accentStyle: CSSProperties;
  baseStyle?: CSSProperties;
}) {
  const words = parseMarkedText(text);
  return (
    <span
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        ...baseStyle,
      }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            marginRight: i < words.length - 1 ? "0.3em" : 0,
            ...(w.isAccent ? accentStyle : {}),
          }}
        >
          {w.word}
        </span>
      ))}
    </span>
  );
}

/**
 * Renders text with {highlight} markers and paragraph support (\n\n).
 */
export function HighlightText({
  text,
  highlightColor,
  highlightBg,
  baseColor,
}: {
  text: string;
  highlightColor: string;
  highlightBg: string;
  baseColor: string;
}) {
  const paragraphs = text.split(/\n\n/);

  return (
    <span style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      {paragraphs.map((para, pi) => {
        const words = parseMarkedText(para);
        return (
          <span
            key={pi}
            style={{ display: "flex", flexWrap: "wrap", color: baseColor }}
          >
            {words.map((w, i) => (
              <span
                key={i}
                style={{
                  marginRight: i < words.length - 1 ? "0.3em" : 0,
                  ...(w.isAccent
                    ? {
                        color: highlightColor,
                        background: highlightBg,
                        padding: "2px 10px",
                        borderRadius: 5,
                      }
                    : {}),
                }}
              >
                {w.word}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
