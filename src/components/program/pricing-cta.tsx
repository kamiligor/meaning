"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "./checkout-modal";

export function PricingCTA({ className, variant = "default" }: { className?: string; variant?: "default" | "hero" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        className={className ?? (variant === "hero" ? "text-base px-8" : "w-full text-base")}
        size="lg"
        onClick={() => setOpen(true)}
      >
        Dołącz do programu
      </Button>
      <CheckoutModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
