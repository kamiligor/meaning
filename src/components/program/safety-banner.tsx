"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

export function SafetyBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F1F4F6] border-t border-[#e2e7eb]">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between text-sm text-[#4A5B6A]">
        <span>
          Potrzebujesz wsparcia?{" "}
          <a href="tel:116123" className="font-medium text-[#7B9E8C] hover:underline">
            Telefon Zaufania: 116 123
          </a>
          {" · "}
          <a href="tel:800702222" className="font-medium text-[#7B9E8C] hover:underline">
            Centrum Wsparcia: 800 70 2222
          </a>
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[#7B9E8C] hover:text-[#5a8270] font-medium shrink-0 ml-4"
          aria-expanded={expanded}
          aria-controls="safety-resources-panel"
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">
            {expanded ? "Zamknij" : "Potrzebujesz pomocy?"}
          </span>
        </button>
      </div>

      {expanded && (
        <div
          id="safety-resources-panel"
          className="max-w-4xl mx-auto px-4 pb-4 text-sm text-[#4A5B6A] border-t border-[#e2e7eb] pt-3"
        >
          <p className="mb-3 font-medium text-[#1E2A36]">
            Jesli czujesz, ze potrzebujesz wsparcia — to wazna informacja. Nie musisz radzic sobie sam/a.
          </p>
          <ul className="space-y-2">
            <li>
              <a href="tel:116123" className="text-[#7B9E8C] hover:underline font-medium">
                Telefon Zaufania dla Doroslych: 116 123
              </a>{" "}
              (calodobowo, anonimowo)
            </li>
            <li>
              <a href="tel:800702222" className="text-[#7B9E8C] hover:underline font-medium">
                Centrum Wsparcia: 800 70 2222
              </a>{" "}
              (calodobowo, bezplatnie)
            </li>
            <li>
              <a
                href="https://116111.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7B9E8C] hover:underline font-medium"
              >
                Chat kryzysowy: 116111.pl
              </a>
            </li>
            <li>
              SMS dla osob gluchych: <span className="font-medium">8148</span> (calodobowo)
            </li>
          </ul>
          <p className="mt-3 text-xs text-[#8A99A8]">
            Jesli jestes w bezposrednim niebezpieczenstwie, zadzwon pod numer alarmowy:{" "}
            <a href="tel:112" className="font-medium text-[#7B9E8C]">112</a>
          </p>
        </div>
      )}
    </div>
  );
}
