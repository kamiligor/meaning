import { MissionContent } from "../mission/mission-content";
import { urlForLocale } from "@/lib/domains";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nasza misja — just have a little meaning",
  description:
    "Dzielimy się wiedzą z psychologii w przystępnym języku. Bez żargonu, bez obietnic. Tylko rzeczy, które uznaliśmy za warte uwagi.",
  alternates: {
    canonical: urlForLocale("pl", "/misja"),
    languages: {
      en: urlForLocale("en", "/mission"),
      pl: urlForLocale("pl", "/misja"),
    },
  },
};

export default function MisjaPage() {
  return <MissionContent locale="pl" />;
}
