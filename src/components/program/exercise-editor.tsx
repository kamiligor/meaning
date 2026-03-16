"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { EditorToolbar } from "./editor-toolbar";
import { SaveStatusIndicator } from "./save-status";
import { useAutosave } from "@/hooks/use-autosave";
import { useRef, useState } from "react";

interface ExerciseEditorProps {
  exerciseId: string;
  questionIndex: number;
  initialContent: string;
  placeholder?: string;
  label: string;
}

export function ExerciseEditor({
  exerciseId,
  questionIndex,
  initialContent,
  placeholder = "Zacznij pisac...",
  label,
}: ExerciseEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const startTime = useRef(Date.now());

  const timeSpentSec = Math.floor((Date.now() - startTime.current) / 1000);

  const { status, forceSave } = useAutosave({
    exerciseId,
    questionIndex,
    content,
    wordCount,
    timeSpentSec,
  });

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
        placeholder,
      }),
      CharacterCount,
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
    },
  });

  return (
    <div className="border border-[#e2e7eb] rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#7B9E8C] focus-within:ring-offset-1 transition-shadow">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between px-3 py-2 border-t border-[#e2e7eb] bg-[#FAFBFC]">
        <span className="text-xs text-[#8A99A8]">
          {wordCount} {wordCount === 1 ? "slowo" : "slow"}
        </span>
        <div className="flex items-center gap-3">
          <SaveStatusIndicator status={status} />
          <button
            onClick={forceSave}
            className="text-xs text-[#8A99A8] hover:text-[#7B9E8C] transition-colors"
            type="button"
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
}
