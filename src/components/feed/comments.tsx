"use client";

import { useCallback, useEffect, useState } from "react";
import { t, type Locale } from "@/lib/i18n";
import { COMMENT_MAX_LENGTH, type PublicComment } from "@/lib/comments";

interface CommentsProps {
  slug: string;
  locale: Locale;
  isLoggedIn: boolean;
  hasDisplayName: boolean;
}

function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function Comments({
  slug,
  locale,
  isLoggedIn,
  hasDisplayName,
}: CommentsProps) {
  const d = t(locale);
  const [comments, setComments] = useState<PublicComment[] | null>(null);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${slug}/comments`);
      if (!res.ok) return;
      const data = await res.json();
      setComments(data.comments ?? []);
    } catch {
      // Offline or transient failure — keep whatever is on screen.
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: number) {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    load();
  }

  const canWrite = isLoggedIn && hasDisplayName;

  return (
    <section className="mt-12 pt-8 border-t border-[#F1F4F6]">
      <h2 className="text-sm font-semibold tracking-widest uppercase text-[#8A99A8] mb-5">
        {d.commentsHeading}
      </h2>

      {canWrite ? (
        <CommentForm
          slug={slug}
          locale={locale}
          parentId={null}
          onDone={() => {
            setReplyTo(null);
            load();
          }}
        />
      ) : (
        <p className="text-sm text-[#8A99A8] mb-6">
          {isLoggedIn ? d.commentsNameNeeded : d.commentsLoginPrompt}{" "}
          {!isLoggedIn && (
            <a
              href={`/login?next=/post/${slug}`}
              className="text-[#7B9E8C] hover:underline"
            >
              {d.navLogIn}
            </a>
          )}
          {isLoggedIn && (
            <a href="/profil" className="text-[#7B9E8C] hover:underline">
              {d.navMyAccount}
            </a>
          )}
        </p>
      )}

      <p className="text-xs text-[#8A99A8] mb-8">{d.commentsSafetyNote}</p>

      {comments === null ? null : comments.length === 0 ? (
        <p className="text-sm text-[#8A99A8]">{d.commentsEmpty}</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {comments.map((c) => (
            <li key={c.id}>
              <CommentBody comment={c} locale={locale} onDelete={remove} />

              {canWrite && !c.deleted && (
                <div className="mt-2 ml-1">
                  {replyTo === c.id ? (
                    <CommentForm
                      slug={slug}
                      locale={locale}
                      parentId={c.id}
                      onDone={() => {
                        setReplyTo(null);
                        load();
                      }}
                      onCancel={() => setReplyTo(null)}
                    />
                  ) : (
                    <button
                      onClick={() => setReplyTo(c.id)}
                      className="text-xs font-medium text-[#8A99A8] hover:text-[#7B9E8C] transition-colors"
                    >
                      {d.commentsReply}
                    </button>
                  )}
                </div>
              )}

              {c.replies.length > 0 && (
                <ul className="mt-4 ml-5 pl-4 border-l border-[#F1F4F6] flex flex-col gap-4">
                  {c.replies.map((r) => (
                    <li key={r.id}>
                      <CommentBody
                        comment={r}
                        locale={locale}
                        onDelete={remove}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CommentBody({
  comment,
  locale,
  onDelete,
}: {
  comment: PublicComment;
  locale: Locale;
  onDelete: (id: number) => void;
}) {
  const d = t(locale);

  if (comment.deleted) {
    return <p className="text-sm italic text-[#b3bec8]">{d.commentsDeleted}</p>;
  }

  return (
    <div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-sm font-semibold text-[#1E2A36]">
          {comment.authorName}
        </span>
        <span className="text-xs text-[#b3bec8]">
          {formatDate(comment.createdAt, locale)}
        </span>
        {comment.isOwn && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-xs text-[#b3bec8] hover:text-[#c26a6a] transition-colors"
          >
            {d.commentsDelete}
          </button>
        )}
      </div>

      <p className="mt-1 text-[15px] leading-relaxed text-[#4A5B6A] whitespace-pre-wrap">
        {comment.body}
      </p>

      {comment.pending && (
        <p className="mt-1 text-xs text-[#c9a227]">{d.commentsPendingNote}</p>
      )}
    </div>
  );
}

function CommentForm({
  slug,
  locale,
  parentId,
  onDone,
  onCancel,
}: {
  slug: string;
  locale: Locale;
  parentId: number | null;
  onDone: () => void;
  onCancel?: () => void;
}) {
  const d = t(locale);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || sending) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, parentId }),
      });

      if (res.status === 429) {
        setError(d.commentsTooMany);
        return;
      }
      if (!res.ok) {
        setError(d.commentsError);
        return;
      }

      setBody("");
      onDone();
    } catch {
      setError(d.commentsError);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mb-6 flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={COMMENT_MAX_LENGTH}
        rows={parentId === null ? 3 : 2}
        placeholder={
          parentId === null ? d.commentsPlaceholder : d.commentsReplyPlaceholder
        }
        className="w-full rounded-lg border border-[#e2e7eb] px-3 py-2 text-sm text-[#1E2A36] placeholder:text-[#b3bec8] focus:outline-none focus:border-[#7B9E8C] resize-y"
      />

      {error && <p className="text-xs text-[#c26a6a]">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!body.trim() || sending}
          className="text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-lg bg-[#7B9E8C] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#6a8d7b] transition-colors"
        >
          {sending ? d.commentsSubmitting : d.commentsSubmit}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[#8A99A8] hover:text-[#1E2A36] transition-colors"
          >
            {d.commentsCancel}
          </button>
        )}
      </div>
    </form>
  );
}
