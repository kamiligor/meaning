import { MissionContent } from "./mission-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Mission — just have a little meaning",
  description:
    "We share psychological research in plain language. No jargon, no false promises. Just the things we found worth knowing.",
};

export default function MissionPage() {
  return <MissionContent locale="en" />;
}
