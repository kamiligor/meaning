"use client";

import { Button } from "@/components/ui/button";

interface DisclaimerGateProps {
  onAccept: () => void;
}

export function DisclaimerGate({ onAccept }: DisclaimerGateProps) {
  return (
    <div className="max-w-lg mx-auto text-center py-12 px-4">
      <div className="bg-white rounded-xl border border-[#e2e7eb] p-8 shadow-sm">
        <p className="text-[#1E2A36] leading-relaxed mb-2">
          Ten program to narzedzie do autorefleksji. Nie zastepuje psychoterapii.
        </p>
        <p className="text-[#4A5B6A] text-sm leading-relaxed mb-2">
          Jesli zmagasz sie z powaznymi problemami psychicznymi, myslami samobójczymi
          lub skutkami traumy — skontaktuj sie ze specjalista.
        </p>
        <p className="text-sm text-[#7B9E8C] mb-6">
          Telefon Zaufania: 116 123 · Centrum Wsparcia: 800 70 2222
        </p>
        <Button onClick={onAccept} className="w-full">
          Rozumiem. Chce kontynuowac.
        </Button>
      </div>
    </div>
  );
}
