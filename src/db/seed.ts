import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { colorPalettes, posts } from "./schema";

const PALETTES = [
  {
    id: "sage",
    name: "Sage Green",
    primary: "#7B9E8C",
    primaryLight: "#a3c4b3",
    primaryPale: "#e8f0eb",
    secondary: "#6B8BA4",
    secondaryLight: "#b5cede",
    secondaryPale: "#e9f1f6",
    bgWhite: "#FAFBFC",
    bgCool: "#F1F4F6",
    textDark: "#1E2A36",
    textMid: "#4A5B6A",
    textLight: "#8A99A8",
  },
  {
    id: "slate",
    name: "Slate Blue",
    primary: "#6B8BA4",
    primaryLight: "#8fafc6",
    primaryPale: "#e2ecf3",
    secondary: "#7B9E8C",
    secondaryLight: "#a3c4b3",
    secondaryPale: "#e8f0eb",
    bgWhite: "#FAFBFC",
    bgCool: "#EEF1F5",
    textDark: "#1E2A36",
    textMid: "#4A5B6A",
    textLight: "#8A99A8",
  },
  {
    id: "warm",
    name: "Warm Terracotta",
    primary: "#B5836A",
    primaryLight: "#d4a68e",
    primaryPale: "#f5ebe5",
    secondary: "#8A7B6B",
    secondaryLight: "#b5a898",
    secondaryPale: "#efe9e3",
    bgWhite: "#FDFBF9",
    bgCool: "#F5F1ED",
    textDark: "#2A1F1A",
    textMid: "#5C4E43",
    textLight: "#9A8D82",
  },
  {
    id: "lavender",
    name: "Lavender",
    primary: "#8B7BAE",
    primaryLight: "#b0a3cb",
    primaryPale: "#ede8f5",
    secondary: "#7B9E8C",
    secondaryLight: "#a3c4b3",
    secondaryPale: "#e8f0eb",
    bgWhite: "#FBFAFC",
    bgCool: "#F3F1F6",
    textDark: "#1E1A2E",
    textMid: "#4A4560",
    textLight: "#8A86A0",
  },
];

const EXAMPLE_POST = {
  slug: "keep-a-consistent-wake-up-time",
  status: "published" as const,
  topicTag: "Psychology Life Hack",
  headline: "Keep a {Consistent} Wake-Up Time",
  subtitle: "Swipe to learn why",
  iconType: "clock",
  contentTag: "Why it works",
  contentBody:
    "Waking up at {the same time} every day stabilizes your circadian rhythms, which are essential for {mood regulation}.\n\nIrregular sleep patterns make it harder to treat anxiety and depression, because your emotional systems need {predictability}.",
  sectionNumber: "01",
  quote:
    "Your morning {begins} the night before.\nGo to sleep with intention — {wake up with purpose.}",
  quoteAttribution: "\u2014 Your daily routine",
  quoteIconType: "sun",
  ctaText: "Follow for {more} psychology life hacks",
  hashtags: JSON.stringify([
    "#psychology",
    "#lifehacks",
    "#mentalhealth",
    "#routine",
  ]),
  handleBio: "psychology \u00B7 life hacks \u00B7 mental health",
  caption: `One of the simplest things you can do for your mental health? Wake up at the same time every day.

Your brain runs on a 24-hour internal clock called the circadian rhythm. When you wake up at random times, you're essentially giving your nervous system jet lag \u2014 every single day.

Consistent wake times help stabilize:
\u2192 mood regulation
\u2192 anxiety levels
\u2192 emotional resilience
\u2192 sleep quality (even if you go to bed late)

The trick? Pick your wake-up time and stick to it \u2014 weekdays AND weekends. Yes, even on Sundays.

Start with just 7 days. Notice how you feel.

Save this for your morning routine reset

#psychology #lifehacks #mentalhealth #sleephygiene #circadianrhythm #morningroutine #anxietyrelief #selfimprovement #therapytips #justhavealittlemeaning`,
  colorPalette: "sage",
  logoVariant: "light",
};

async function seed() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client);

  // Seed color palettes
  for (const palette of PALETTES) {
    await db.insert(colorPalettes).values(palette).onConflictDoNothing();
  }
  console.log(`Seeded ${PALETTES.length} color palettes`);

  // Seed example post
  const existing = await db
    .select()
    .from(posts)
    .limit(1);

  if (existing.length === 0) {
    await db.insert(posts).values(EXAMPLE_POST);
    console.log("Seeded example post: Keep a Consistent Wake-Up Time");
  } else {
    console.log("Posts already exist, skipping example post");
  }

  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
