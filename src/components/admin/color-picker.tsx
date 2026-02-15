"use client";

const PALETTES = [
  {
    id: "sage",
    name: "Sage Green",
    primary: "#7B9E8C",
    primaryLight: "#a3c4b3",
    secondary: "#6B8BA4",
  },
  {
    id: "slate",
    name: "Slate Blue",
    primary: "#6B8BA4",
    primaryLight: "#8fafc6",
    secondary: "#7B9E8C",
  },
  {
    id: "warm",
    name: "Warm Terracotta",
    primary: "#B5836A",
    primaryLight: "#d4a68e",
    secondary: "#8A7B6B",
  },
  {
    id: "lavender",
    name: "Lavender",
    primary: "#8B7BAE",
    primaryLight: "#b0a3cb",
    secondary: "#7B9E8C",
  },
] as const;

interface ColorPickerProps {
  value: string;
  onChange: (paletteId: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {PALETTES.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition ${
            value === p.id
              ? "border-[#7B9E8C] bg-[#e8f0eb]/50"
              : "border-[#F1F4F6] hover:border-[#d1d8de]"
          }`}
        >
          <div className="flex gap-1">
            <div
              className="w-5 h-5 rounded-full"
              style={{ background: p.primary }}
            />
            <div
              className="w-5 h-5 rounded-full"
              style={{ background: p.primaryLight }}
            />
            <div
              className="w-5 h-5 rounded-full"
              style={{ background: p.secondary }}
            />
          </div>
          <span className="text-sm font-medium text-[#4A5B6A]">{p.name}</span>
        </button>
      ))}
    </div>
  );
}
