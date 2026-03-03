"use client";

import { Phone } from "lucide-react";

export function SafetyBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F1F4F6]/95 backdrop-blur-sm border-t border-[#e2e7eb]">
      <div className="max-w-4xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs text-[#8A99A8]">
        <span>
          Wsparcie:{" "}
          <a href="tel:116123" className="text-[#7B9E8C] hover:underline">
            116 123
          </a>
          {" · "}
          <a href="tel:800702222" className="text-[#7B9E8C] hover:underline">
            800 70 2222
          </a>
        </span>
        <a
          href="/program/zasoby"
          className="flex items-center gap-1 text-[#7B9E8C] hover:underline shrink-0 ml-4"
        >
          <Phone className="h-3 w-3" />
          <span className="hidden sm:inline">Wiecej</span>
        </a>
      </div>
    </div>
  );
}
