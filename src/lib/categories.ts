import type { Locale } from "./i18n";

export interface CategoryDef {
  key: string;
  palette: string;
  en: { slug: string; label: string };
  pl: { slug: string; label: string };
}

export const CATEGORIES: CategoryDef[] = [
  {
    key: "habits-routines",
    palette: "warm",
    en: { slug: "habits-routines", label: "Habits" },
    pl: { slug: "nawyki-i-rutyny", label: "Nawyki" },
  },
  {
    key: "emotional-intelligence",
    palette: "lavender",
    en: { slug: "emotional-intelligence", label: "Emotions" },
    pl: { slug: "inteligencja-emocjonalna", label: "Emocje" },
  },
  {
    key: "mindset-motivation",
    palette: "rose",
    en: { slug: "mindset-motivation", label: "Mindset" },
    pl: { slug: "nastawienie-i-motywacja", label: "Nastawienie" },
  },
  {
    key: "stress-resilience",
    palette: "slate",
    en: { slug: "stress-resilience", label: "Resilience" },
    pl: { slug: "stres-i-odpornosc", label: "Odporność" },
  },
  {
    key: "meaning-purpose",
    palette: "sage",
    en: { slug: "meaning-purpose", label: "Purpose" },
    pl: { slug: "sens-i-cel", label: "Sens" },
  },
];

export function getCategoryByKey(key: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.key === key);
}

export function getCategoryByLocalizedSlug(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.en.slug === slug || c.pl.slug === slug);
}

export function getCategoryUrl(key: string, locale: Locale): string {
  const cat = getCategoryByKey(key);
  if (!cat) return "/";
  return locale === "pl"
    ? `/kategoria/${cat.pl.slug}`
    : `/category/${cat.en.slug}`;
}

export function getCategoryLabel(key: string, locale: Locale): string {
  const cat = getCategoryByKey(key);
  if (!cat) return key;
  return locale === "pl" ? cat.pl.label : cat.en.label;
}

export function categoryKeyFromPath(path: string): string | null {
  const match = path.match(/^\/(category|kategoria)\/([^/]+)/);
  if (!match) return null;
  const cat = getCategoryByLocalizedSlug(match[2]);
  return cat?.key ?? null;
}
