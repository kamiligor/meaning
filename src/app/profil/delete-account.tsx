"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { t, type Locale } from "@/lib/i18n";

/**
 * Account deletion, in two steps: the panel stays folded until asked for, and
 * the button only unlocks once the confirmation word is typed.
 *
 * Leaving comments up is opt-in and unchecked by default. Consent has to be a
 * real choice, so deletion works either way and the default removes the text.
 */
export function DeleteAccount({ locale }: { locale: Locale }) {
  const d = t(locale);
  const [open, setOpen] = useState(false);
  const [keepComments, setKeepComments] = useState(false);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmed = typed.trim().toUpperCase() === d.accountDeleteConfirmWord;

  async function remove() {
    if (!confirmed || deleting) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/program/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keepComments }),
      });

      if (!res.ok) {
        setError(d.accountDeleteError);
        setDeleting(false);
        return;
      }

      // The account is gone, but this browser still holds its cookies.
      await createClient().auth.signOut();
      window.location.href = "/";
    } catch {
      setError(d.accountDeleteError);
      setDeleting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-[#8A99A8] hover:text-[#c26a6a] transition-colors"
      >
        {d.accountDeleteTitle}
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-[#e6d5d5] bg-[#FDF9F9] p-4">
      <h3 className="text-sm font-semibold text-[#1E2A36] mb-2">
        {d.accountDeleteTitle}
      </h3>

      <p className="text-sm text-[#6C7C8B] mb-2">{d.accountDeleteIntro}</p>
      <p className="text-xs text-[#8A99A8] mb-4">
        {d.accountDeleteExportFirst}
      </p>

      <label className="flex gap-2 mb-1 cursor-pointer">
        <input
          type="checkbox"
          checked={keepComments}
          onChange={(e) => setKeepComments(e.target.checked)}
          className="mt-0.5 shrink-0"
        />
        <span className="text-sm text-[#4A5B6A]">
          {d.accountDeleteKeepComments}
        </span>
      </label>
      <p className="text-xs text-[#8A99A8] mb-4 ml-6">
        {d.accountDeleteKeepCommentsNote}
      </p>

      <label
        htmlFor="delete-confirm"
        className="block text-xs font-medium text-[#1E2A36] mb-1"
      >
        {d.accountDeleteConfirmLabel}
      </label>
      <input
        id="delete-confirm"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        autoComplete="off"
        className="w-full max-w-[16rem] rounded-lg border border-[#e2e7eb] px-3 py-2 text-sm text-[#1E2A36] focus:outline-none focus:border-[#c26a6a] mb-4"
      />

      {error && <p className="text-xs text-[#c26a6a] mb-3">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={remove}
          disabled={!confirmed || deleting}
          className="text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-lg bg-[#c26a6a] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#ad5c5c] transition-colors"
        >
          {deleting ? d.accountDeleting : d.accountDeleteConfirm}
        </button>

        <button
          onClick={() => {
            setOpen(false);
            setTyped("");
            setError(null);
          }}
          className="text-xs text-[#8A99A8] hover:text-[#1E2A36] transition-colors"
        >
          {d.accountDeleteCancel}
        </button>
      </div>
    </div>
  );
}
