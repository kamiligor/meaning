"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type PaymentMethod = "blik" | "card";
type FormState = "idle" | "processing" | "success";

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) {
    return digits.slice(0, 2) + "/" + digits.slice(2);
  }
  return digits;
}

function formatBlik(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  if (digits.length > 3) {
    return digits.slice(0, 3) + " " + digits.slice(3);
  }
  return digits;
}

/* ── Icons ── */

function BlikIcon() {
  return (
    <div
      className="flex items-center justify-center rounded"
      style={{ width: 24, height: 18, backgroundColor: "#000", fontSize: 8, fontWeight: 700, color: "#fff", letterSpacing: "0.5px" }}
    >
      BLIK
    </div>
  );
}

function CardIcon() {
  return (
    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0.5" y="0.5" width="23" height="17" rx="2.5" stroke="#d4d4d8" fill="#fff" />
      <rect x="0" y="4" width="24" height="4" fill="#d4d4d8" />
    </svg>
  );
}

function VisaBadge() {
  return (
    <div className="flex items-center justify-center rounded-sm" style={{ width: 32, height: 20, backgroundColor: "#1a1f71", fontSize: 8, fontWeight: 800, color: "#fff", fontStyle: "italic" }}>
      VISA
    </div>
  );
}

function McBadge() {
  return (
    <div className="flex items-center justify-center rounded-sm" style={{ width: 32, height: 20, backgroundColor: "#ff5f00" }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#eb001b", marginRight: -3 }} />
      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f79e1b", marginLeft: -3, opacity: 0.85 }} />
    </div>
  );
}

function CardFieldIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0.5" y="0.5" width="23" height="17" rx="2.5" stroke="#aab7c4" fill="none" />
      <rect x="0" y="4" width="24" height="3.5" fill="#aab7c4" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="#aab7c4" strokeWidth="1.5" />
      <path d="M8 7v4" stroke="#aab7c4" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="#aab7c4" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function SuccessCheckmark() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#7B9E8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="#aab7c4" strokeWidth="1.2" />
      <path d="M3.5 6V4.5a2.5 2.5 0 015 0V6" stroke="#aab7c4" strokeWidth="1.2" />
    </svg>
  );
}

/* ── Shared input styles ── */

const INPUT_BASE = "w-full bg-white text-[14px] leading-[20px] text-[#30313d] placeholder-[#aab7c4] focus:outline-none";

function useFocusRing() {
  const [focused, setFocused] = useState<string | null>(null);
  return { focused, setFocused };
}

/* ── Main Component ── */

export function PaymentForm() {
  const router = useRouter();

  const [method, setMethod] = useState<PaymentMethod>("blik");
  const [formState, setFormState] = useState<FormState>("idle");

  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [blik, setBlik] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { focused, setFocused } = useFocusRing();

  const expiryRef = useRef<HTMLInputElement>(null);
  const cvcRef = useRef<HTMLInputElement>(null);

  const isDisabled = formState !== "idle";

  function handleCardNumberChange(e: ChangeEvent<HTMLInputElement>) {
    const prev = cardNumber.replace(/\s/g, "").length;
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (formatted.replace(/\s/g, "").length === 16 && prev < 16) {
      expiryRef.current?.focus();
    }
  }

  function handleExpiryChange(e: ChangeEvent<HTMLInputElement>) {
    const prevDigits = expiry.replace(/\D/g, "").length;
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
    if (formatted.replace(/\D/g, "").length === 4 && prevDigits < 4) {
      cvcRef.current?.focus();
    }
  }

  function handleCvcChange(e: ChangeEvent<HTMLInputElement>) {
    setCvc(e.target.value.replace(/\D/g, "").slice(0, 3));
  }

  function handleBlikChange(e: ChangeEvent<HTMLInputElement>) {
    setBlik(formatBlik(e.target.value));
  }

  function validate(): string | null {
    if (!email.trim() || !email.includes("@")) return "Podaj poprawny adres e-mail.";
    if (method === "card") {
      if (cardNumber.replace(/\s/g, "").length !== 16) return "Numer karty musi mieć 16 cyfr.";
      if (expiry.replace(/\D/g, "").length !== 4) return "Podaj datę ważności w formacie MM/RR.";
      if (cvc.length !== 3) return "CVC musi mieć 3 cyfry.";
    } else {
      if (blik.replace(/\s/g, "").length !== 6) return "Kod BLIK musi mieć 6 cyfr.";
    }
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setFormState("processing");
    try {
      await fetch("/api/program/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
      });
    } catch { /* dev simulation */ }

    await new Promise((r) => setTimeout(r, 1500));
    setFormState("success");
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/profil");
  }

  /* ── Success state ── */
  if (formState === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12" role="status" aria-live="polite">
        <SuccessCheckmark />
        <p className="text-lg font-semibold" style={{ color: "#7B9E8C" }}>Płatność zakończona!</p>
        <p className="text-sm" style={{ color: "#6d6e78" }}>Przekierowuję...</p>
      </div>
    );
  }

  /* ── Focus ring helper ── */
  function inputBorder(name: string): React.CSSProperties {
    return focused === name
      ? { boxShadow: "0 0 0 2px rgba(123, 158, 140, 0.35)", borderColor: "#7B9E8C" }
      : {};
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full text-left" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* ── Email ── */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium mb-1.5" style={{ color: "#30313d" }}>
          E-mail
        </label>
        <div
          className="rounded-md border transition-shadow"
          style={{ borderColor: focused === "email" ? "#7B9E8C" : "#e0e0e0", ...inputBorder("email") }}
        >
          <input
            type="email"
            autoComplete="email"
            required
            disabled={isDisabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            placeholder="email@example.com"
            className={`${INPUT_BASE} px-3 py-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        </div>
      </div>

      {/* ── Metoda platnosci ── */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium mb-1.5" style={{ color: "#30313d" }}>
          Metoda płatności
        </label>

        <div className="rounded-md border overflow-hidden" style={{ borderColor: "#e0e0e0" }}>

          {/* ── BLIK row ── */}
          <div
            className="cursor-pointer"
            style={{ backgroundColor: method === "blik" ? "#f7f7f7" : "#fff" }}
            onClick={() => { if (!isDisabled) { setMethod("blik"); setError(null); } }}
          >
            <div className="flex items-center gap-3 px-3 py-3">
              <div
                className="flex items-center justify-center shrink-0 rounded-full border-2"
                style={{
                  width: 18, height: 18,
                  borderColor: method === "blik" ? "#7B9E8C" : "#d4d4d8",
                }}
              >
                {method === "blik" && (
                  <div className="rounded-full" style={{ width: 8, height: 8, backgroundColor: "#7B9E8C" }} />
                )}
              </div>
              <BlikIcon />
              <span className="text-[14px] font-medium" style={{ color: "#30313d" }}>BLIK</span>
            </div>

            {/* Expanded BLIK field */}
            {method === "blik" && (
              <div className="px-3 pb-3 pt-0 pl-10">
                <label className="flex items-center gap-1.5 text-[12px] font-medium mb-1" style={{ color: "#6d6e78" }}>
                  Kod BLIK <InfoIcon />
                </label>
                <div
                  className="rounded-md border transition-shadow"
                  style={{ borderColor: focused === "blik" ? "#7B9E8C" : "#e0e0e0", ...inputBorder("blik") }}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={isDisabled}
                    value={blik}
                    onChange={handleBlikChange}
                    onFocus={() => setFocused("blik")}
                    onBlur={() => setFocused(null)}
                    placeholder="123 456"
                    maxLength={7}
                    className={`${INPUT_BASE} px-3 py-2 rounded-md disabled:opacity-50`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div style={{ height: 1, backgroundColor: "#e0e0e0" }} />

          {/* ── Card row ── */}
          <div
            className="cursor-pointer"
            style={{ backgroundColor: method === "card" ? "#f7f7f7" : "#fff" }}
            onClick={() => { if (!isDisabled) { setMethod("card"); setError(null); } }}
          >
            <div className="flex items-center gap-3 px-3 py-3">
              <div
                className="flex items-center justify-center shrink-0 rounded-full border-2"
                style={{
                  width: 18, height: 18,
                  borderColor: method === "card" ? "#7B9E8C" : "#d4d4d8",
                }}
              >
                {method === "card" && (
                  <div className="rounded-full" style={{ width: 8, height: 8, backgroundColor: "#7B9E8C" }} />
                )}
              </div>
              <CardIcon />
              <span className="text-[14px] font-medium" style={{ color: "#30313d" }}>Karta</span>
              <div className="flex items-center gap-1 ml-auto">
                <VisaBadge />
                <McBadge />
              </div>
            </div>

            {/* Expanded Card fields */}
            {method === "card" && (
              <div className="px-3 pb-3 pt-0 pl-10">
                {/* Card number */}
                <label className="block text-[12px] font-medium mb-1" style={{ color: "#6d6e78" }}>
                  Numer karty
                </label>
                <div
                  className="rounded-md border transition-shadow mb-2 flex items-center"
                  style={{ borderColor: focused === "cardNumber" ? "#7B9E8C" : "#e0e0e0", ...inputBorder("cardNumber") }}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    disabled={isDisabled}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    onFocus={() => setFocused("cardNumber")}
                    onBlur={() => setFocused(null)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`${INPUT_BASE} px-3 py-2 rounded-md flex-1 disabled:opacity-50`}
                    style={{ letterSpacing: "0.04em" }}
                  />
                  <span className="pr-3 shrink-0">
                    <CardFieldIcon />
                  </span>
                </div>

                {/* Expiry + CVC in one grouped box */}
                <div
                  className="rounded-md border overflow-hidden flex transition-shadow"
                  style={{ borderColor: (focused === "expiry" || focused === "cvc") ? "#7B9E8C" : "#e0e0e0", ...(focused === "expiry" || focused === "cvc" ? { boxShadow: "0 0 0 2px rgba(123, 158, 140, 0.35)" } : {}) }}
                >
                  <div className="flex-1">
                    <input
                      ref={expiryRef}
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      disabled={isDisabled}
                      value={expiry}
                      onChange={handleExpiryChange}
                      onFocus={() => setFocused("expiry")}
                      onBlur={() => setFocused(null)}
                      placeholder="MM / RR"
                      maxLength={5}
                      className={`${INPUT_BASE} px-3 py-2 w-full disabled:opacity-50`}
                    />
                  </div>
                  <div style={{ width: 1, backgroundColor: "#e0e0e0" }} />
                  <div className="flex-1">
                    <input
                      ref={cvcRef}
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      disabled={isDisabled}
                      value={cvc}
                      onChange={handleCvcChange}
                      onFocus={() => setFocused("cvc")}
                      onBlur={() => setFocused(null)}
                      placeholder="CVC"
                      maxLength={3}
                      className={`${INPUT_BASE} px-3 py-2 w-full disabled:opacity-50`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <p className="mb-4 text-[13px] px-3 py-2 rounded-md" style={{ color: "#df1b41", backgroundColor: "#fdf2f4", border: "1px solid #f5c6cf" }} role="alert">
          {error}
        </p>
      )}

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isDisabled}
        className="w-full py-3 rounded-md text-[14px] font-semibold text-white flex items-center justify-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          backgroundColor: "#7B9E8C",
          opacity: isDisabled ? 0.7 : 1,
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => { if (!isDisabled) e.currentTarget.style.backgroundColor = "#6a8e7c"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#7B9E8C"; }}
      >
        {formState === "processing" ? (
          <><Spinner /><span>Przetwarzanie...</span></>
        ) : (
          "Zapłać"
        )}
      </button>

      {/* ── Powered by Stripe ── */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[11px]" style={{ color: "#aab7c4" }}>
        <span className="flex items-center gap-1">
          Obsługiwane przez
          <span className="font-bold tracking-wide" style={{ color: "#6d6e78" }}>stripe</span>
        </span>
        <span>|</span>
        <span>Warunki</span>
        <span>Prywatność</span>
      </div>
    </form>
  );
}
