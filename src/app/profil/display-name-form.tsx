"use client";

import { useState } from "react";
import { t, type Locale } from "@/lib/i18n";

export function DisplayNameForm({
  locale,
  initialName,
}: {
  locale: Locale;
  initialName: string | null;
}) {
  const d = t(locale);
  const [name, setName] = useState(initialName ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || state === "saving") return;

    setState("saving");
    try {
      const res = await fetch("/api/profile/display-name", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name }),
      });
      setState(res.ok ? "saved" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={save} className="space-y-2">
      <label
        htmlFor="display-name"
        className="block text-sm font-medium text-[#1E2A36]"
      >
        {d.displayNameLabel}
      </label>
      <p className="text-xs text-[#8A99A8]">{d.displayNameHint}</p>

      <div className="flex gap-2">
        <input
          id="display-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setState("idle");
          }}
          minLength={2}
          maxLength={40}
          className="flex-1 rounded-lg border border-[#e2e7eb] px-3 py-2 text-sm text-[#1E2A36] placeholder:text-[#b3bec8] focus:outline-none focus:border-[#7B9E8C]"
          placeholder={d.displayNameLabel}
        />
        <button
          type="submit"
          disabled={name.trim().length < 2 || state === "saving"}
          className="text-xs font-semibold tracking-wider uppercase px-4 rounded-lg bg-[#7B9E8C] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#6a8d7b] transition-colors"
        >
          {state === "saving" ? d.commentsSubmitting : d.displayNameSave}
        </button>
      </div>

      {state === "saved" && (
        <p className="text-xs text-[#7B9E8C]">{d.displayNameSaved}</p>
      )}
      {state === "error" && (
        <p className="text-xs text-[#c26a6a]">{d.commentsError}</p>
      )}
    </form>
  );
}
