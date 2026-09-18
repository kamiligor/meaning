import { CourseLanding } from "@/components/course/course-landing";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ zapisz?: string; przypomnienia?: string }>;
}) {
  const { zapisz, przypomnienia } = await searchParams;
  return (
    <CourseLanding
      slug="kurs-niescrollowania"
      autoOpenEnroll={zapisz === "1"}
      remindersOff={przypomnienia === "off"}
    />
  );
}
