export type GenderForm = "feminine" | "masculine" | "neutral";

/**
 * Template tokens used in YAML exercises and introductions.
 * Format: {{token_name}} in text → replaced with gendered variant.
 *
 * Most text is written in neutral/imperative forms to minimize templates.
 * Templates are only used where past tense gendered forms are unavoidable
 * (e.g., reflection prompts referencing what the user wrote).
 */
const TEMPLATES: Record<string, Record<GenderForm, string>> = {
  // Past tense verbs (reflection prompts)
  "{{napisal}}": {
    feminine: "napisałaś",
    masculine: "napisałeś",
    neutral: "zapisujesz tu",
  },
  "{{stworzyl}}": {
    feminine: "stworzyłaś",
    masculine: "stworzyłeś",
    neutral: "tworzysz tu",
  },
  "{{wybral}}": {
    feminine: "wybrałaś",
    masculine: "wybrałeś",
    neutral: "wybierasz",
  },
  "{{podzielil}}": {
    feminine: "podzieliłaś",
    masculine: "podzieliłeś",
    neutral: "dzielisz tu",
  },
  "{{zobaczyl}}": {
    feminine: "zobaczyłaś",
    masculine: "zobaczyłeś",
    neutral: "widzisz tu",
  },
  "{{spojrzal}}": {
    feminine: "spojrzałaś",
    masculine: "spojrzałeś",
    neutral: "patrzysz tu",
  },
  "{{przeszedl}}": {
    feminine: "przeszłaś",
    masculine: "przeszłeś",
    neutral: "masz za sobą",
  },
  "{{zaczal}}": {
    feminine: "zaczęłaś",
    masculine: "zacząłeś",
    neutral: "zaczynasz",
  },
  "{{wyobrazil}}": {
    feminine: "wyobraziłaś",
    masculine: "wyobraziłeś",
    neutral: "wyobrażasz sobie",
  },
  "{{przygotowal}}": {
    feminine: "przygotowałaś",
    masculine: "przygotowałeś",
    neutral: "przygotowujesz",
  },
  "{{zidentyfikowal}}": {
    feminine: "zidentyfikowałaś",
    masculine: "zidentyfikowałeś",
    neutral: "identyfikujesz",
  },
  "{{zrobil}}": {
    feminine: "zrobiłaś",
    masculine: "zrobiłeś",
    neutral: "robisz",
  },
  "{{odkryl}}": {
    feminine: "odkryłaś",
    masculine: "odkryłeś",
    neutral: "odkrywasz",
  },
  "{{pracowal}}": {
    feminine: "pracowałaś",
    masculine: "pracowałeś",
    neutral: "pracujesz",
  },

  // Adjectives / pronouns
  "{{sam}}": {
    feminine: "sama",
    masculine: "sam",
    neutral: "samodzielnie",
  },
  "{{gotowy}}": {
    feminine: "gotowa",
    masculine: "gotowy",
    neutral: "w gotowości",
  },

  // Conditional verbs
  "{{chcialby}}": {
    feminine: "chciałabyś",
    masculine: "chciałbyś",
    neutral: "chcesz",
  },
  "{{moglby}}": {
    feminine: "mogłabyś",
    masculine: "mógłbyś",
    neutral: "możesz",
  },
};

export function personalize(text: string, form: GenderForm): string {
  let result = text;
  for (const [token, forms] of Object.entries(TEMPLATES)) {
    result = result.replaceAll(token, forms[form]);
  }
  return result;
}

export function personalizeExercise<T extends Record<string, unknown>>(
  exercise: T,
  form: GenderForm,
  fields: (keyof T)[]
): T {
  const result = { ...exercise };
  for (const field of fields) {
    const value = result[field];
    if (typeof value === "string") {
      (result[field] as string) = personalize(value, form);
    } else if (Array.isArray(value)) {
      (result[field] as string[]) = value.map((item) =>
        typeof item === "string" ? personalize(item, form) : item
      );
    }
  }
  return result;
}
