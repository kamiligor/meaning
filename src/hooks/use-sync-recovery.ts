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
  const [local, setLocal] = useState<{
    content: string | null;
    timestamp: number | null;
  }>({ content: null, timestamp: null });

  // localStorage is browser-only — must read after hydration to avoid SSR mismatch.
  // The single extra render is intentional and acceptable for showing recovery UI.
  useEffect(() => {
    const backup = getLocalBackup(exerciseId, questionIndex);
    if (!backup) return;

    if (serverUpdatedAt) {
      const serverTime = new Date(serverUpdatedAt).getTime();
      if (backup.timestamp > serverTime) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocal({ content: backup.content, timestamp: backup.timestamp });
      } else {
        clearLocalBackup(exerciseId, questionIndex);
      }
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocal({ content: backup.content, timestamp: backup.timestamp });
    }
  }, [exerciseId, questionIndex, serverUpdatedAt]);

  const acceptLocal = () => {
    clearLocalBackup(exerciseId, questionIndex);
    setLocal({ content: null, timestamp: null });
  };

  const dismissLocal = () => {
    clearLocalBackup(exerciseId, questionIndex);
    setLocal({ content: null, timestamp: null });
  };

  const localContent = local.content;
  const localTimestamp = local.timestamp;

  return {
    hasLocalBackup: localContent !== null,
    localContent,
    localTimestamp,
    acceptLocal,
    dismissLocal,
  };
}
