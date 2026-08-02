"use client";

import { useState } from "react";
import { t, type Locale } from "@/lib/i18n";

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export function DisplayNameForm({
  locale,
  initialName,
  changedAt,
}: {
  locale: Locale;
  initialName: string | null;
  changedAt: string | null;
}) {
  const d = t(locale);
  const [name, setName] = useState(initialName ?? "");
  const [lastChange, setLastChange] = useState(changedAt);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  const unlocksAt = lastChange
    ? new Date(lastChange).getTime() + COOLDOWN_MS
    : null;
  const locked = unlocksAt !== null && unlocksAt > Date.now();

  function remaining(): string {
    if (unlocksAt === null) return "";
    const ms = unlocksAt - Date.now();
    const hours = Math.floor(ms / 3_600_000);
    const minutes = Math.floor((ms % 3_600_000) / 60_000);
    return hours > 0
      ? `${hours} ${d.displayNameHours}`
      : `${minutes} ${d.displayNameMinutes}`;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || state === "saving" || locked) return;

    setState("saving");
    setError(null);

    try {
      const res = await fetch("/api/profile/display-name", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setName(data?.displayName ?? name);
        setLastChange(data?.changedAt ?? new Date().toISOString());
        setState("saved");
        return;
      }

      setState("idle");
      if (data?.error === "taken") setError(d.displayNameTaken);
      else if (data?.error === "reserved") setError(d.displayNameReserved);
      else if (data?.error === "cooldown") setError(d.displayNameCooldown);
      else setError(d.commentsError);
    } catch {
      setState("idle");
      setError(d.commentsError);
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
      <p className="text-xs text-[#8A99A8]">
        {d.displayNameHint} {d.displayNameCooldown}
      </p>

      <div className="flex gap-2">
        <input
          id="display-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setState("idle");
            setError(null);
          }}
          disabled={locked}
          minLength={2}
          maxLength={40}
          className="flex-1 rounded-lg border border-[#e2e7eb] px-3 py-2 text-sm text-[#1E2A36] placeholder:text-[#b3bec8] focus:outline-none focus:border-[#7B9E8C] disabled:bg-[#F5F7F9] disabled:text-[#8A99A8]"
          placeholder={d.displayNameLabel}
        />
        <button
          type="submit"
          disabled={name.trim().length < 2 || state === "saving" || locked}
          className="text-xs font-semibold tracking-wider uppercase px-4 rounded-lg bg-[#7B9E8C] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#6a8d7b] transition-colors"
        >
          {state === "saving" ? d.commentsSubmitting : d.displayNameSave}
        </button>
      </div>

      {locked && (
        <p className="text-xs text-[#8A99A8]">
          {d.displayNameNextChange} {remaining()}
        </p>
      )}
      {state === "saved" && !error && (
        <p className="text-xs text-[#7B9E8C]">{d.displayNameSaved}</p>
      )}
      {error && <p className="text-xs text-[#c26a6a]">{error}</p>}
    </form>
  );
}
