export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((p) => p.replace(/\n/g, " ").trim());
}
