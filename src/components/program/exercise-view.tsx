"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Exercise } from "@/lib/exercises";
import { ExerciseEditor } from "./exercise-editor";
import { ContentWarning } from "./content-warning";
import { PostExerciseFlow } from "./post-exercise-flow";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Lightbulb } from "lucide-react";
import { stripHtml, splitParagraphs } from "@/lib/html-utils";
import { meetsMinChars, hasAnyContent } from "@/lib/exercise-validation";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

type ViewStep = "warning" | "writing" | "postExercise";

interface SavedResponse {
  questionIndex: number;
  content: string;
  updatedAt: string;
}

interface ExerciseViewProps {
  exercise: Exercise;
  savedResponses: SavedResponse[];
  nextExerciseUrl: string | null;
  locale: Locale;
}

function roundTime(raw: string): string {
  const match = raw.match(/(\d+)-?(\d+)?\s*minut/);
  if (!match) return raw;
  const lo = parseInt(match[1], 10);
  const hi = match[2] ? parseInt(match[2], 10) : lo;
  const avg = Math.round((lo + hi) / 2 / 5) * 5 || 5;
  return `${avg} minut`;
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="inline-block shrink-0">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 3.5V6.25L7.75 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExerciseView({
  exercise,
  savedResponses,
  nextExerciseUrl,
  locale,
}: ExerciseViewProps) {
  const d = t(locale);
  const router = useRouter();
  const hasWarning = !!exercise.contentWarning;
  const isGate = exercise.id === "gate_00";
  const hasExistingResponses = savedResponses.length > 0;

  const [step, setStep] = useState<ViewStep>(
    hasWarning && !hasExistingResponses ? "warning" : "writing"
  );
  const [stuckOpen, setStuckOpen] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);

  // Track flush callbacks from all editors
  const flushCallbacks = useRef<Map<number, () => Promise<void>>>(new Map());

  const registerFlush = useCallback((questionIndex: number, flush: () => Promise<void>) => {
    flushCallbacks.current.set(questionIndex, flush);
  }, []);

  // Flush all editors — ensures all content is saved to server
  const flushAllEditors = useCallback(async () => {
    const promises = Array.from(flushCallbacks.current.values()).map(fn => fn());
    await Promise.allSettled(promises);
  }, []);

  // Track char counts per question — initialized from saved responses
  const [charCounts, setCharCounts] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    for (const r of savedResponses) {
      initial[r.questionIndex] = stripHtml(r.content).length;
    }
    return initial;
  });

  const handleCharCountChange = useCallback(
    (questionIndex: number, count: number) => {
      setCharCounts((prev) => ({ ...prev, [questionIndex]: count }));
    },
    []
  );

  const getInitialContent = (qi: number) => {
    const saved = savedResponses.find((r) => r.questionIndex === qi);
    return saved?.content || "";
  };

  const meetsMinimum = (): boolean => {
    return meetsMinChars(exercise.promptQuestions, charCounts, isGate);
  };

  const anyContent = (): boolean => {
    return hasAnyContent(charCounts);
  };

  const handleCompleteClick = async () => {
    if (!isGate && !anyContent()) return;
    if (!isGate && !meetsMinimum()) return;

    // Force save all editors before transitioning
    setIsFlushing(true);
    await flushAllEditors();
    setIsFlushing(false);

    setStep("postExercise");
  };

  const handleSaveAndExit = async () => {
    setIsFlushing(true);
    await flushAllEditors();
    setIsFlushing(false);
    router.push("/program/dashboard");
  };

  const handleSkip = async () => {
    // Save any partial content before skipping
    await flushAllEditors();
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

  // --- Content Warning screen ---
  if (step === "warning" && exercise.contentWarning) {
    return (
      <ContentWarning
        warning={exercise.contentWarning}
        onContinue={() => setStep("writing")}
        onSkip={handleSkip}
        onGoBack={() => router.push("/program/dashboard")}
        locale={locale}
      />
    );
  }

  // --- Reflection screen ---
  if (step === "postExercise") {
    return (
      <PostExerciseFlow
        exerciseId={exercise.id}
        questions={exercise.promptQuestions}
        reflectionPrompt={exercise.reflectionPrompt}
        postExerciseNote={exercise.postExerciseNote}
        showCheckin={exercise.difficulty >= 3}
        canComplete={meetsMinimum()}
        nextExerciseUrl={nextExerciseUrl}
        locale={locale}
      />
    );
  }

  // --- Writing screen ---
  const canComplete = isGate || (anyContent() && meetsMinimum());

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1E2A36] mb-2">
          {exercise.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-[#8A99A8]">
          <span>{exercise.estimatedTime}</span>
          <span>·</span>
          <span>{d.exerciseLevel} {exercise.difficulty}/5</span>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-none text-[#4A5B6A] mb-8 leading-relaxed space-y-4">
        {splitParagraphs(exercise.introduction).map((para, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
        ))}
      </div>

      {/* Values list (exercise present_02) */}
      {exercise.valuesList && exercise.valuesList.length > 0 && (
        <div className="mb-8 rounded-lg border border-[#e2e7eb] bg-[#FAFBFC] p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {exercise.valuesList.map((group) => (
              <div key={group.category}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[#8A99A8] mb-2">
                  {group.category}
                </h3>
                <ul className="space-y-1">
                  {group.values.map((value) => (
                    <li
                      key={value}
                      className="flex items-start gap-2 text-sm text-[#1E2A36]"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#7B9E8C]" aria-hidden="true" />
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prompt instruction (gate exercise) */}
      {exercise.promptInstruction && (
        <div className="bg-[#e8f0eb] rounded-lg p-4 mb-6 text-sm text-[#1E2A36]">
          {exercise.promptInstruction.replace(/\n/g, " ").trim()}
        </div>
      )}

      {/* Prompt questions with editors */}
      <div className="space-y-8 mb-8">
        {exercise.promptQuestions.map((question, idx) => (
          <div key={idx}>
            <p className="text-[#1E2A36] font-medium mb-2 leading-relaxed">
              {question.text}
            </p>
            {question.estimatedTime && (
              <p className="flex items-center gap-1 text-xs text-[#8A99A8] mb-3">
                <ClockIcon />
                <span>~{roundTime(question.estimatedTime)}</span>
              </p>
            )}
            <ExerciseEditor
              exerciseId={exercise.id}
              questionIndex={idx}
              initialContent={getInitialContent(idx)}
              label={`${d.reflectionQuestion} ${idx + 1}`}
              minChars={question.minChars}
              onCharCountChange={(count) => handleCharCountChange(idx, count)}
              onRegisterFlush={registerFlush}
              locale={locale}
            />
          </div>
        ))}
      </div>

      {/* Stuck helpers */}
      <Collapsible open={stuckOpen} onOpenChange={setStuckOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-[#7B9E8C] hover:text-[#5a8270] transition-colors mb-2">
          <Lightbulb className="h-4 w-4" />
          <span>{d.exerciseStuckLabel}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${stuckOpen ? "rotate-180" : ""}`} />
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
        <Button
          onClick={handleCompleteClick}
          disabled={!canComplete || isFlushing}
          className="flex-1"
        >
          {isFlushing ? d.editorSaving : d.exerciseFinish}
        </Button>
        <Button
          onClick={handleSaveAndExit}
          disabled={isFlushing}
          variant="outline"
          className="flex-1"
        >
          {d.exerciseSaveExit}
        </Button>
      </div>

      {/* Why it works */}
      <Collapsible className="mt-8">
        <CollapsibleTrigger className="text-sm text-[#8A99A8] hover:text-[#7B9E8C] transition-colors">
          {d.exerciseWhyWorks} &#9658;
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 bg-[#FAFBFC] border border-[#e2e7eb] rounded-lg p-4">
            {splitParagraphs(exercise.whyItWorks).map((para, i) => (
              <p key={i} className="text-sm text-[#4A5B6A] leading-relaxed mb-2 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
