import { MissionContent } from "../mission/mission-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nasza misja — just have a little meaning",
  description:
    "Dzielimy się wiedzą z psychologii w przystępnym języku. Bez żargonu, bez obietnic. Tylko rzeczy, które uznaliśmy za warte uwagi.",
};

export default function MisjaPage() {
  return <MissionContent locale="pl" />;
}
