"use client";

import { useCallback, useEffect, useState } from "react";

interface Report {
  reason: string;
  note: string | null;
  createdAt: string;
}

interface QueuedComment {
  id: number;
  postSlug: string;
  locale: string;
  body: string;
  status: string;
  deleted: boolean;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorBanned: boolean;
  reports: Report[];
}

const TABS = [
  { key: "reported", label: "Zgłoszone" },
  { key: "hidden", label: "Ukryte" },
  { key: "all", label: "Wszystkie" },
] as const;

const REASON_LABELS: Record<string, string> = {
  spam: "Spam",
  harassment: "Napaść",
  self_harm: "Autoagresja",
  misinformation: "Nieprawda",
  other: "Inne",
};

export function ModerationQueue() {
  const [filter, setFilter] = useState<string>("reported");
  const [comments, setComments] = useState<QueuedComment[] | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    setComments(null);
    const res = await fetch(`/api/admin/comments?filter=${filter}`);
    if (!res.ok) {
      setComments([]);
      return;
    }
    const data = await res.json();
    setComments(data.comments ?? []);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: number, status: "visible" | "hidden") {
    setBusy(id);
    await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBusy(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Usunąć komentarz na stałe? Odpowiedzi pod nim też znikną.")) {
      return;
    }
    setBusy(id);
    await fetch(`/api/admin/comments?id=${id}`, { method: "DELETE" });
    setBusy(null);
    load();
  }

  async function toggleBan(c: QueuedComment) {
    setBusy(c.id);
    if (c.authorBanned) {
      await fetch(`/api/admin/comment-bans?userId=${c.authorId}`, {
        method: "DELETE",
      });
    } else {
      await fetch("/api/admin/comment-bans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: c.authorId }),
      });
    }
    setBusy(null);
    load();
  }

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={
              filter === tab.key
                ? "text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-lg bg-[#1E2A36] text-white"
                : "text-xs font-medium tracking-wider uppercase px-3 py-1.5 rounded-lg bg-white text-[#6C7C8B] hover:text-[#1E2A36]"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {comments === null ? (
        <p className="text-sm text-[#8A99A8]">Wczytywanie…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[#8A99A8]">Nic tu nie ma.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className={`rounded-lg p-4 border ${
                c.status === "hidden"
                  ? "bg-[#F7F4F4] border-[#e6d5d5]"
                  : "bg-white border-[#e2e7eb]"
              }`}
            >
              <div className="flex items-baseline gap-2 flex-wrap mb-2">
                <span className="text-sm font-semibold text-[#1E2A36]">
                  {c.authorName}
                </span>
                {c.authorBanned && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#c26a6a] text-white">
                    zablokowany
                  </span>
                )}
                {c.status === "hidden" && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#8A99A8] text-white">
                    ukryty
                  </span>
                )}
                <span className="text-xs uppercase tracking-wider text-[#8A99A8]">
                  {c.locale}
                </span>
                <a
                  href={`/post/${c.postSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#7B9E8C] hover:underline"
                >
                  {c.postSlug}
                </a>
                <span className="text-xs text-[#b3bec8]">
                  {new Date(c.createdAt).toLocaleString("pl-PL")}
                </span>
              </div>

              <p className="text-sm text-[#4A5B6A] whitespace-pre-wrap mb-3">
                {c.deleted ? <em>usunięty przez autora</em> : c.body}
              </p>

              {c.reports.length > 0 && (
                <ul className="mb-3 flex flex-col gap-1 border-l-2 border-[#e6d5d5] pl-3">
                  {c.reports.map((r, i) => (
                    <li key={i} className="text-xs text-[#6C7C8B]">
                      <span className="font-semibold">
                        {REASON_LABELS[r.reason] ?? r.reason}
                      </span>
                      {r.note && <span> — {r.note}</span>}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex gap-2 flex-wrap">
                {c.status === "visible" ? (
                  <button
                    onClick={() => setStatus(c.id, "hidden")}
                    disabled={busy === c.id}
                    className="text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-lg bg-[#1E2A36] text-white disabled:opacity-40 hover:bg-[#2b3b4a] transition-colors"
                  >
                    Ukryj
                  </button>
                ) : (
                  <button
                    onClick={() => setStatus(c.id, "visible")}
                    disabled={busy === c.id}
                    className="text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-lg bg-[#7B9E8C] text-white disabled:opacity-40 hover:bg-[#6a8d7b] transition-colors"
                  >
                    Przywróć
                  </button>
                )}

                <button
                  onClick={() => remove(c.id)}
                  disabled={busy === c.id}
                  className="text-xs font-medium tracking-wider uppercase px-3 py-1.5 rounded-lg border border-[#e2e7eb] text-[#6C7C8B] disabled:opacity-40 hover:text-[#c26a6a] transition-colors"
                >
                  Usuń
                </button>

                <button
                  onClick={() => toggleBan(c)}
                  disabled={busy === c.id}
                  className="text-xs font-medium tracking-wider uppercase px-3 py-1.5 rounded-lg border border-[#e2e7eb] text-[#6C7C8B] disabled:opacity-40 hover:text-[#c26a6a] transition-colors"
                >
                  {c.authorBanned ? "Odblokuj autora" : "Zablokuj autora"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
