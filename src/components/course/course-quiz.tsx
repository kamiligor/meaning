"use client";

import { useRef, useState } from "react";
import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/courses";

interface CourseQuizProps {
  questions: QuizQuestion[];
  savedAnswers: number[] | null;
  onFinished: (answers: number[]) => void;
}

/**
 * A quiz without a score. Picking an answer immediately shows a one-line
 * explanation (also for the correct one), the right answer gets highlighted,
 * and nothing is counted anywhere. Answers can't be changed — the point is
 * the explanation, not the grade.
 */
export function CourseQuiz({ questions, savedAnswers, onFinished }: CourseQuizProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map((_, idx) => savedAnswers?.[idx] ?? null)
  );
  const reported = useRef(savedAnswers !== null && savedAnswers.length > 0);

  const handlePick = (questionIdx: number, optionIdx: number) => {
    if (answers[questionIdx] !== null) return;

    const next = [...answers];
    next[questionIdx] = optionIdx;
    setAnswers(next);

    if (!reported.current && next.every((a) => a !== null)) {
      reported.current = true;
      onFinished(next as number[]);
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((question, qIdx) => {
        const picked = answers[qIdx];
        return (
          <div
            key={qIdx}
            className="bg-white border border-[#e2e7eb] rounded-xl p-5"
          >
            <p className="font-medium text-[#1E2A36] mb-4">{question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, oIdx) => {
                const isPicked = picked === oIdx;
                const revealed = picked !== null;
                const highlight =
                  revealed && (isPicked || option.correct)
                    ? option.correct
                      ? "border-[#7B9E8C] bg-[#f0f7f2]"
                      : "border-[#e0b4a8] bg-[#faf3f1]"
                    : "border-[#e2e7eb] bg-white";

                return (
                  <div key={oIdx}>
                    <button
                      type="button"
                      onClick={() => handlePick(qIdx, oIdx)}
                      disabled={revealed}
                      className={`w-full text-left rounded-lg border p-3.5 transition-colors ${highlight} ${
                        revealed ? "cursor-default" : "hover:border-[#c5cdd4]"
                      }`}
                    >
                      <span className="flex items-start gap-2.5">
                        {revealed && option.correct && (
                          <Check
                            className="h-4 w-4 text-[#7B9E8C] shrink-0 mt-0.5"
                            strokeWidth={2.5}
                          />
                        )}
                        {revealed && isPicked && !option.correct && (
                          <X
                            className="h-4 w-4 text-[#c08a7a] shrink-0 mt-0.5"
                            strokeWidth={2.5}
                          />
                        )}
                        <span className="text-sm text-[#1E2A36]">{option.text}</span>
                      </span>
                    </button>
                    {revealed && (isPicked || option.correct) && (
                      <p className="text-xs text-[#4A5B6A] leading-relaxed mt-1.5 px-3.5">
                        {option.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
