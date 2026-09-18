/**
 * Thin client for the MailerLite API (connect.mailerlite.com), scoped to
 * what course reminders need. MailerLite's marketing API cannot send a
 * one-off transactional e-mail; the supported pattern is: set custom fields
 * on the subscriber, (re-)add them to a trigger group, and let a MailerLite
 * automation ("subscriber joins group", re-entry allowed) send the actual
 * message using those fields. Setup steps: docs/specs/kurs-przypomnienia-mailerlite.md
 */

const API_BASE = "https://connect.mailerlite.com/api";

/**
 * Trigger groups of the former automation-based reminders. Reminders now go
 * out over SMTP (src/lib/mailer.ts); kept only so old groups keep resolving.
 */
export const REMINDER_GROUP_NAME = "kurs-przypomnienie-dnia";
export const WINBACK_GROUP_NAME = "kurs-powrot";

/** Custom fields the automation templates can interpolate. */
const REQUIRED_FIELDS: { name: string; type: "text" | "number" }[] = [
  { name: "kurs_nazwa", type: "text" },
  { name: "kurs_dzien", type: "number" },
  { name: "kurs_dni", type: "number" },
  { name: "kurs_link", type: "text" },
];

function getToken(): string {
  const token = process.env.MAILERLITE_API_TOKEN;
  if (!token) throw new Error("MAILERLITE_API_TOKEN is not set");
  return token;
}

async function api(
  path: string,
  init: { method?: string; body?: unknown } = {}
): Promise<{ status: number; data: unknown }> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

// Group and field ids are stable per account; cache them per process.
const groupIdCache = new Map<string, string>();
let fieldsEnsured = false;

export async function ensureGroup(name: string): Promise<string> {
  const cached = groupIdCache.get(name);
  if (cached) return cached;

  const found = await api(`/groups?filter[name]=${encodeURIComponent(name)}`);
  const foundList = (found.data as { data?: { id: string; name: string }[] })
    .data;
  const existing = foundList?.find((g) => g.name === name);
  if (existing) {
    groupIdCache.set(name, existing.id);
    return existing.id;
  }

  const created = await api("/groups", { method: "POST", body: { name } });
  const id = (created.data as { data?: { id: string } }).data?.id;
  if (!id) {
    throw new Error(`MailerLite: could not create group "${name}" (${created.status})`);
  }
  groupIdCache.set(name, id);
  return id;
}

export async function ensureFields(): Promise<void> {
  if (fieldsEnsured) return;

  const existing = await api("/fields?limit=100");
  const names = new Set(
    ((existing.data as { data?: { key?: string; name?: string }[] }).data ?? []).flatMap(
      (f) => [f.key, f.name?.toLowerCase()].filter(Boolean) as string[]
    )
  );

  for (const field of REQUIRED_FIELDS) {
    if (names.has(field.name)) continue;
    await api("/fields", { method: "POST", body: field });
  }
  fieldsEnsured = true;
}

/**
 * Upsert the subscriber with reminder fields, then re-add them to the
 * trigger group. The remove + add pair lets a "joins group" automation with
 * re-entry enabled fire again for every new reminder.
 */
export async function sendGroupTriggeredMail(
  email: string,
  groupName: string,
  fields: Record<string, string | number>
): Promise<boolean> {
  await ensureFields();
  const groupId = await ensureGroup(groupName);

  const upsert = await api("/subscribers", {
    method: "POST",
    body: { email, fields },
  });
  const subscriberId = (upsert.data as { data?: { id: string } }).data?.id;
  if (!subscriberId) {
    console.error("[mailerlite] upsert failed:", upsert.status);
    return false;
  }

  // Ignore failures here: not being in the group yet is the normal case.
  await api(`/subscribers/${subscriberId}/groups/${groupId}`, {
    method: "DELETE",
  });

  const assign = await api(`/subscribers/${subscriberId}/groups/${groupId}`, {
    method: "POST",
  });
  if (assign.status >= 400) {
    console.error("[mailerlite] group assign failed:", assign.status);
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Campaign tags (docs/specs/tracking-analytics.md, section 8). Every tag
// group name carries a "tag-" prefix so it can never collide with the
// reminder/winback trigger groups above, and so cleanup on account deletion
// only ever touches tag groups. Only e-mail and group name ever cross this
// boundary — never response content, never behavioural detail beyond "is in
// this named group".
// ---------------------------------------------------------------------------

export const TAG_GROUP_PREFIX = "tag-";

export function tagGroupName(tag: string): string {
  return `${TAG_GROUP_PREFIX}${tag}`;
}

export interface MailerliteSubscriber {
  id: string;
  status: string;
  groupIds: string[];
}

/**
 * A subscriber's current status and group membership, or null when no
 * subscriber exists for this e-mail (never subscribed, or removed). Status
 * `active` is the only one that counts as real consent (double opt-in) —
 * everything else (unconfirmed, unsubscribed, bounced, junk) must be treated
 * like "no subscription" by callers.
 */
export async function getSubscriber(
  email: string
): Promise<MailerliteSubscriber | null> {
  const res = await api(`/subscribers/${encodeURIComponent(email)}`);
  if (res.status === 404) return null;
  const data = (
    res.data as {
      data?: {
        id?: string;
        status?: string;
        groups?: { id: string }[];
      };
    }
  ).data;
  if (!data?.id) return null;
  return {
    id: data.id,
    status: data.status ?? "unknown",
    groupIds: (data.groups ?? []).map((g) => g.id),
  };
}

export async function addSubscriberToGroup(
  subscriberId: string,
  groupId: string
): Promise<boolean> {
  const res = await api(`/subscribers/${subscriberId}/groups/${groupId}`, {
    method: "POST",
  });
  if (res.status >= 400) {
    console.error("[mailerlite] addSubscriberToGroup failed:", res.status);
    return false;
  }
  return true;
}

export async function removeSubscriberFromGroup(
  subscriberId: string,
  groupId: string
): Promise<boolean> {
  const res = await api(`/subscribers/${subscriberId}/groups/${groupId}`, {
    method: "DELETE",
  });
  if (res.status >= 400 && res.status !== 404) {
    console.error("[mailerlite] removeSubscriberFromGroup failed:", res.status);
    return false;
  }
  return true;
}

/** All groups in the account. Paginated with the API's cursor style. */
export async function listGroups(): Promise<{ id: string; name: string }[]> {
  const groups: { id: string; name: string }[] = [];
  let cursor: string | null = null;
  for (;;) {
    const qs = new URLSearchParams({ limit: "100" });
    if (cursor) qs.set("cursor", cursor);
    const res = await api(`/groups?${qs.toString()}`);
    const body = res.data as {
      data?: { id: string; name: string }[];
      meta?: { next_cursor?: string | null };
    };
    for (const g of body.data ?? []) groups.push({ id: g.id, name: g.name });
    const next = body.meta?.next_cursor ?? null;
    if (!next || (body.data ?? []).length === 0) break;
    cursor = next;
  }
  return groups;
}

/**
 * All e-mails currently in a group, paginated with the API's cursor style
 * (developers.mailerlite.com/docs/groups.html — subscribers of a group).
 * Used only by the full reconciliation, never by the incremental sync.
 */
export async function listGroupSubscriberEmails(
  groupId: string
): Promise<string[]> {
  const emails: string[] = [];
  let cursor: string | null = null;
  for (;;) {
    const qs = new URLSearchParams({ limit: "100" });
    if (cursor) qs.set("cursor", cursor);
    const res = await api(`/groups/${groupId}/subscribers?${qs.toString()}`);
    const body = res.data as {
      data?: { email?: string }[];
      meta?: { next_cursor?: string | null };
    };
    for (const s of body.data ?? []) {
      if (s.email) emails.push(s.email);
    }
    const next = body.meta?.next_cursor ?? null;
    if (!next || (body.data ?? []).length === 0) break;
    cursor = next;
  }
  return emails;
}

/**
 * Removes a subscriber from a specific set of (already-existing) groups by
 * name. Used to clean up campaign-tag groups on account deletion. Silently
 * does nothing for a group name that does not exist or that the person is
 * not a member of — cleanup is best-effort, not an assertion.
 */
export async function removeSubscriberFromGroups(
  email: string,
  groupNames: string[]
): Promise<void> {
  if (groupNames.length === 0) return;
  const subscriber = await getSubscriber(email);
  if (!subscriber) return;

  const groups = await listGroups();
  const targets = groups.filter(
    (g) => groupNames.includes(g.name) && subscriber.groupIds.includes(g.id)
  );
  for (const group of targets) {
    await removeSubscriberFromGroup(subscriber.id, group.id);
  }
}
