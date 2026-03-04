import type { Locale } from "./i18n";
import { isLocale } from "./i18n";

export const LOCALE_COOKIE = "jh-locale";
export const LOCALE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Read locale from a cookies store (Next.js `cookies()` or request.cookies).
 */
export function getLocaleFromCookies(
  cookieStore: { get(name: string): { value: string } | undefined }
): Locale {
  const val = cookieStore.get(LOCALE_COOKIE)?.value;
  return val && isLocale(val) ? val : "en";
}

/**
 * Set locale cookie string for document.cookie (client-side).
 */
export function setLocaleCookieClient(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${LOCALE_MAX_AGE};samesite=lax`;
}
