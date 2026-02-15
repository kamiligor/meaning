export type Locale = "en" | "pl";

export const LOCALES: Locale[] = ["en", "pl"];

const dict = {
  en: {
    siteTitle: "just have a little meaning",
    noPostsTitle: "No posts yet",
    noPostsSubtitle: "Check back soon for new content",
    endOfFeed: "You've seen all the posts",
    backToFeed: "Back to feed",
    back: "Back",
    follow: "Follow",
    langSwitch: "PL",
    langSwitchLabel: "Polski",
  },
  pl: {
    siteTitle: "just have a little meaning",
    noPostsTitle: "Brak postów",
    noPostsSubtitle: "Wróć wkrótce po nowe treści",
    endOfFeed: "To już wszystkie posty",
    backToFeed: "Wróć do feedu",
    back: "Wróć",
    follow: "Obserwuj",
    langSwitch: "EN",
    langSwitchLabel: "English",
  },
};

type DictStrings = { [K in keyof (typeof dict)["en"]]: string };

export type Dict = DictStrings;

export function t(locale: Locale): Dict {
  return dict[locale] || dict.en;
}

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
