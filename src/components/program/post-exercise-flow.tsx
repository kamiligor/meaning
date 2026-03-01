"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmotionalCheckin } from "./emotional-checkin";
import { GroundingExercise } from "./grounding-exercise";
import { Button } from "@/components/ui/button";

type FlowStep = "reflection" | "checkin" | "grounding" | "crisis" | "done";

interface PostExerciseFlowProps {
  reflectionPrompt: string;
  postExerciseNote: string | null;
  showCheckin: boolean; // true if difficulty >= 3
  nextExerciseUrl: string | null;
}

export function PostExerciseFlow({
  reflectionPrompt,
  postExerciseNote,
  showCheckin,
  nextExerciseUrl,
}: PostExerciseFlowProps) {
  const [step, setStep] = useState<FlowStep>("reflection");
  const router = useRouter();

  if (step === "reflection") {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-[#e8f0eb] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-medium text-[#1E2A36] mb-3">Refleksja</h3>
          <p className="text-[#4A5B6A] whitespace-pre-line leading-relaxed">
            {reflectionPrompt}
          </p>
        </div>
        {postExerciseNote && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-[#4A5B6A] whitespace-pre-line">
              {postExerciseNote}
            </p>
          </div>
        )}
        <Button
          onClick={() =>
            setStep(showCheckin ? "checkin" : "done")
          }
          className="w-full"
        >
          Dalej
        </Button>
      </div>
    );
  }

  if (step === "checkin") {
    return (
      <EmotionalCheckin
        onOk={() => setStep("done")}
        onBreak={() => setStep("grounding")}
        onNeedHelp={() => setStep("crisis")}
      />
    );
  }

  if (step === "grounding") {
    return (
      <GroundingExercise
        onDashboard={() => router.push("/program/dashboard")}
        onResources={() => router.push("/program/zasoby")}
        onContinue={() => setStep("done")}
      />
    );
  }

  if (step === "crisis") {
    return (
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="bg-white rounded-xl border border-[#e2e7eb] p-6">
          <p className="text-[#1E2A36] leading-relaxed mb-4">
            To, co czujesz, jest wazne. Pisanie o trudnych rzeczach moze wywolywac
            silne emocje — to naturalna reakcja, nie oznaka slabosci.
          </p>
          <p className="text-[#4A5B6A] mb-2">Jesli potrzebujesz rozmowy z kims:</p>
          <ul className="space-y-2 mb-4 text-[#4A5B6A]">
            <li>
              <a href="tel:116123" className="text-[#7B9E8C] font-medium hover:underline">
                Telefon Zaufania: 116 123
              </a>{" "}
              (calodobowo, anonimowo)
            </li>
            <li>
              <a href="tel:800702222" className="text-[#7B9E8C] font-medium hover:underline">
                Centrum Wsparcia: 800 70 2222
              </a>{" "}
              (calodobowo, bezplatnie)
            </li>
          </ul>
          <p className="text-sm text-[#8A99A8] mb-6">
            Twój tekst jest bezpiecznie zapisany. Mozesz wrócic do programu kiedy poczujesz sie gotowy/a.
          </p>
          <Button
            onClick={() => router.push("/program/dashboard")}
            variant="outline"
            className="w-full"
          >
            Wroc do dashboardu
          </Button>
        </div>
      </div>
    );
  }

  // step === "done"
  return (
    <div className="max-w-lg mx-auto py-8 px-4 text-center">
      <div className="bg-white rounded-xl border border-[#e2e7eb] p-6">
        <h3 className="text-lg font-medium text-[#1E2A36] mb-4">
          Cwiczenie zakonczone
        </h3>
        <p className="text-[#4A5B6A] mb-6">
          Twój tekst jest zapisany i zaszyfrowany.
        </p>
        <div className="flex flex-col gap-2">
          {nextExerciseUrl && (
            <Button onClick={() => router.push(nextExerciseUrl)}>
              Nastepne cwiczenie
            </Button>
          )}
          <Button
            onClick={() => router.push("/program/dashboard")}
            variant="outline"
          >
            Wroc do dashboardu
          </Button>
        </div>
      </div>
    </div>
  );
}
