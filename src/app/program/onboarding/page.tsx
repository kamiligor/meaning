"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Heart, SkipForward } from "lucide-react";
import type { GenderForm } from "@/lib/personalize";

function OnboardingHeader() {
  return (
    <header className="border-b border-[#e2e7eb] bg-white">
      <nav className="max-w-5xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center gap-4">
        <a
          href="/"
          className="shrink-0 block h-12 md:h-14"
          aria-label="just have a little meaning — home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="just have a little meaning"
            className="h-full w-auto"
          />
        </a>
        <div className="hidden md:block w-px h-5 bg-[#e2e7eb]" aria-hidden="true" />
        <Link
          href="/program"
          className="hidden md:block text-sm font-semibold text-[#1E2A36] hover:text-[#7B9E8C] transition-colors"
        >
          The Life Writing Program
        </Link>
      </nav>
    </header>
  );
}

type OnboardingStep = "info" | "gender" | "disclaimer" | "auth";

export default function OnboardingPage() {
  return (
    <>
      <OnboardingHeader />
      <OnboardingContent />
    </>
  );
}

function OnboardingContent() {
  const [step, setStep] = useState<OnboardingStep>("info");
  const [genderForm, setGenderForm] = useState<GenderForm>("neutral");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/program/auth/callback`,
        data: {
          gender_form: genderForm,
        },
      },
    });

    if (authError) {
      setError("Cos poszlo nie tak. Sprobuj ponownie.");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    // Store gender form in sessionStorage so we can save it after OAuth callback
    sessionStorage.setItem("onboarding_gender_form", genderForm);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/program/auth/callback`,
      },
    });
  };

  // Step 1: Info cards
  if (step === "info") {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1E2A36] mb-6">
            Zanim zaczniemy
          </h1>
          <div className="space-y-4">
            {[
              {
                icon: Shield,
                text: "To narzedzie do autorefleksji — nie zastepuje psychoterapii.",
              },
              {
                icon: Lock,
                text: "Twoje teksty sa szyfrowane. Nikt ich nie przeczyta — nawet my.",
              },
              {
                icon: Heart,
                text: "Nie ma zlych odpowiedzi. Nie ma ocen. Nie ma presji czasowej.",
              },
              {
                icon: SkipForward,
                text: "Możesz pominąć dowolne ćwiczenie. Bez tłumaczenia się.",
              },
            ].map(({ icon: Icon, text }, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-[#7B9E8C] shrink-0 mt-0.5" />
                <p className="text-[#4A5B6A] text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={() => setStep("gender")} className="w-full">
          Dalej
        </Button>
      </div>
    );
  }

  // Step 2: Gender form selection
  if (step === "gender") {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-[#1E2A36] mb-2">
          Jak mam sie do Ciebie zwracac?
        </h1>
        <p className="text-[#8A99A8] text-sm mb-8">
          Mozesz to zmienic pozniej w ustawieniach.
        </p>

        <div className="space-y-3 mb-8">
          {(
            [
              {
                value: "feminine" as GenderForm,
                label: "Ona",
                examples: "napisałaś, czułaś, przeszłaś",
              },
              {
                value: "masculine" as GenderForm,
                label: "On",
                examples: "napisałeś, czułeś, przeszłeś",
              },
              {
                value: "neutral" as GenderForm,
                label: "Neutralnie",
                examples: "zapisz, przypomnij sobie, masz za sobą",
              },
            ] as const
          ).map(({ value, label, examples }) => (
            <button
              key={value}
              onClick={() => setGenderForm(value)}
              className={`w-full text-left rounded-xl border-2 p-4 transition-colors ${
                genderForm === value
                  ? "border-[#7B9E8C] bg-[#e8f0eb]"
                  : "border-[#e2e7eb] bg-white hover:border-[#c5cdd4]"
              }`}
            >
              <span className="font-medium text-[#1E2A36]">{label}</span>
              <span className="block text-sm text-[#8A99A8] mt-1">
                {examples}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep("info")} className="flex-1">
            Wstecz
          </Button>
          <Button onClick={() => setStep("disclaimer")} className="flex-1">
            Dalej
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: One-time disclaimer
  if (step === "disclaimer") {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-[#e2e7eb] p-6 mb-6">
          <p className="text-[#1E2A36] leading-relaxed">
            Ten program to narzedzie do autorefleksji przez pisanie.
            Nie zastepuje psychoterapii ani innej formy profesjonalnej pomocy.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep("gender")} className="flex-1">
            Wstecz
          </Button>
          <Button onClick={() => setStep("auth")} className="flex-1">
            Rozumiem i chce kontynuowac
          </Button>
        </div>
      </div>
    );
  }

  // Step 4: Auth (registration/login)
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white border border-[#e2e7eb] rounded-xl p-6">
        {sent ? (
          <div className="text-center py-4">
            <h2 className="text-lg font-medium text-[#1E2A36] mb-2">
              Sprawdz skrzynke!
            </h2>
            <p className="text-[#4A5B6A] text-sm">
              Wyslalismy link do logowania na <strong>{email}</strong>.
              Kliknij go, zeby kontynuowac.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-medium text-[#1E2A36] mb-4 text-center">
              Stworz konto lub zaloguj sie
            </h2>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-[#e2e7eb] rounded-lg px-4 py-2.5 text-sm text-[#1E2A36] hover:bg-[#F1F4F6] transition-colors mb-4"
              type="button"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Kontynuuj z Google
            </button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2e7eb]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-[#8A99A8]">lub</span>
              </div>
            </div>

            <form onSubmit={handleMagicLink}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Twoj email"
                required
                className="w-full border border-[#e2e7eb] rounded-lg px-4 py-2.5 text-sm text-[#1E2A36] placeholder:text-[#8A99A8] focus:outline-none focus:ring-2 focus:ring-[#7B9E8C] focus:ring-offset-1 mb-3"
              />
              {error && (
                <p className="text-red-500 text-xs mb-3">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Wysylanie..." : "Wyslij magic link"}
              </Button>
            </form>

            <Button
              variant="ghost"
              onClick={() => setStep("gender")}
              className="w-full mt-3 text-[#8A99A8]"
            >
              Wstecz
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
