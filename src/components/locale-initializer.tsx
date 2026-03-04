"use client";

import { useEffect } from "react";
import { isLocale } from "@/lib/i18n";
import { LOCALE_COOKIE, setLocaleCookieClient } from "@/lib/locale-cookie";

const LS_KEY = "jh-locale";

/**
 * Detects browser language on first visit, persists locale to
 * localStorage + cookie. No UI — side-effect only.
 */
export function LocaleInitializer() {
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    const cookieVal = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${LOCALE_COOKIE}=`))
      ?.split("=")[1];

    if (stored && isLocale(stored)) {
      // localStorage exists — ensure cookie is in sync
      if (cookieVal !== stored) {
        setLocaleCookieClient(stored);
        // Reload so server components pick up the new cookie
        window.location.reload();
        return;
      }
      return;
    }

    // First visit: detect from browser language
    const browserLang = navigator.language?.toLowerCase() ?? "";
    const detected = browserLang.startsWith("pl") ? "pl" : "en";

    localStorage.setItem(LS_KEY, detected);
    setLocaleCookieClient(detected);

    // Only reload if cookie was different (or missing)
    if (cookieVal !== detected) {
      window.location.reload();
    }
  }, []);

  return null;
}
