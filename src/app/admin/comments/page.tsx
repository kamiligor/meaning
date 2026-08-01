import { ModerationQueue } from "./moderation-queue";

export const metadata = {
  title: "Komentarze | jhalm",
};

export default function AdminCommentsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold text-[#1E2A36] mb-1">Komentarze</h1>
      <p className="text-sm text-[#6C7C8B] mb-6">
        Nowe komentarze czekają na zatwierdzenie i do tego czasu widzi je tylko
        ich autor.
      </p>
      <ModerationQueue />
    </main>
  );
}
