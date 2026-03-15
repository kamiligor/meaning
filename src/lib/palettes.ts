export type ColorPalette = {
  id: string;
  name: string;
  primary: string;
  primaryLight: string;
  primaryPale: string;
  secondary: string;
  secondaryLight: string;
  secondaryPale: string;
  bgWhite: string;
  bgCool: string;
  textDark: string;
  textMid: string;
  textLight: string;
};

const PALETTES: ColorPalette[] = [
  {
    id: "sage",
    name: "Sage Green",
    primary: "#7B9E8C",
    primaryLight: "#a3c4b3",
    primaryPale: "#e8f0eb",
    secondary: "#6B8BA4",
    secondaryLight: "#b5cede",
    secondaryPale: "#e9f1f6",
    bgWhite: "#FAFBFC",
    bgCool: "#F1F4F6",
    textDark: "#1E2A36",
    textMid: "#4A5B6A",
    textLight: "#8A99A8",
  },
  {
    id: "slate",
    name: "Slate Blue",
    primary: "#6B8BA4",
    primaryLight: "#8fafc6",
    primaryPale: "#e2ecf3",
    secondary: "#7B9E8C",
    secondaryLight: "#a3c4b3",
    secondaryPale: "#e8f0eb",
    bgWhite: "#FAFBFC",
    bgCool: "#EEF1F5",
    textDark: "#1E2A36",
    textMid: "#4A5B6A",
    textLight: "#8A99A8",
  },
  {
    id: "warm",
    name: "Warm Terracotta",
    primary: "#B5836A",
    primaryLight: "#d4a68e",
    primaryPale: "#f5ebe5",
    secondary: "#8A7B6B",
    secondaryLight: "#b5a898",
    secondaryPale: "#efe9e3",
    bgWhite: "#FDFBF9",
    bgCool: "#F5F1ED",
    textDark: "#2A1F1A",
    textMid: "#5C4E43",
    textLight: "#9A8D82",
  },
  {
    id: "lavender",
    name: "Lavender",
    primary: "#8B7BAE",
    primaryLight: "#b0a3cb",
    primaryPale: "#ede8f5",
    secondary: "#7B9E8C",
    secondaryLight: "#a3c4b3",
    secondaryPale: "#e8f0eb",
    bgWhite: "#FBFAFC",
    bgCool: "#F3F1F6",
    textDark: "#1E1A2E",
    textMid: "#4A4560",
    textLight: "#8A86A0",
  },
  {
    id: "rose",
    name: "Dusty Rose",
    primary: "#B0879B",
    primaryLight: "#CBA8B6",
    primaryPale: "#F2E8ED",
    secondary: "#7B9E8C",
    secondaryLight: "#a3c4b3",
    secondaryPale: "#e8f0eb",
    bgWhite: "#FCFAFB",
    bgCool: "#F5F1F3",
    textDark: "#2E1A24",
    textMid: "#5C4552",
    textLight: "#9A8690",
  },
];

const paletteMap = new Map(PALETTES.map((p) => [p.id, p]));

export function getPalette(id: string): ColorPalette {
  return paletteMap.get(id) ?? PALETTES[0];
}

export function getAllPalettes(): ColorPalette[] {
  return PALETTES;
}
