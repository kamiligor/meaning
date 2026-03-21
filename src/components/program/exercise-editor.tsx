"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { EditorToolbar } from "./editor-toolbar";
import { SaveStatusIndicator } from "./save-status";
import { useAutosave } from "@/hooks/use-autosave";
import { useRef, useState, useCallback, useEffect } from "react";
import { stripHtml } from "@/lib/html-utils";
import { calculateMaxChars } from "@/lib/exercise-validation";
import { getLocalBackup, clearLocalBackup } from "@/lib/local-storage";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface ExerciseEditorProps {
  exerciseId: string;
  questionIndex: number;
  initialContent: string;
  label: string;
  minChars?: number;
  onCharCountChange?: (count: number) => void;
  onRegisterFlush?: (questionIndex: number, flush: () => Promise<void>) => void;
  locale: Locale;
}

export function ExerciseEditor({
  exerciseId,
  questionIndex,
  initialContent,
  label,
  minChars,
  onCharCountChange,
  onRegisterFlush,
  locale,
}: ExerciseEditorProps) {
  const d = t(locale);
  const maxChars = calculateMaxChars(minChars ?? 0);

  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(() => stripHtml(initialContent).trim().length);
  const startTime = useRef(Date.now());
  const recoveryDone = useRef(false);

  const getTimeSpentSec = useCallback(
    () => Math.floor((Date.now() - startTime.current) / 1000),
    []
  );

  const { status, forceSave, flush } = useAutosave({
    exerciseId,
    questionIndex,
    content,
    wordCount,
    getTimeSpentSec,
  });

  // Register flush with parent so it can force-save before transitions
  useEffect(() => {
    onRegisterFlush?.(questionIndex, flush);
  }, [onRegisterFlush, questionIndex, flush]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        blockquote: false,
      }),
      Placeholder.configure({
        placeholder: d.editorPlaceholder,
      }),
      CharacterCount.configure({
        limit: maxChars,
      }),
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none px-4 py-3 min-h-[200px] focus:outline-none text-[#1E2A36] leading-[1.75]",
        "aria-label": label,
        role: "textbox",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const words = editor.storage.characterCount.words();
      setContent(html);
      setWordCount(words);
      const chars = stripHtml(html).trim().length;
      setCharCount(chars);
      onCharCountChange?.(chars);
    },
  });

  // Recover content from localStorage if server save was missed
  useEffect(() => {
    if (!editor || recoveryDone.current) return;
    recoveryDone.current = true;

    const backup = getLocalBackup(exerciseId, questionIndex);
    if (!backup || !backup.content) return;

    const serverChars = stripHtml(initialContent).trim().length;
    const backupChars = stripHtml(backup.content).trim().length;

    // Use backup if it has more content than server (save was missed)
    if (backupChars > serverChars) {
      editor.commands.setContent(backup.content);
      setContent(backup.content);
      setCharCount(backupChars);
      onCharCountChange?.(backupChars);
    } else {
      // Server is equal or has more — clear stale backup
      clearLocalBackup(exerciseId, questionIndex);
    }
  }, [editor, exerciseId, questionIndex, initialContent, onCharCountChange]);

  return (
    <div className="border border-[#e2e7eb] rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#7B9E8C] focus-within:ring-offset-1 transition-shadow">
      <EditorToolbar editor={editor} locale={locale} />
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between px-3 py-2 border-t border-[#e2e7eb] bg-[#FAFBFC]">
        <span className={`text-xs ${
          charCount >= maxChars ? "text-red-400" :
          minChars && charCount < minChars ? "text-amber-500" :
          "text-[#8A99A8]"
        }`}>
          {charCount} / {minChars ? `${minChars}–${maxChars}` : maxChars} {d.editorCharCount}
        </span>
        <div className="flex items-center gap-3">
          <SaveStatusIndicator status={status} locale={locale} />
          <button
            onClick={forceSave}
            className="text-xs text-[#8A99A8] hover:text-[#7B9E8C] transition-colors"
            type="button"
          >
            {d.editorSave}
          </button>
        </div>
      </div>
    </div>
  );
}
