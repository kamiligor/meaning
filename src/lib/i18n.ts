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
    furtherReading: "Further reading",
    newsletterHeading: "Stay curious",
    newsletterSubtext: "Get new psychology insights delivered to your inbox. No spam, just meaning.",
    newsletterPlaceholder: "Your email",
    newsletterSubmit: "Subscribe",
    newsletterSuccess: "You're in! Check your inbox to confirm.",
    newsletterError: "Something went wrong. Try again.",
    newsletterAlreadySubscribed: "You're already subscribed!",
    share: "Share",
    shareCopyLink: "Copy Link",
    shareCopied: "Copied!",
    shareNative: "Share",
    navProgram: "The Life Writing Program",
    navProgramShort: "Program",
    navMission: "Our Mission",
    navMissionShort: "Mission",
    navLogIn: "Log In",
  },
  pl: {
    siteTitle: "just have a little meaning",
    noPostsTitle: "Brak postów",
    noPostsSubtitle: "Wróć wkrótce po nowe treści",
    endOfFeed: "To już wszystkie posty",
    backToFeed: "Wróć do feedu",
    back: "Wróć",
    follow: "Obserwuj",
    furtherReading: "Polecane lektury",
    newsletterHeading: "Bądź na bieżąco",
    newsletterSubtext: "Nowe spostrzeżenia z psychologii prosto na Twoją skrzynkę. Bez spamu, tylko to, co ma znaczenie.",
    newsletterPlaceholder: "Twój email",
    newsletterSubmit: "Subskrybuj",
    newsletterSuccess: "Jesteś na liście! Sprawdź skrzynkę, żeby potwierdzić.",
    newsletterError: "Coś poszło nie tak. Spróbuj ponownie.",
    newsletterAlreadySubscribed: "Już subskrybujesz!",
    share: "Udostępnij",
    shareCopyLink: "Kopiuj link",
    shareCopied: "Skopiowano!",
    shareNative: "Udostępnij",
    navProgram: "The Life Writing Program",
    navProgramShort: "Program",
    navMission: "Nasza misja",
    navMissionShort: "Misja",
    navLogIn: "Zaloguj",
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
