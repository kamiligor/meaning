"use client";

import type { Editor } from "@tiptap/react";
import { Bold, Italic, List } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface EditorToolbarProps {
  editor: Editor | null;
  locale: Locale;
}

export function EditorToolbar({ editor, locale }: EditorToolbarProps) {
  if (!editor) return null;

  const d = t(locale);

  const buttons = [
    {
      icon: Bold,
      label: d.editorBold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: Italic,
      label: d.editorItalic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: List,
      label: d.editorList,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
  ];

  return (
    <div
      className="flex items-center gap-1 border-b border-[#e2e7eb] px-2 py-1.5"
      role="toolbar"
      aria-label={d.editorToolbarLabel}
    >
      {buttons.map(({ icon: Icon, label, action, isActive }) => (
        <button
          key={label}
          onClick={action}
          className={`p-1.5 rounded hover:bg-[#F1F4F6] transition-colors ${
            isActive ? "bg-[#e8f0eb] text-[#7B9E8C]" : "text-[#4A5B6A]"
          }`}
          title={label}
          aria-label={label}
          aria-pressed={isActive}
          type="button"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
