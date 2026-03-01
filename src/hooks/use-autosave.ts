"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  saveToLocalStorage,
  clearLocalBackup,
} from "@/lib/local-storage";

export type SaveStatus = "idle" | "saving" | "saved" | "offline" | "error";

interface UseAutosaveOptions {
  exerciseId: string;
  questionIndex: number;
  content: string;
  wordCount: number;
  timeSpentSec: number;
  debounceMs?: number;
  intervalMs?: number;
}

export function useAutosave({
  exerciseId,
  questionIndex,
  content,
  wordCount,
  timeSpentSec,
  debounceMs = 5000,
  intervalMs = 30000,
}: UseAutosaveOptions) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const lastSavedContent = useRef(content);
  const contentRef = useRef(content);
  const wordCountRef = useRef(wordCount);
  const timeSpentRef = useRef(timeSpentSec);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSaving = useRef(false);

  contentRef.current = content;
  wordCountRef.current = wordCount;
  timeSpentRef.current = timeSpentSec;

  const save = useCallback(
    async (force = false) => {
      const currentContent = contentRef.current;
      if (
        !force &&
        currentContent === lastSavedContent.current
      ) {
        return;
      }
      if (isSaving.current) return;

      isSaving.current = true;
      setStatus("saving");

      let retries = 0;
      const maxRetries = 3;
      const backoffMs = [1000, 3000, 9000];

      while (retries < maxRetries) {
        try {
          const res = await fetch(
            `/api/program/responses/${exerciseId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                questionIndex,
                content: currentContent,
                wordCount: wordCountRef.current,
                timeSpentSec: timeSpentRef.current,
              }),
              signal: AbortSignal.timeout(30000),
            }
          );

          if (res.ok) {
            lastSavedContent.current = currentContent;
            clearLocalBackup(exerciseId, questionIndex);
            setStatus("saved");
            isSaving.current = false;
            return;
          }

          if (res.status === 429) {
            retries++;
            if (retries < maxRetries) {
              await new Promise((r) => setTimeout(r, backoffMs[retries]));
              continue;
            }
          }

          throw new Error(`Save failed: ${res.status}`);
        } catch {
          retries++;
          if (retries < maxRetries) {
            await new Promise((r) => setTimeout(r, backoffMs[retries]));
          }
        }
      }

      // All retries failed — save to localStorage as fallback
      saveToLocalStorage(exerciseId, questionIndex, currentContent);
      setStatus(navigator.onLine ? "error" : "offline");
      isSaving.current = false;
    },
    [exerciseId, questionIndex]
  );

  // Debounced save on content change
  useEffect(() => {
    if (content === lastSavedContent.current) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => save(), debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [content, debounceMs, save]);

  // Safety net interval
  useEffect(() => {
    intervalTimer.current = setInterval(() => save(), intervalMs);
    return () => {
      if (intervalTimer.current) {
        clearInterval(intervalTimer.current);
      }
    };
  }, [intervalMs, save]);

  // Save before unload and on visibility change
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (contentRef.current !== lastSavedContent.current) {
        saveToLocalStorage(exerciseId, questionIndex, contentRef.current);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        save();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [exerciseId, questionIndex, save]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      if (status === "offline") {
        save(true);
      }
    };

    const handleOffline = () => {
      setStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [status, save]);

  const forceSave = useCallback(() => save(true), [save]);

  return { status, forceSave };
}
