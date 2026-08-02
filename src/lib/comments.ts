import type { Locale } from "./i18n";

export const COMMENT_MAX_LENGTH = 2000;

export type CommentStatus = "visible" | "hidden";

/**
 * Why a reader flagged a comment. `self_harm` is separated out on purpose:
 * it usually calls for a reply and a helpline rather than a moderation action.
 */
export const REPORT_REASONS = [
  "spam",
  "harassment",
  "self_harm",
  "misinformation",
  "other",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export function isReportReason(value: unknown): value is ReportReason {
  return (
    typeof value === "string" &&
    (REPORT_REASONS as readonly string[]).includes(value)
  );
}

export interface CommentRow {
  id: number;
  post_slug: string;
  locale: string;
  /** NULL once the account behind the comment is gone. */
  user_id: string | null;
  parent_id: number | null;
  body: string;
  status: CommentStatus;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
}

/** A comment as the browser sees it: no user ids, no email, just a name. */
export interface PublicComment {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
  editedAt: string | null;
  deleted: boolean;
  /** The account is gone; the comment is signed "deleted user". */
  authorGone: boolean;
  isOwn: boolean;
  replies: PublicComment[];
}

export function isCommentBodyValid(body: string): boolean {
  const trimmed = body.trim();
  return trimmed.length >= 1 && trimmed.length <= COMMENT_MAX_LENGTH;
}

/** Fallback when someone comments before setting a display name. */
export function fallbackAuthorName(locale: Locale): string {
  return locale === "pl" ? "Czytelnik" : "Reader";
}

/** Signature left on comments whose account no longer exists. */
export function goneAuthorName(locale: Locale): string {
  return locale === "pl" ? "Użytkownik usunięty" : "Deleted user";
}

function toPublic(
  row: CommentRow,
  names: Map<string, string>,
  viewerId: string | null,
  locale: Locale
): PublicComment {
  const deleted = row.deleted_at !== null;
  const authorGone = row.user_id === null;

  const authorName = authorGone
    ? goneAuthorName(locale)
    : names.get(row.user_id!) ?? fallbackAuthorName(locale);

  return {
    id: row.id,
    authorName,
    // The body is already empty in the database for removed comments; this
    // only guards against ever sending one that slipped through.
    body: deleted ? "" : row.body,
    createdAt: row.created_at,
    editedAt: row.edited_at,
    deleted,
    authorGone,
    isOwn: viewerId !== null && row.user_id === viewerId,
    replies: [],
  };
}

/**
 * Build the two-level thread the UI renders. Replies are one level deep by
 * construction (a database trigger enforces it), so no recursion is needed.
 *
 * A deleted top-level comment is kept as an anchor when it still has replies,
 * and dropped entirely when it does not, so threads never lose their shape.
 */
export function buildCommentTree(
  rows: CommentRow[],
  names: Map<string, string>,
  viewerId: string | null,
  locale: Locale
): PublicComment[] {
  const roots: PublicComment[] = [];
  const byId = new Map<number, PublicComment>();

  for (const row of rows) {
    if (row.parent_id !== null) continue;
    const node = toPublic(row, names, viewerId, locale);
    byId.set(row.id, node);
    roots.push(node);
  }

  for (const row of rows) {
    if (row.parent_id === null) continue;
    const parent = byId.get(row.parent_id);
    if (!parent) continue; // parent rejected or not visible to this viewer
    parent.replies.push(toPublic(row, names, viewerId, locale));
  }

  return roots.filter((c) => !c.deleted || c.replies.length > 0);
}
