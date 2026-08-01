import { headers } from "next/headers";
import { isLocale, type Locale } from "./i18n";
import { DEFAULT_LOCALE, localeFromHost } from "./domains";

export const LOCALE_HEADER = "x-locale";

/**
 * Locale for the current request, decided by the domain it came in on.
 * Middleware puts it on the request headers; the Host header is a fallback
 * for routes the middleware matcher does not cover.
 */
export async function getLocale(): Promise<Locale> {
  const headerStore = await headers();

  const fromMiddleware = headerStore.get(LOCALE_HEADER);
  if (fromMiddleware && isLocale(fromMiddleware)) return fromMiddleware;

  const host = headerStore.get("host");
  return host ? localeFromHost(host) : DEFAULT_LOCALE;
}

/** Host of the current request, for building cross-domain URLs. */
export async function getHost(): Promise<string | null> {
  const headerStore = await headers();
  return headerStore.get("host");
}
