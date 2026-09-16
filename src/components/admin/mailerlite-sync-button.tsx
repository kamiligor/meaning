"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TagSyncResponse } from "@/lib/analytics-types";

/**
 * Full reconciliation with MailerLite, triggered on demand — never a
 * silent cron. The result only ever reports counts, never which e-mails
 * moved.
 */
export function MailerliteSyncButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<TagSyncResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    if (
      !confirm(
        "Zsynchronizować tagi z MailerLite? To doda i usunie osoby z grup w MailerLite zgodnie z aktualnym stanem tagów."
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/tags/sync", { method: "POST" });
      if (!res.ok) throw new Error("request failed");
      const data: TagSyncResponse = await res.json();
      setResult(data);
      router.refresh();
    } catch {
      setError("Synchronizacja nie powiodła się.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button onClick={handleSync} disabled={busy}>
        {busy ? "Synchronizuję…" : "Synchronizuj z MailerLite"}
      </Button>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {result && (
        <div className="flex gap-2 flex-wrap justify-end" role="status">
          <Badge variant="secondary">Dodano: {result.added}</Badge>
          <Badge variant="outline">Usunięto: {result.removed}</Badge>
          <Badge variant="outline">
            Bez subskrypcji: {result.skippedNoSubscription}
          </Badge>
          {result.failures > 0 && (
            <Badge variant="destructive">Błędy: {result.failures}</Badge>
          )}
        </div>
      )}
    </div>
  );
}
