import { StandardsContent } from "../standards/standards-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jak powstają te teksty",
  description:
    "Skąd pochodzą badania, czego nie będziemy twierdzić i co się dzieje, kiedy się pomylimy.",
};

export default function ZasadyPage() {
  return <StandardsContent locale="pl" />;
}
