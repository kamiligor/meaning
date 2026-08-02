import { StandardsContent } from "./standards-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How this site is written",
  description:
    "Where the research comes from, what we will not claim, and what happens when we get something wrong.",
};

export default function StandardsPage() {
  return <StandardsContent locale="en" />;
}
