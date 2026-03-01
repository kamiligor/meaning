import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#4A5B6A]">
          Ukonczone: {completed}/{total} cwiczen
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
