interface ContentTextProps {
  body: string;
  tag?: string | null;
}

export function ContentText({ body, tag }: ContentTextProps) {
  const paragraphs = body.split("\\n\\n");

  return (
    <div>
      {tag && (
        <p className="text-xs font-semibold tracking-widest uppercase text-[#7B9E8C] mb-3">
          {tag}
        </p>
      )}
      <div className="space-y-4 text-[#4A5B6A] text-[15px] leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i}>
            {p.split(/(\{[^}]+\})/).map((segment, j) =>
              segment.startsWith("{") && segment.endsWith("}") ? (
                <span key={j} className="text-[#7B9E8C] font-semibold">
                  {segment.slice(1, -1)}
                </span>
              ) : (
                <span key={j}>{segment}</span>
              )
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
