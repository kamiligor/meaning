export interface FunnelStep {
  label: string;
  count: number;
}

interface FunnelBarsProps {
  /** First step is treated as the 100% base (e.g. "Zapis"). */
  steps: FunnelStep[];
  caption: string;
}

/**
 * Horizontal funnel, same visual language as the bar chart. Extracted from
 * the inline funnel that used to live in admin/kurs/page.tsx, plus the
 * "drops here" percentage between consecutive steps.
 */
export function FunnelBars({ steps, caption }: FunnelBarsProps) {
  const base = steps[0]?.count ?? 0;
  const withPct = steps.map((step) => ({
    ...step,
    pct: base > 0 ? Math.round((step.count / base) * 100) : 0,
  }));

  return (
    <figure>
      <figcaption className="text-sm font-medium text-[#1E2A36] mb-4">
        {caption}
      </figcaption>
      <div className="space-y-3" aria-hidden="true">
        {withPct.map((step, i) => {
          const prev = i > 0 ? withPct[i - 1] : null;
          const drop = prev ? prev.pct - step.pct : null;
          return (
            <div key={`${step.label}-${i}`} className="flex items-center gap-4">
              <span className="w-48 shrink-0 text-sm text-[#1E2A36] truncate">
                {step.label}
              </span>
              <div className="flex-1 h-4 bg-[#F1F4F6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7B9E8C] rounded-full"
                  style={{ width: `${step.pct}%` }}
                />
              </div>
              <span className="w-52 shrink-0 text-xs text-[#4A5B6A] text-right">
                {step.pct}% ({step.count})
                {drop !== null && drop > 0 && (
                  <span className="text-red-700"> · -{drop}% porzuca tu</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Krok</th>
            <th scope="col">Liczba</th>
            <th scope="col">Procent bazy</th>
          </tr>
        </thead>
        <tbody>
          {withPct.map((step, i) => (
            <tr key={`${step.label}-sr-${i}`}>
              <td>{step.label}</td>
              <td>{step.count}</td>
              <td>{step.pct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
