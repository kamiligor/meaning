const STORAGE_KEY = "pisz_siebie_pending_sync";

interface PendingSync {
  exerciseId: string;
  questionIndex: number;
  content: string;
  timestamp: number;
}

function getPendingSyncs(): PendingSync[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePendingSyncs(syncs: PendingSync[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(syncs));
  } catch {
    // localStorage full or unavailable
  }
}

export function saveToLocalStorage(
  exerciseId: string,
  questionIndex: number,
  content: string
) {
  const syncs = getPendingSyncs();
  const idx = syncs.findIndex(
    (s) => s.exerciseId === exerciseId && s.questionIndex === questionIndex
  );
  const entry: PendingSync = {
    exerciseId,
    questionIndex,
    content,
    timestamp: Date.now(),
  };
  if (idx >= 0) {
    syncs[idx] = entry;
  } else {
    syncs.push(entry);
  }
  savePendingSyncs(syncs);
}

export function getLocalBackups(): PendingSync[] {
  return getPendingSyncs();
}

export function getLocalBackup(
  exerciseId: string,
  questionIndex: number
): PendingSync | null {
  const syncs = getPendingSyncs();
  return (
    syncs.find(
      (s) => s.exerciseId === exerciseId && s.questionIndex === questionIndex
    ) || null
  );
}

export function clearLocalBackup(
  exerciseId: string,
  questionIndex: number
) {
  const syncs = getPendingSyncs().filter(
    (s) =>
      !(s.exerciseId === exerciseId && s.questionIndex === questionIndex)
  );
  savePendingSyncs(syncs);
}

export function clearAllLocalBackups() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
