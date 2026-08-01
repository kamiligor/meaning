"use client";

import { useCallback, useEffect, useState } from "react";

interface QueuedComment {
  id: number;
  postSlug: string;
  locale: string;
  body: string;
  status: string;
  createdAt: string;
  authorName: string;
}

const TABS = [
  { key: "pending", label: "Oczekujące" },
  { key: "approved", label: "Zatwierdzone" },
  { key: "rejected", label: "Odrzucone" },
] as const;

export function ModerationQueue() {
  const [status, setStatus] = useState<string>("pending");
  const [comments, setComments] = useState<QueuedComment[] | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    setComments(null);
    const res = await fetch(`/api/admin/comments?status=${status}`);
    if (!res.ok) {
      setComments([]);
      return;
    }
    const data = await res.json();
    setComments(data.comments ?? []);
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(id: number, next: "approved" | "rejected") {
    setBusy(id);
    await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    setBusy(null);
    load();
  }

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatus(tab.key)}
            className={
              status === tab.key
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
              className="bg-white rounded-lg p-4 border border-[#e2e7eb]"
            >
              <div className="flex items-baseline gap-2 flex-wrap mb-2">
                <span className="text-sm font-semibold text-[#1E2A36]">
                  {c.authorName}
                </span>
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
                {c.body}
              </p>

              <div className="flex gap-2">
                {c.status !== "approved" && (
                  <button
                    onClick={() => decide(c.id, "approved")}
                    disabled={busy === c.id}
                    className="text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-lg bg-[#7B9E8C] text-white disabled:opacity-40 hover:bg-[#6a8d7b] transition-colors"
                  >
                    Zatwierdź
                  </button>
                )}
                {c.status !== "rejected" && (
                  <button
                    onClick={() => decide(c.id, "rejected")}
                    disabled={busy === c.id}
                    className="text-xs font-medium tracking-wider uppercase px-3 py-1.5 rounded-lg border border-[#e2e7eb] text-[#6C7C8B] disabled:opacity-40 hover:text-[#c26a6a] transition-colors"
                  >
                    Odrzuć
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
