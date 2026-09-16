import { CourseLanding } from "@/components/course/course-landing";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ zapisz?: string }>;
}) {
  const { zapisz } = await searchParams;
  return (
    <CourseLanding slug="kurs-wdziecznosci" autoOpenEnroll={zapisz === "1"} />
  );
}
