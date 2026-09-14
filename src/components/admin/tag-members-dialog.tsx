"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { TagMembersResponse } from "@/lib/analytics-types";

interface TagMembersDialogProps {
  tag: string;
  memberCount: number;
}

/**
 * The e-mail list for a tag lives only behind this dialog: an explicit
 * click, an explicit confirmation checkbox, then a separate fetch to
 * /api/admin/tags/[tag]/members — never shipped to the client alongside the
 * tag counts on page load, and forgotten again as soon as the dialog closes.
 */
export function TagMembersDialog({ tag, memberCount }: TagMembersDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emails, setEmails] = useState<string[] | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setConfirmed(false);
      setEmails(null);
      setError(null);
      setLoading(false);
    }
  }

  async function reveal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/tags/${encodeURIComponent(tag)}/members`
      );
      if (!res.ok) throw new Error("request failed");
      const data: TagMembersResponse = await res.json();
      setEmails(data.emails);
    } catch {
      setError("Nie udało się pobrać listy. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={memberCount === 0}>
          Pokaż listę
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Osoby z tagiem „{tag}”</DialogTitle>
          <DialogDescription>
            To są adresy e-mail realnych osób — pokazuj tylko, jeśli naprawdę
            potrzebujesz.
          </DialogDescription>
        </DialogHeader>

        {emails === null ? (
          <div className="space-y-4">
            <label className="flex items-start gap-2 text-sm text-[#1E2A36]">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5"
              />
              Rozumiem, że to dane osobowe i pokazuję je świadomie.
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Anuluj</Button>
              </DialogClose>
              <Button disabled={!confirmed || loading} onClick={reveal}>
                {loading ? "Wczytywanie…" : "Pokaż"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div>
            {emails.length === 0 ? (
              <p className="text-sm text-[#8A99A8]">
                Brak osób z tym tagiem.
              </p>
            ) : (
              <ul className="max-h-72 overflow-y-auto space-y-1 text-sm text-[#1E2A36]">
                {emails.map((email) => (
                  <li
                    key={email}
                    className="border-b border-[#F1F4F6] last:border-0 py-1.5"
                  >
                    {email}
                  </li>
                ))}
              </ul>
            )}
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Zamknij</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
