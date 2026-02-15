export function generateSlug(text: string): string {
  return text
    .replace(/\{|\}/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}
