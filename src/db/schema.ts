import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),

  // Slide 1 (Title)
  topicTag: text("topic_tag").notNull(),
  headline: text("headline").notNull(),
  subtitle: text("subtitle").default("Swipe to learn why"),
  iconType: text("icon_type").default("clock"),

  // Slide 2 (Content)
  contentTag: text("content_tag").default("Why it works"),
  contentBody: text("content_body").notNull(),
  sectionNumber: text("section_number").default("01"),

  // Slide 3 (Quote)
  quote: text("quote").notNull(),
  quoteAttribution: text("quote_attribution"),
  quoteIconType: text("quote_icon_type").default("sun"),

  // Slide 4 (CTA)
  ctaText: text("cta_text").default(
    "Follow for {more} psychology life hacks"
  ),
  hashtags: text("hashtags").notNull(), // JSON array
  handleBio: text("handle_bio").default(
    "psychology · life hacks · mental health"
  ),

  // Caption
  caption: text("caption"),

  // Locale & translations
  locale: text("locale").notNull().default("en"),
  translationGroup: text("translation_group"),

  // Design
  colorPalette: text("color_palette").default("sage"),
  logoVariant: text("logo_variant").default("light"),

  // Timestamps
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  publishedAt: text("published_at"),
});

export const slides = sqliteTable("slides", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  slideNumber: integer("slide_number").notNull(),
  filename: text("filename").notNull(),
  filePath: text("file_path").notNull(),
  width: integer("width").notNull().default(1080),
  height: integer("height").notNull().default(1350),
  fileSize: integer("file_size"),
  generatedAt: text("generated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const colorPalettes = sqliteTable("color_palettes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  primary: text("primary").notNull(),
  primaryLight: text("primary_light").notNull(),
  primaryPale: text("primary_pale").notNull(),
  secondary: text("secondary").notNull(),
  secondaryLight: text("secondary_light").notNull(),
  secondaryPale: text("secondary_pale").notNull(),
  bgWhite: text("bg_white").notNull().default("#FAFBFC"),
  bgCool: text("bg_cool").notNull().default("#F1F4F6"),
  textDark: text("text_dark").notNull().default("#1E2A36"),
  textMid: text("text_mid").notNull().default("#4A5B6A"),
  textLight: text("text_light").notNull().default("#8A99A8"),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Slide = typeof slides.$inferSelect;
export type ColorPalette = typeof colorPalettes.$inferSelect;
