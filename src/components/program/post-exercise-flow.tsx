"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmotionalCheckin } from "./emotional-checkin";
import { GroundingExercise } from "./grounding-exercise";
import { Button } from "@/components/ui/button";

type FlowStep = "reflection" | "checkin" | "grounding";

interface PostExerciseFlowProps {
  exerciseId: string;
  questions: { text: string }[];
  reflectionPrompt: string;
  postExerciseNote: string | null;
  showCheckin: boolean; // true if difficulty >= 3
  canComplete: boolean;
  nextExerciseUrl: string | null;
}

export function PostExerciseFlow({
  exerciseId,
  questions,
  reflectionPrompt,
  canComplete,
  postExerciseNote,
  showCheckin,
  nextExerciseUrl,
}: PostExerciseFlowProps) {
  const [step, setStep] = useState<FlowStep>("reflection");
  const [responses, setResponses] = useState<{ questionIndex: number; content: string }[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(true);
  const router = useRouter();

  const markCompleted = async () => {
    try {
      await fetch(`/api/program/progress/${exerciseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
    } catch {
      // best-effort
    }
  };

  useEffect(() => {
    fetch(`/api/program/responses/${exerciseId}`)
      .then((res) => res.json())
      .then((data) => setResponses(data.responses ?? []))
      .catch(() => {})
      .finally(() => setLoadingResponses(false));
  }, [exerciseId]);

  if (step === "reflection") {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-[#e8f0eb] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-medium text-[#1E2A36] mb-3">Refleksja</h3>
          <div className="text-[#4A5B6A] leading-relaxed space-y-3">
            {reflectionPrompt
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i}>{para.replace(/\n/g, " ").trim()}</p>
              ))}
          </div>
        </div>

        {/* User's responses */}
        {loadingResponses ? (
          <div className="mb-6 flex items-center gap-2 text-sm text-[#8A99A8]">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Wczytuję Twoje odpowiedzi...
          </div>
        ) : responses.length > 0 ? (
          <div className="mb-6 space-y-4">
            <h3 className="text-sm font-medium text-[#8A99A8] uppercase tracking-wider">Twoje odpowiedzi</h3>
            {responses.map((r) => (
              <div key={r.questionIndex} className="bg-white border border-[#e2e7eb] rounded-lg p-4">
                <p className="text-xs text-[#8A99A8] mb-2">{questions[r.questionIndex]?.text ?? `Pytanie ${r.questionIndex + 1}`}</p>
                <div className="text-[#1E2A36] text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: r.content }} />
              </div>
            ))}
          </div>
        ) : null}

        {postExerciseNote && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-[#4A5B6A]">
              {postExerciseNote.replace(/\n(?!\n)/g, " ").trim()}
            </p>
          </div>
        )}

        {/* Save info */}
        <p className="text-sm text-[#8A99A8] mb-6">
          Twój tekst jest zapisany. Możesz wrócić i edytować w dowolnym momencie.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {canComplete ? (
            <Button
              onClick={async () => {
                await markCompleted();
                if (nextExerciseUrl) {
                  router.push(nextExerciseUrl);
                } else {
                  router.push("/program/dashboard");
                }
              }}
              className="w-full"
            >
              Oznacz jako ukończone{nextExerciseUrl ? " i przejdź dalej" : ""}
            </Button>
          ) : (
            <p className="text-sm text-amber-600 py-2">
              Niektóre pytania wymagają dłuższej odpowiedzi, żeby oznaczyć ćwiczenie jako ukończone.
            </p>
          )}
          <Button
            onClick={() => router.push("/program/dashboard")}
            variant="outline"
            className="w-full"
          >
            Wróć do dashboardu
          </Button>
          {showCheckin && (
            <Button
              onClick={() => setStep("checkin")}
              variant="ghost"
              className="w-full text-[#8A99A8]"
            >
              Potrzebuję chwili
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (step === "checkin") {
    return (
      <EmotionalCheckin
        onOk={() => setStep("reflection")}
        onBreak={() => setStep("grounding")}
      />
    );
  }

  // step === "grounding"
  return (
    <GroundingExercise
      onDashboard={() => router.push("/program/dashboard")}
      onContinue={() => setStep("reflection")}
    />
  );
}
