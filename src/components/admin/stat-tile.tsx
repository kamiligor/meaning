interface Delta {
  current: number;
  previous: number;
}

interface StatTileProps {
  label: string;
  value: string | number;
  delta?: Delta;
}

/**
 * Single metric tile, reused across the stats sections instead of the
 * duplicated inline JSX that used to live in admin/kurs/page.tsx.
 */
export function StatTile({ label, value, delta }: StatTileProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e7eb] p-5">
      <p className="text-xs text-[#8A99A8] uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-semibold text-[#1E2A36]">{value}</p>
      {delta && (
        <p className="text-xs font-medium mt-1">
          <DeltaText delta={delta} />
        </p>
      )}
    </div>
  );
}

/**
 * Renders the comparison to the previous period. Never relies on color
 * alone — the arrow and the sign are always in the text itself.
 */
function DeltaText({ delta }: { delta: Delta }) {
  if (delta.previous === 0) {
    return <span className="text-[#8A99A8]">—</span>;
  }
  const pct = Math.round(
    ((delta.current - delta.previous) / delta.previous) * 100
  );
  const up = pct >= 0;
  return (
    <span className={up ? "text-[#7B9E8C]" : "text-red-700"}>
      {up ? "↑" : "↓"} {Math.abs(pct)}%
    </span>
  );
}
