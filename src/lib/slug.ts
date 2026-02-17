const diacritics: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
  à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a", æ: "ae",
  è: "e", é: "e", ê: "e", ë: "e",
  ì: "i", í: "i", î: "i", ï: "i",
  ò: "o", ô: "o", õ: "o", ö: "o", ø: "o",
  ù: "u", ú: "u", û: "u", ü: "u",
  ñ: "n", ý: "y", ÿ: "y", ð: "d", þ: "th", ß: "ss", č: "c", ď: "d",
  ě: "e", ň: "n", ř: "r", š: "s", ť: "t", ů: "u", ž: "z",
};

export function generateSlug(text: string): string {
  return text
    .replace(/\{|\}/g, "")
    .toLowerCase()
    .replace(/[^\x00-\x7F]/g, (ch) => diacritics[ch] || "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}
