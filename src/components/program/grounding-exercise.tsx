"use client";

import { Button } from "@/components/ui/button";

interface GroundingExerciseProps {
  onDashboard: () => void;
  onContinue: () => void;
}

export function GroundingExercise({
  onDashboard,
  onContinue,
}: GroundingExerciseProps) {
  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="bg-[#e8f0eb] rounded-xl p-6">
        <h3 className="text-lg font-medium text-[#1E2A36] mb-4">
          Cwiczenie uziemiajace — wroc do tu i teraz
        </h3>
        <p className="text-[#4A5B6A] mb-4">
          Rozejrzyj sie po pomieszczeniu, w którym jestes. Nie spiesz sie.
        </p>
        <p className="text-[#4A5B6A] mb-3">
          Wymien (w myslach lub na glos):
        </p>
        <ul className="space-y-2 text-[#1E2A36] mb-6">
          <li className="flex items-start gap-2">
            <span className="font-medium text-[#7B9E8C] shrink-0">5</span>
            rzeczy, które widzisz
          </li>
          <li className="flex items-start gap-2">
            <span className="font-medium text-[#7B9E8C] shrink-0">4</span>
            rzeczy, które slyszysz
          </li>
          <li className="flex items-start gap-2">
            <span className="font-medium text-[#7B9E8C] shrink-0">3</span>
            rzeczy, które mozesz dotkn&#261;c
          </li>
          <li className="flex items-start gap-2">
            <span className="font-medium text-[#7B9E8C] shrink-0">2</span>
            rzeczy, które czujesz (zapach)
          </li>
          <li className="flex items-start gap-2">
            <span className="font-medium text-[#7B9E8C] shrink-0">1</span>
            rzecz, któr&#261; smakujesz
          </li>
        </ul>
        <p className="text-[#4A5B6A] mb-6">
          Wez kilka glebokich oddechów. Nie musisz nic robic. Jestes tu, jestes bezpieczny/a.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onDashboard} variant="outline" className="flex-1">
            Wroc do dashboardu
          </Button>
          <Button onClick={onContinue} className="flex-1">
            Kontynuuj program
          </Button>
        </div>
      </div>
    </div>
  );
}
