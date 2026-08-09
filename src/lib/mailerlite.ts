/**
 * Thin client for the MailerLite API (connect.mailerlite.com), scoped to
 * what course reminders need. MailerLite's marketing API cannot send a
 * one-off transactional e-mail; the supported pattern is: set custom fields
 * on the subscriber, (re-)add them to a trigger group, and let a MailerLite
 * automation ("subscriber joins group", re-entry allowed) send the actual
 * message using those fields. Setup steps: docs/specs/kurs-przypomnienia-mailerlite.md
 */

const API_BASE = "https://connect.mailerlite.com/api";

/** Trigger groups; created automatically if missing. */
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
