"use client";

import { useState, useEffect, type FormEvent } from "react";
import { t, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "jh-newsletter-subscribed";

type Status = "idle" | "loading" | "success" | "error" | "already_subscribed";

interface NewsletterFormProps {
  locale: Locale;
  variant: "card" | "banner";
}

export function NewsletterForm({ locale, variant }: NewsletterFormProps) {
  const d = t(locale);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // localStorage is browser-only; defer to after hydration to avoid SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHidden(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  if (hidden) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale }),
      });

      if (res.ok) {
        setStatus("success");
        localStorage.setItem(STORAGE_KEY, "true");
      } else if (res.status === 409) {
        setStatus("already_subscribed");
        localStorage.setItem(STORAGE_KEY, "true");
      } else if (res.status === 400) {
        setStatus("error");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const successMessage =
    status === "already_subscribed"
      ? d.newsletterAlreadySubscribed
      : d.newsletterSuccess;

  if (status === "success" || status === "already_subscribed") {
    return (
      <div
        className={
          variant === "card"
            ? "bg-white rounded-2xl shadow-sm border border-[#F1F4F6] border-t-2 border-t-[#7B9E8C] p-6 text-center"
            : "bg-[#F1F4F6] rounded-xl p-5 text-center"
        }
      >
        <div className="flex items-center justify-center gap-2 text-[#7B9E8C]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 10L8.5 13.5L15 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#F1F4F6] border-t-2 border-t-[#7B9E8C] p-6">
        <div className="flex items-start gap-3 mb-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#7B9E8C] shrink-0 mt-0.5"
          >
            <rect
              x="2"
              y="4"
              width="20"
              height="16"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M2 7L10.876 12.594C11.5586 13.0234 12.4414 13.0234 13.124 12.594L22 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <div>
            <h3 className="text-base font-bold text-[#1E2A36]">
              {d.newsletterHeading}
            </h3>
            <p className="text-sm text-[#4A5B6A] mt-1 leading-relaxed">
              {d.newsletterSubtext}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder={d.newsletterPlaceholder}
            required
            className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-[#E2E8ED] bg-[#FAFBFC] text-[#1E2A36] placeholder:text-[#8A99A8] focus:outline-none focus:border-[#7B9E8C] focus:ring-1 focus:ring-[#7B9E8C] transition"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#7B9E8C] rounded-lg hover:bg-[#6a8d7b] transition disabled:opacity-50 shrink-0"
          >
            {status === "loading" ? "..." : d.newsletterSubmit}
          </button>
        </form>
        {status === "error" && (
          <p className="text-xs text-red-500 mt-2">{d.newsletterError}</p>
        )}
      </div>
    );
  }

  // banner variant
  return (
    <div className="bg-[#F1F4F6] rounded-xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[#7B9E8C] shrink-0 mt-0.5"
        >
          <rect
            x="2"
            y="4"
            width="20"
            height="16"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M2 7L10.876 12.594C11.5586 13.0234 12.4414 13.0234 13.124 12.594L22 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div>
          <h3 className="text-base font-bold text-[#1E2A36]">
            {d.newsletterHeading}
          </h3>
          <p className="text-sm text-[#4A5B6A] mt-1 leading-relaxed">
            {d.newsletterSubtext}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder={d.newsletterPlaceholder}
          required
          className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-[#E2E8ED] bg-white text-[#1E2A36] placeholder:text-[#8A99A8] focus:outline-none focus:border-[#7B9E8C] focus:ring-1 focus:ring-[#7B9E8C] transition"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 text-sm font-semibold text-white bg-[#7B9E8C] rounded-lg hover:bg-[#6a8d7b] transition disabled:opacity-50 shrink-0"
        >
          {status === "loading" ? "..." : d.newsletterSubmit}
        </button>
      </form>
      {status === "error" && (
        <p className="text-xs text-red-500 mt-2">{d.newsletterError}</p>
      )}
    </div>
  );
}
