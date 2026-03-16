import type { PromptQuestion } from "./exercises";

export function calculateMaxChars(minChars: number): number {
  return Math.max(minChars * 10, 2000);
}

export function meetsMinChars(
  questions: PromptQuestion[],
  charCounts: Record<number, number>,
  isGate: boolean
): boolean {
  if (isGate) return true;
  return questions.every((q, idx) => {
    if (q.minChars === 0) return true;
    return (charCounts[idx] ?? 0) >= q.minChars;
  });
}

export function hasAnyContent(charCounts: Record<number, number>): boolean {
  return Object.values(charCounts).some((c) => c > 0);
}
