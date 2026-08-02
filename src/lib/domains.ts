import type { Locale } from "./i18n";

/**
 * Domain <-> locale mapping. The host decides the language of the site:
 * justmeaning.com serves English, poprostusens.pl serves Polish.
 *
 * For local development `pl.localhost:3000` resolves to 127.0.0.1 on macOS
 * and Linux, so both languages are reachable without touching /etc/hosts.
 */
export const SITE_HOSTS: Record<Locale, string> = {
  en: process.env.NEXT_PUBLIC_SITE_HOST_EN || "justmeaning.com",
  pl: process.env.NEXT_PUBLIC_SITE_HOST_PL || "poprostusens.pl",
};

export const DEFAULT_LOCALE: Locale = "en";

/**
 * Locale that hosts The Life Writing Program. Accounts themselves are shared
 * across both domains; only the program is pinned here, because its exercises
 * exist in Polish only.
 */
export const PROGRAM_LOCALE: Locale = "pl";

/**
 * Resolve a locale from a Host header. Unknown hosts fall back to the
 * default locale so previews and health checks keep working.
 */
export function localeFromHost(host: string | null | undefined): Locale {
  if (!host) return DEFAULT_LOCALE;

  const hostname = host.split(":")[0].toLowerCase().replace(/^www\./, "");

  if (hostname === SITE_HOSTS.pl || hostname === `pl.localhost`) return "pl";
  if (hostname === SITE_HOSTS.en || hostname === "localhost") return "en";

  // Unknown host (Coolify preview URL, IP, health check): keep the default.
  return DEFAULT_LOCALE;
}

/**
 * Absolute URL for the same path on the other language's domain.
 * Preserves the port in development so `pl.localhost:3000` works.
 */
export function urlForLocale(
  locale: Locale,
  path: string,
  currentHost?: string | null
): string {
  const port = currentHost?.includes(":") ? `:${currentHost.split(":")[1]}` : "";
  const isLocal = currentHost?.startsWith("localhost") || currentHost?.includes(".localhost");

  const host = isLocal
    ? `${locale === "pl" ? "pl.localhost" : "localhost"}${port}`
    : SITE_HOSTS[locale];

  const protocol = isLocal ? "http" : "https";
  const normalized = path.startsWith("/") ? path : `/${path}`;

  return `${protocol}://${host}${normalized}`;
}

/**
 * Public origin of the current request.
 *
 * In a standalone build behind a proxy, `request.url` is assembled from the
 * address the server binds to (HOSTNAME=0.0.0.0, PORT=3000), so redirects
 * built from it point at the container instead of the site. The forwarded
 * headers carry the address the browser actually used.
 */
export function publicOrigin(
  headers: { get(name: string): string | null },
  fallback: string
): string {
  const host =
    headers.get("x-forwarded-host") ?? headers.get("host");
  if (!host) return fallback;

  const proto =
    headers.get("x-forwarded-proto")?.split(",")[0].trim() ?? "https";

  return `${proto}://${host}`;
}

/**
 * Route names that differ between languages. Used by the language switcher
 * so /favorites on the English site maps to /ulubione on the Polish one.
 */
const EQUIVALENT_PATHS: Record<string, { en: string; pl: string }> = {
  "/favorites": { en: "/favorites", pl: "/ulubione" },
  "/ulubione": { en: "/favorites", pl: "/ulubione" },
  "/mission": { en: "/mission", pl: "/misja" },
  "/misja": { en: "/mission", pl: "/misja" },
  "/standards": { en: "/standards", pl: "/zasady" },
  "/zasady": { en: "/standards", pl: "/zasady" },
};

/** Editorial standards, referenced from the Organization schema. */
export function standardsPath(locale: Locale): string {
  return locale === "pl" ? "/zasady" : "/standards";
}

/** Translate a pathname to its equivalent on the other language's site. */
export function equivalentPath(pathname: string, target: Locale): string {
  return EQUIVALENT_PATHS[pathname]?.[target] ?? pathname;
}
