"use client";

import { useState, useEffect } from "react";
import { getLocalBackup, clearLocalBackup } from "@/lib/local-storage";

interface SyncRecoveryResult {
  hasLocalBackup: boolean;
  localContent: string | null;
  localTimestamp: number | null;
  acceptLocal: () => void;
  dismissLocal: () => void;
}

export function useSyncRecovery(
  exerciseId: string,
  questionIndex: number,
  serverUpdatedAt: string | null
): SyncRecoveryResult {
  const [localContent, setLocalContent] = useState<string | null>(null);
  const [localTimestamp, setLocalTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const backup = getLocalBackup(exerciseId, questionIndex);
    if (!backup) return;

    // Compare timestamps — prefer local if newer than server
    if (serverUpdatedAt) {
      const serverTime = new Date(serverUpdatedAt).getTime();
      if (backup.timestamp > serverTime) {
        setLocalContent(backup.content);
        setLocalTimestamp(backup.timestamp);
      } else {
        // Server is newer, clear stale local backup
        clearLocalBackup(exerciseId, questionIndex);
      }
    } else {
      // No server data, use local
      setLocalContent(backup.content);
      setLocalTimestamp(backup.timestamp);
    }
  }, [exerciseId, questionIndex, serverUpdatedAt]);

  const acceptLocal = () => {
    // Content will be picked up by the editor's initial value
    clearLocalBackup(exerciseId, questionIndex);
    setLocalContent(null);
    setLocalTimestamp(null);
  };

  const dismissLocal = () => {
    clearLocalBackup(exerciseId, questionIndex);
    setLocalContent(null);
    setLocalTimestamp(null);
  };

  return {
    hasLocalBackup: localContent !== null,
    localContent,
    localTimestamp,
    acceptLocal,
    dismissLocal,
  };
}
