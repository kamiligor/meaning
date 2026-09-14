"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ManualTagOption {
  tag: string;
  description: string;
}

interface TagFormsProps {
  manualTags: ManualTagOption[];
}

async function postTagAction(body: Record<string, unknown>) {
  const res = await fetch("/api/admin/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("request failed");
}

/**
 * Two small forms: creating a manual tag (allowlisted, cron never touches
 * it) and assigning/removing that tag for one person by e-mail. Kept in a
 * single component because they share the "which manual tag" select and
 * the status message underneath.
 */
export function TagForms({ manualTags }: TagFormsProps) {
  const router = useRouter();
  const [newTag, setNewTag] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [assignTag, setAssignTag] = useState(manualTags[0]?.tag ?? "");
  const [assignEmail, setAssignEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const tag = newTag.trim();
    if (!tag) return;
    setBusy(true);
    setMessage(null);
    try {
      await postTagAction({
        action: "create",
        tag,
        description: newDescription.trim(),
      });
      setMessage({ type: "success", text: `Tag „${tag}” utworzony.` });
      setNewTag("");
      setNewDescription("");
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Nie udało się utworzyć tagu." });
    } finally {
      setBusy(false);
    }
  }

  async function handleAssign(e: FormEvent) {
    e.preventDefault();
    const email = assignEmail.trim();
    if (!assignTag || !email) return;
    setBusy(true);
    setMessage(null);
    try {
      await postTagAction({ action: "assign", tag: assignTag, email });
      setMessage({
        type: "success",
        text: `Przypisano ${email} do „${assignTag}”.`,
      });
      setAssignEmail("");
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Nie udało się przypisać tagu." });
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    const email = assignEmail.trim();
    if (!assignTag || !email) return;
    if (!confirm(`Usunąć tag „${assignTag}” od ${email}?`)) return;
    setBusy(true);
    setMessage(null);
    try {
      await postTagAction({ action: "remove", tag: assignTag, email });
      setMessage({
        type: "success",
        text: `Usunięto tag „${assignTag}” od ${email}.`,
      });
      setAssignEmail("");
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Nie udało się usunąć przypisania." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl border border-[#e2e7eb] p-5 space-y-3"
        >
          <h2 className="font-semibold text-[#1E2A36]">Nowy tag ręczny</h2>
          <div>
            <label
              htmlFor="new-tag-name"
              className="block text-xs text-[#8A99A8] uppercase tracking-wider mb-1"
            >
              Tag
            </label>
            <input
              id="new-tag-name"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              required
              placeholder="np. vip-czytelnik"
              className="w-full rounded-lg border border-[#e2e7eb] px-3 py-2 text-sm text-[#1E2A36] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C]"
            />
          </div>
          <div>
            <label
              htmlFor="new-tag-desc"
              className="block text-xs text-[#8A99A8] uppercase tracking-wider mb-1"
            >
              Opis
            </label>
            <input
              id="new-tag-desc"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Do czego służy ten tag"
              className="w-full rounded-lg border border-[#e2e7eb] px-3 py-2 text-sm text-[#1E2A36] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C]"
            />
          </div>
          <Button type="submit" disabled={busy}>
            Utwórz tag
          </Button>
        </form>

        <form
          onSubmit={handleAssign}
          className="bg-white rounded-xl border border-[#e2e7eb] p-5 space-y-3"
        >
          <h2 className="font-semibold text-[#1E2A36]">Przypisz osobę</h2>
          {manualTags.length === 0 ? (
            <p className="text-sm text-[#8A99A8]">
              Najpierw utwórz tag ręczny obok.
            </p>
          ) : (
            <>
              <div>
                <label
                  htmlFor="assign-tag"
                  className="block text-xs text-[#8A99A8] uppercase tracking-wider mb-1"
                >
                  Tag
                </label>
                <select
                  id="assign-tag"
                  value={assignTag}
                  onChange={(e) => setAssignTag(e.target.value)}
                  className="w-full rounded-lg border border-[#e2e7eb] px-3 py-2 text-sm text-[#1E2A36] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C]"
                >
                  {manualTags.map((t) => (
                    <option key={t.tag} value={t.tag}>
                      {t.tag}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="assign-email"
                  className="block text-xs text-[#8A99A8] uppercase tracking-wider mb-1"
                >
                  E-mail
                </label>
                <input
                  id="assign-email"
                  type="email"
                  value={assignEmail}
                  onChange={(e) => setAssignEmail(e.target.value)}
                  required
                  placeholder="osoba@przyklad.pl"
                  className="w-full rounded-lg border border-[#e2e7eb] px-3 py-2 text-sm text-[#1E2A36] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C]"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={busy}>
                  Przypisz
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={handleRemove}
                >
                  Usuń przypisanie
                </Button>
              </div>
            </>
          )}
        </form>
      </div>

      {message && (
        <p
          role="status"
          className={`text-sm ${
            message.type === "success" ? "text-[#4A5B6A]" : "text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
