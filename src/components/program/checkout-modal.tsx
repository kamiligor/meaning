"use client";

import { Check, Sparkles, ShieldCheck } from "lucide-react";
import { PaymentForm } from "./payment-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

const FEATURES = [
  "Wszystkie 3 moduły (18 ćwiczeń, 10-15h pracy)",
  "Szyfrowanie treści i autosave",
  "Dożywotni dostęp, bez subskrypcji",
  "Eksport do PDF",
];

export function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent
        className="max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto rounded-2xl p-0 gap-0 border-0 shadow-xl"
        aria-describedby={undefined}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-base font-semibold text-[#1E2A36]">
            Twoje zamówienie
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 pt-5 pb-6 space-y-5">

          {/* Order Summary */}
          <div className="border border-[#e0e0e0] rounded-xl overflow-hidden">

            {/* Product row */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold text-[#1E2A36] text-[15px] leading-snug">
                    The Life Writing Program
                  </p>
                  <p className="text-sm text-[#8A99A8] mt-0.5">Dożywotni dostęp</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-[#8A99A8] line-through leading-snug">79 PLN</p>
                  <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                    <span className="inline-flex items-center gap-1 bg-[#e8f0eb] text-[#7B9E8C] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      <Sparkles className="h-3 w-3" />
                      Wczesny dostęp
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-5">
                {FEATURES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#4A5B6A]">
                    <Check className="h-4 w-4 text-[#7B9E8C] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Price breakdown */}
              <div className="border-t border-[#F1F4F6] pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#4A5B6A]">Cena regularna</span>
                  <span className="text-[#8A99A8] line-through">79,00 PLN</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#7B9E8C] font-medium">Zniżka wczesny dostęp</span>
                  <span className="text-[#7B9E8C] font-medium">-50,00 PLN</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#4A5B6A]">w tym VAT 23%</span>
                  <span className="text-[#8A99A8]">5,42 PLN</span>
                </div>
                <div className="border-t border-[#F1F4F6] pt-3 mt-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1E2A36]">Do zapłaty</span>
                  <span className="text-2xl font-bold text-[#1E2A36]">
                    29 <span className="text-base font-semibold">PLN</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Money-back guarantee */}
            <div className="border-t border-[#F1F4F6] bg-[#fafbfc] px-5 py-3 flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#7B9E8C] shrink-0" strokeWidth={1.5} />
              <span className="text-sm text-[#7B9E8C] font-medium">
                7 dni na darmowy zwrot
              </span>
            </div>
          </div>

          {/* Payment form */}
          <PaymentForm />

          {/* Fine print */}
          <p className="text-center text-xs text-[#8A99A8]">
            Jednorazowa płatność. Bez subskrypcji.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
