interface BarChartPoint {
  day: string;
  value: number;
}

interface BarChartSimpleProps {
  data: BarChartPoint[];
  caption: string;
  formatLabel?: (day: string) => string;
}

/**
 * Plain CSS bar chart, no charting library. Every chart carries a
 * figcaption describing the trend in words and a visually hidden table
 * with the raw data, so screen reader users get the same information as
 * a sighted user reading the bars.
 */
export function BarChartSimple({
  data,
  caption,
  formatLabel = (day) => day,
}: BarChartSimpleProps) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <figure className="bg-white rounded-xl border border-[#e2e7eb] p-5">
      <figcaption className="text-sm font-medium text-[#1E2A36] mb-4">
        {caption}
      </figcaption>
      <div className="flex items-end gap-1.5 h-32" aria-hidden="true">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center justify-end h-full min-w-0"
            title={`${d.day}: ${d.value}`}
          >
            <div
              className="w-full bg-[#7B9E8C] rounded-t"
              style={{
                height: `${Math.max(2, Math.round((d.value / max) * 100))}%`,
              }}
            />
            <span className="mt-1.5 text-[10px] text-[#8A99A8] truncate w-full text-center">
              {formatLabel(d.day)}
            </span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Dzień</th>
            <th scope="col">Wartość</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.day}</td>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
