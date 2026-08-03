import { StandardsContent } from "../standards/standards-content";
import { urlForLocale } from "@/lib/domains";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jak powstają te teksty",
  description:
    "Skąd pochodzą badania, czego nie będziemy twierdzić i co się dzieje, kiedy się pomylimy.",
  alternates: {
    canonical: urlForLocale("pl", "/zasady"),
    languages: {
      en: urlForLocale("en", "/standards"),
      pl: urlForLocale("pl", "/zasady"),
    },
  },
};

export default function ZasadyPage() {
  return <StandardsContent locale="pl" />;
}
