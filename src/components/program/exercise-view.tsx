"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Exercise } from "@/lib/exercises";
import { ExerciseEditor } from "./exercise-editor";
import { DisclaimerGate } from "./disclaimer-gate";
import { ContentWarning } from "./content-warning";
import { PostExerciseFlow } from "./post-exercise-flow";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Lightbulb } from "lucide-react";

type ViewStep = "disclaimer" | "warning" | "writing" | "postExercise";

interface SavedResponse {
  questionIndex: number;
  content: string;
  updatedAt: string;
}

interface ExerciseViewProps {
  exercise: Exercise;
  savedResponses: SavedResponse[];
  nextExerciseUrl: string | null;
}

export function ExerciseView({
  exercise,
  savedResponses,
  nextExerciseUrl,
}: ExerciseViewProps) {
  const router = useRouter();
  const hasWarning = !!exercise.contentWarning;

  const [step, setStep] = useState<ViewStep>("disclaimer");
  const [stuckOpen, setStuckOpen] = useState(false);

  const getInitialContent = (qi: number) => {
    const saved = savedResponses.find((r) => r.questionIndex === qi);
    return saved?.content || "";
  };

  const handleComplete = async () => {
    try {
      await fetch(`/api/program/progress/${exercise.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
    } catch {
      // Progress tracking is best-effort
    }
    setStep("postExercise");
  };

  const handleSkip = async () => {
    try {
      await fetch(`/api/program/progress/${exercise.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "skipped" }),
      });
    } catch {
      // Best-effort
    }
    router.push("/program/dashboard");
  };

  if (step === "disclaimer") {
    return (
      <DisclaimerGate
        onAccept={() => setStep(hasWarning ? "warning" : "writing")}
      />
    );
  }

  if (step === "warning" && exercise.contentWarning) {
    return (
      <ContentWarning
        warning={exercise.contentWarning}
        onContinue={() => setStep("writing")}
        onSkip={handleSkip}
        onGoBack={() => router.push("/program/dashboard")}
      />
    );
  }

  if (step === "postExercise") {
    return (
      <PostExerciseFlow
        reflectionPrompt={exercise.reflectionPrompt}
        postExerciseNote={exercise.postExerciseNote}
        showCheckin={exercise.difficulty >= 3}
        nextExerciseUrl={nextExerciseUrl}
      />
    );
  }

  // step === "writing"
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1E2A36] mb-2">
          {exercise.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-[#8A99A8]">
          <span>{exercise.estimatedTime}</span>
          <span>·</span>
          <span>
            Poziom {exercise.difficulty}/5
          </span>
        </div>
      </div>

      {/* Introduction */}
      <div className="prose prose-sm max-w-none text-[#4A5B6A] mb-8 whitespace-pre-line leading-relaxed">
        {exercise.introduction}
      </div>

      {/* Prompt instruction (gate exercise) */}
      {exercise.promptInstruction && (
        <div className="bg-[#e8f0eb] rounded-lg p-4 mb-6 text-sm text-[#1E2A36]">
          {exercise.promptInstruction}
        </div>
      )}

      {/* Prompt questions with editors */}
      <div className="space-y-8 mb-8">
        {exercise.promptQuestions.map((question, idx) => (
          <div key={idx}>
            <p className="text-[#1E2A36] font-medium mb-3 leading-relaxed">
              {question}
            </p>
            <ExerciseEditor
              exerciseId={exercise.id}
              questionIndex={idx}
              initialContent={getInitialContent(idx)}
              label={`Odpowiedz na pytanie ${idx + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Stuck helpers */}
      <Collapsible open={stuckOpen} onOpenChange={setStuckOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-[#7B9E8C] hover:text-[#5a8270] transition-colors mb-2">
          <Lightbulb className="h-4 w-4" />
          <span>Nie wiem, co napisac? Podpowiedzi</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${stuckOpen ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-[#F1F4F6] rounded-lg p-4 space-y-3">
            {exercise.stuckHelpers.map((helper, idx) => (
              <p key={idx} className="text-sm text-[#4A5B6A] leading-relaxed">
                {helper}
              </p>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button onClick={handleComplete} className="flex-1">
          Zakoncz cwiczenie
        </Button>
        <Button onClick={handleSkip} variant="outline" className="flex-1">
          Pomin / Wroc pozniej
        </Button>
      </div>

      {/* Why it works */}
      <Collapsible className="mt-8">
        <CollapsibleTrigger className="text-sm text-[#8A99A8] hover:text-[#7B9E8C] transition-colors">
          Dlaczego to dziala? (nauka za cwiczeniem) ▸
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 bg-[#FAFBFC] border border-[#e2e7eb] rounded-lg p-4">
            <p className="text-sm text-[#4A5B6A] whitespace-pre-line leading-relaxed">
              {exercise.whyItWorks}
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
