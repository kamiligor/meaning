import { MissionContent } from "./mission-content";
import { urlForLocale } from "@/lib/domains";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Mission — just have a little meaning",
  description:
    "We share psychological research in plain language. No jargon, no false promises. Just the things we found worth knowing.",
  alternates: {
    canonical: urlForLocale("en", "/mission"),
    languages: {
      en: urlForLocale("en", "/mission"),
      pl: urlForLocale("pl", "/misja"),
    },
  },
};

export default function MissionPage() {
  return <MissionContent locale="en" />;
}
