"use client";

import { useRef, useState } from "react";
import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/courses";

interface CourseQuizProps {
  questions: QuizQuestion[];
  /**
   * "solve": answer until correct — a wrong pick shows its explanation and
   * the question stays open; the quiz is passed when every question has been
   * answered correctly. "review": everything revealed, nothing clickable
   * (used on completed days).
   */
  mode: "solve" | "review";
  /** Called once, when the last open question gets answered correctly. */
  onPassed?: (firstAttempts: number[]) => void;
}

export function CourseQuiz({ questions, mode, onPassed }: CourseQuizProps) {
  // Per question: every picked option (wrong picks stay marked), first pick,
  // and whether the correct one has been found.
  const [picked, setPicked] = useState<Set<number>[]>(() =>
    questions.map(() => new Set<number>())
  );
  const firstAttempts = useRef<(number | null)[]>(questions.map(() => null));
  const reported = useRef(false);

  const isSolved = (qIdx: number) =>
    mode === "review" ||
    [...picked[qIdx]].some((oIdx) => questions[qIdx].options[oIdx]?.correct);

  const handlePick = (qIdx: number, oIdx: number) => {
    if (mode === "review" || isSolved(qIdx) || picked[qIdx].has(oIdx)) return;

    if (firstAttempts.current[qIdx] === null) {
      firstAttempts.current[qIdx] = oIdx;
    }

    const next = picked.map((set, idx) =>
      idx === qIdx ? new Set([...set, oIdx]) : set
    );
    setPicked(next);

    const allSolved = questions.every((question, idx) =>
      [...next[idx]].some((pickedIdx) => question.options[pickedIdx]?.correct)
    );
    if (allSolved && !reported.current) {
      reported.current = true;
      onPassed?.(firstAttempts.current.map((a) => a ?? 0));
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((question, qIdx) => {
        const solved = isSolved(qIdx);
        return (
          <div
            key={qIdx}
            className="bg-white border border-[#e2e7eb] rounded-xl p-5"
          >
            <p className="font-medium text-[#1E2A36] mb-4">{question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, oIdx) => {
                const wasPicked = mode === "solve" && picked[qIdx].has(oIdx);
                const revealCorrect = solved && option.correct;
                const revealWrong = wasPicked && !option.correct;
                const highlight = revealCorrect
                  ? "border-[#7B9E8C] bg-[#f0f7f2]"
                  : revealWrong
                    ? "border-[#e0b4a8] bg-[#faf3f1]"
                    : "border-[#e2e7eb] bg-white";
                const clickable = mode === "solve" && !solved && !wasPicked;

                return (
                  <div key={oIdx}>
                    <button
                      type="button"
                      onClick={() => handlePick(qIdx, oIdx)}
                      disabled={!clickable}
                      className={`w-full text-left rounded-lg border p-3.5 transition-colors ${highlight} ${
                        clickable ? "hover:border-[#c5cdd4]" : "cursor-default"
                      }`}
                    >
                      <span className="flex items-start gap-2.5">
                        {revealCorrect && (
                          <Check
                            className="h-4 w-4 text-[#7B9E8C] shrink-0 mt-0.5"
                            strokeWidth={2.5}
                          />
                        )}
                        {revealWrong && (
                          <X
                            className="h-4 w-4 text-[#c08a7a] shrink-0 mt-0.5"
                            strokeWidth={2.5}
                          />
                        )}
                        <span className="text-sm text-[#1E2A36]">{option.text}</span>
                      </span>
                    </button>
                    {(revealCorrect || revealWrong) && (
                      <p className="text-xs text-[#4A5B6A] leading-relaxed mt-1.5 px-3.5">
                        {option.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {mode === "solve" && !solved && picked[qIdx].size > 0 && (
              <p className="text-xs text-[#8A99A8] mt-3">
                Nic straconego, spróbuj jeszcze raz. Quiz nie zbiera punktów,
                zbiera zrozumienie.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
