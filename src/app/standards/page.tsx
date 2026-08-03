import { StandardsContent } from "./standards-content";
import { urlForLocale } from "@/lib/domains";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How this site is written",
  description:
    "Where the research comes from, what we will not claim, and what happens when we get something wrong.",
  alternates: {
    canonical: urlForLocale("en", "/standards"),
    languages: {
      en: urlForLocale("en", "/standards"),
      pl: urlForLocale("pl", "/zasady"),
    },
  },
};

export default function StandardsPage() {
  return <StandardsContent locale="en" />;
}
