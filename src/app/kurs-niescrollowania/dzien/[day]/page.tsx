import { CourseDayPage } from "@/components/course/course-day-page";

export default async function Page({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  return <CourseDayPage slug="kurs-niescrollowania" dayParam={day} />;
}
