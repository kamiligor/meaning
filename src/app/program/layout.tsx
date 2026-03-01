import Link from "next/link";
import { SafetyBanner } from "@/components/program/safety-banner";
import { getProgramUser } from "@/lib/program-auth";

export const metadata = {
  title: "Pisz Siebie — Program Pisania Terapeutycznego",
  description:
    "Ustrukturyzowany program pisania oparty na badaniach psychologicznych. Uporządkuj myśli o przeszłości, teraźniejszości i przyszłości.",
};

export default async function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isLoggedIn = false;
  try {
    const { user } = await getProgramUser();
    isLoggedIn = !!user;
  } catch {
    // Not logged in
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Nav */}
      <header className="border-b border-[#e2e7eb] bg-white">
        <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/program"
            className="text-lg font-semibold text-[#1E2A36] hover:text-[#7B9E8C] transition-colors"
          >
            Pisz Siebie
          </Link>
          {isLoggedIn && (
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/program/dashboard"
                className="text-[#4A5B6A] hover:text-[#7B9E8C] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/program/zasoby"
                className="text-[#4A5B6A] hover:text-[#7B9E8C] transition-colors"
              >
                Zasoby
              </Link>
              <Link
                href="/"
                className="text-[#8A99A8] hover:text-[#7B9E8C] transition-colors"
              >
                Feed
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Content */}
      <main className="pb-16">{children}</main>

      {/* Safety banner */}
      <SafetyBanner />
    </div>
  );
}
