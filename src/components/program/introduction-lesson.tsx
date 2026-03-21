"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface IntroductionLessonProps {
  introId: string;
  moduleSlug: string;
  moduleOrder: number;
  moduleTitle: string;
  introTitle: string;
  content: string;
  isCompleted: boolean;
  locale: Locale;
}

function splitIntoSteps(html: string): string[] {
  // Remove the H1 title — it's shown separately in the header
  const withoutH1 = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, "").trim();

  // Split by <h2> boundaries — each step starts with an <h2>
  const parts = withoutH1.split(/(?=<h2[^>]*>)/);
  return parts.filter((p) => p.trim().length > 0);
}

export function IntroductionLesson({
  introId,
  moduleSlug,
  moduleOrder,
  moduleTitle,
  introTitle,
  content,
  isCompleted: initialCompleted,
  locale,
}: IntroductionLessonProps) {
  const d = t(locale);
  const router = useRouter();
  const steps = splitIntoSteps(content);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isMarking, setIsMarking] = useState(false);

  const isLastStep = currentStep === steps.length - 1;

  const markCompleted = async () => {
    setIsMarking(true);
    try {
      await fetch(`/api/program/progress/${introId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      setIsCompleted(true);
    } catch {
      // best-effort
    }
    setIsMarking(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link */}
      <button
        onClick={() => router.push("/program/dashboard")}
        className="flex items-center gap-1.5 text-sm text-[#7B9E8C] hover:underline mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {d.programDashboard}
      </button>

      {/* Module label */}
      <p className="text-xs text-[#7B9E8C] font-medium uppercase tracking-wider mb-1">
        {d.dashboardModule} {moduleOrder}: {moduleTitle}
      </p>
      <h1 className="text-2xl font-semibold text-[#1E2A36] mb-6">
        {introTitle}
      </h1>

      {/* Step progress dots */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-xs text-[#8A99A8]">
          {currentStep + 1} / {steps.length}
        </span>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-6 bg-[#7B9E8C]"
                  : i < currentStep
                    ? "w-1.5 bg-[#7B9E8C]/40"
                    : "w-1.5 bg-[#e2e7eb]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        className="prose prose-sm max-w-none text-[#4A5B6A] mb-10 leading-relaxed prose-headings:text-[#1E2A36] prose-h2:text-xl prose-h2:mb-4 prose-strong:text-[#1E2A36] prose-p:mb-4 min-h-[200px]"
        dangerouslySetInnerHTML={{ __html: steps[currentStep] }}
      />

      {/* Navigation */}
      <div className="flex flex-col gap-3">
        {isLastStep ? (
          <>
            {!isCompleted ? (
              <Button
                onClick={async () => {
                  await markCompleted();
                  router.push("/program/dashboard");
                }}
                disabled={isMarking}
                className="w-full"
              >
                {d.introComplete}
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/program/dashboard")}
                className="w-full"
              >
                {d.introGoToExercises}
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className="w-full"
          >
            {d.introNext}
          </Button>
        )}

        {currentStep > 0 && (
          <Button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            variant="ghost"
            className="w-full text-[#8A99A8]"
          >
            {d.introPrevious}
          </Button>
        )}
      </div>
    </div>
  );
}
