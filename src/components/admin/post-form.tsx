"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidePreview } from "./slide-preview";
import { ColorPicker } from "./color-picker";
import type { ContentSection } from "@/lib/content-sections";

interface PostFormData {
  topicTag: string;
  headline: string;
  subtitle: string;
  iconType: string;
  contentTag: string;
  contentBody: string;
  sectionNumber: string;
  contentSlides: ContentSection[];
  quote: string;
  quoteAttribution: string;
  quoteIconType: string;
  ctaText: string;
  hashtags: string;
  handleBio: string;
  caption: string;
  colorPalette: string;
  logoVariant: string;
  locale: string;
}

interface SlideData {
  id: number;
  filename: string;
  slideNumber: number;
}

interface PostFormProps {
  mode: "create" | "edit";
  postId?: number;
  initialData?: PostFormData;
  initialSlides?: SlideData[];
  initialStatus?: string;
}

const DEFAULTS: PostFormData = {
  topicTag: "",
  headline: "",
  subtitle: "Swipe to learn why",
  iconType: "clock",
  contentTag: "Why it works",
  contentBody: "",
  sectionNumber: "01",
  contentSlides: [{ tag: "Why it works", body: "", sectionNumber: "01" }],
  quote: "",
  quoteAttribution: "",
  quoteIconType: "sun",
  ctaText: "Follow for {more} psychology life hacks",
  hashtags: "",
  handleBio: "psychology \u00B7 life hacks \u00B7 mental health",
  caption: "",
  colorPalette: "sage",
  logoVariant: "light",
  locale: "en",
};

const ICON_OPTIONS = [
  { value: "clock", label: "Clock" },
  { value: "sun", label: "Sun" },
  { value: "brain", label: "Brain" },
  { value: "heart", label: "Heart" },
  { value: "leaf", label: "Leaf" },
  { value: "none", label: "None" },
];

function FieldGroup({ label, children, hint }: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#4A5B6A] tracking-wider uppercase mb-1.5">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-[#8A99A8] mt-1">{hint}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 bg-[#FAFBFC] border border-[#F1F4F6] rounded-xl text-sm text-[#1E2A36] placeholder:text-[#b5bfc9] focus:outline-none focus:border-[#7B9E8C] focus:ring-1 focus:ring-[#7B9E8C]/30 transition";
const selectClass =
  "w-full px-4 py-3 bg-[#FAFBFC] border border-[#F1F4F6] rounded-xl text-sm text-[#1E2A36] focus:outline-none focus:border-[#7B9E8C] focus:ring-1 focus:ring-[#7B9E8C]/30 transition appearance-none";
const textareaClass =
  "w-full px-4 py-3 bg-[#FAFBFC] border border-[#F1F4F6] rounded-xl text-sm text-[#1E2A36] placeholder:text-[#b5bfc9] focus:outline-none focus:border-[#7B9E8C] focus:ring-1 focus:ring-[#7B9E8C]/30 transition resize-y";

export function PostForm({
  mode,
  postId,
  initialData,
  initialSlides,
  initialStatus,
}: PostFormProps) {
  const router = useRouter();
  const [data, setData] = useState<PostFormData>({
    ...DEFAULTS,
    ...initialData,
  });
  const [activeSlide, setActiveSlide] = useState(0);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<SlideData[]>(initialSlides || []);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(initialStatus || "draft");

  function update(field: keyof PostFormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function updateSection(index: number, field: keyof ContentSection, value: string) {
    setData((prev) => {
      const slides = [...prev.contentSlides];
      slides[index] = { ...slides[index], [field]: value };
      return { ...prev, contentSlides: slides };
    });
  }

  function addSection() {
    setData((prev) => ({
      ...prev,
      contentSlides: [
        ...prev.contentSlides,
        {
          tag: "Why it works",
          body: "",
          sectionNumber: String(prev.contentSlides.length + 1).padStart(2, "0"),
        },
      ],
    }));
  }

  function removeSection(index: number) {
    setData((prev) => ({
      ...prev,
      contentSlides: prev.contentSlides.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      const url = mode === "create" ? "/api/posts" : `/api/posts/${postId}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          contentSlides: JSON.stringify(data.contentSlides),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      const result = await res.json();
      if (mode === "create") {
        router.push(`/admin/posts/${result.post.id}/edit`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    if (!postId) return;
    setError(null);
    setGenerating(true);
    try {
      const res = await fetch(`/api/posts/${postId}/generate`, {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }
      const result = await res.json();
      setGeneratedSlides(result.slides);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handlePublish() {
    if (!postId) return;
    setError(null);
    setPublishing(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      if (!res.ok) throw new Error("Failed to publish");
      setStatus("published");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish");
    } finally {
      setPublishing(false);
    }
  }

  async function handleUnpublish() {
    if (!postId) return;
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "draft" }),
      });
      if (!res.ok) throw new Error("Failed to unpublish");
      setStatus("draft");
      router.refresh();
    } catch {
      setError("Failed to unpublish");
    }
  }

  async function handleDelete() {
    if (!postId || !confirm("Delete this post and all its slides?")) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin");
    } catch {
      setError("Failed to delete");
    }
  }

  return (
    <div className="flex gap-8 items-start">
      {/* Left: Form */}
      <div className="flex-1 min-w-0 space-y-8">
        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Section: Slide 1 - Title */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#1E2A36] tracking-wider uppercase mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#e8f0eb] text-[#7B9E8C] text-xs font-bold flex items-center justify-center">
              1
            </span>
            Title Slide
          </h2>
          <div className="space-y-4">
            <FieldGroup label="Topic Tag" hint='e.g. "Psychology Life Hack"'>
              <input
                className={inputClass}
                value={data.topicTag}
                onChange={(e) => update("topicTag", e.target.value)}
                placeholder="Psychology Life Hack"
              />
            </FieldGroup>
            <FieldGroup label="Headline" hint="Use {curly braces} for accent color">
              <input
                className={inputClass}
                value={data.headline}
                onChange={(e) => update("headline", e.target.value)}
                placeholder="Keep a {Consistent} Wake-Up Time"
              />
            </FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Subtitle">
                <input
                  className={inputClass}
                  value={data.subtitle}
                  onChange={(e) => update("subtitle", e.target.value)}
                  placeholder="Swipe to learn why"
                />
              </FieldGroup>
              <FieldGroup label="Icon">
                <select
                  className={selectClass}
                  value={data.iconType}
                  onChange={(e) => update("iconType", e.target.value)}
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FieldGroup>
            </div>
          </div>
        </section>

        {/* Section: Content Slides (repeater) */}
        {data.contentSlides.map((section, idx) => (
          <section key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#1E2A36] tracking-wider uppercase mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E2A36] text-white text-xs font-bold flex items-center justify-center">
                {idx + 2}
              </span>
              Content Slide {data.contentSlides.length > 1 ? `${idx + 1}/${data.contentSlides.length}` : ""}
              {data.contentSlides.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(idx)}
                  className="ml-auto text-xs text-red-400 hover:text-red-600 font-medium transition"
                >
                  Remove
                </button>
              )}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Content Tag">
                  <input
                    className={inputClass}
                    value={section.tag}
                    onChange={(e) => updateSection(idx, "tag", e.target.value)}
                    placeholder="Why it works"
                  />
                </FieldGroup>
                <FieldGroup label="Section Number">
                  <input
                    className={inputClass}
                    value={section.sectionNumber}
                    onChange={(e) => updateSection(idx, "sectionNumber", e.target.value)}
                    placeholder="01"
                  />
                </FieldGroup>
              </div>
              <FieldGroup
                label="Content Body"
                hint="Use {curly braces} for highlights. Double newline for paragraphs. ~40-60 words per section."
              >
                <textarea
                  className={textareaClass}
                  rows={5}
                  value={section.body}
                  onChange={(e) => updateSection(idx, "body", e.target.value)}
                  placeholder="Your body goes {the same time} each day, it {anchors} your internal clock..."
                />
              </FieldGroup>
            </div>
          </section>
        ))}
        <button
          type="button"
          onClick={addSection}
          className="w-full py-3 border-2 border-dashed border-[#d1d8de] rounded-2xl text-sm font-semibold text-[#8A99A8] hover:border-[#7B9E8C] hover:text-[#7B9E8C] transition tracking-wider uppercase"
        >
          + Add Content Section
        </button>

        {/* Section: Slide 3 - Quote */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#1E2A36] tracking-wider uppercase mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F1F4F6] text-[#4A5B6A] text-xs font-bold flex items-center justify-center">
              3
            </span>
            Quote Slide
          </h2>
          <div className="space-y-4">
            <FieldGroup
              label="Quote"
              hint="Use {curly braces} for accent color"
            >
              <textarea
                className={textareaClass}
                rows={3}
                value={data.quote}
                onChange={(e) => update("quote", e.target.value)}
                placeholder='A good day {begins} the night before'
              />
            </FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Attribution">
                <input
                  className={inputClass}
                  value={data.quoteAttribution}
                  onChange={(e) => update("quoteAttribution", e.target.value)}
                  placeholder="&mdash; Your daily routine"
                />
              </FieldGroup>
              <FieldGroup label="Quote Icon">
                <select
                  className={selectClass}
                  value={data.quoteIconType}
                  onChange={(e) => update("quoteIconType", e.target.value)}
                >
                  {ICON_OPTIONS.filter((o) => o.value !== "none").map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FieldGroup>
            </div>
          </div>
        </section>

        {/* Section: Slide 4 - CTA */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#1E2A36] tracking-wider uppercase mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#e8f0eb] text-[#7B9E8C] text-xs font-bold flex items-center justify-center">
              4
            </span>
            CTA Slide
          </h2>
          <div className="space-y-4">
            <FieldGroup
              label="CTA Text"
              hint="Use {curly braces} for accent color"
            >
              <input
                className={inputClass}
                value={data.ctaText}
                onChange={(e) => update("ctaText", e.target.value)}
                placeholder="Follow for {more} psychology life hacks"
              />
            </FieldGroup>
            <FieldGroup
              label="Hashtags"
              hint="Comma or space separated. e.g. #psychology, #lifehacks"
            >
              <input
                className={inputClass}
                value={data.hashtags}
                onChange={(e) => update("hashtags", e.target.value)}
                placeholder="#psychology #lifehacks #mentalhealth #wellness"
              />
            </FieldGroup>
            <FieldGroup label="Handle Bio">
              <input
                className={inputClass}
                value={data.handleBio}
                onChange={(e) => update("handleBio", e.target.value)}
                placeholder="psychology &middot; life hacks &middot; mental health"
              />
            </FieldGroup>
          </div>
        </section>

        {/* Section: Design */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#1E2A36] tracking-wider uppercase mb-5">
            Design
          </h2>
          <div className="space-y-4">
            <FieldGroup label="Color Palette">
              <ColorPicker
                value={data.colorPalette}
                onChange={(v) => update("colorPalette", v)}
              />
            </FieldGroup>
            <FieldGroup label="Logo Variant">
              <div className="flex gap-3">
                {(["light", "dark"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => update("logoVariant", v)}
                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium capitalize transition ${
                      data.logoVariant === v
                        ? "border-[#7B9E8C] bg-[#e8f0eb]/50 text-[#4A5B6A]"
                        : "border-[#F1F4F6] text-[#8A99A8] hover:border-[#d1d8de]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </FieldGroup>
            <FieldGroup label="Language">
              <div className="flex gap-3">
                {(["en", "pl"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => update("locale", v)}
                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium uppercase transition ${
                      data.locale === v
                        ? "border-[#7B9E8C] bg-[#e8f0eb]/50 text-[#4A5B6A]"
                        : "border-[#F1F4F6] text-[#8A99A8] hover:border-[#d1d8de]"
                    }`}
                  >
                    {v === "en" ? "English" : "Polski"}
                  </button>
                ))}
              </div>
            </FieldGroup>
          </div>
        </section>

        {/* Section: Caption */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#1E2A36] tracking-wider uppercase mb-5">
            Instagram Caption
          </h2>
          <textarea
            className={textareaClass}
            rows={6}
            value={data.caption}
            onChange={(e) => update("caption", e.target.value)}
            placeholder="Write your Instagram caption here..."
          />
        </section>
      </div>

      {/* Right: Preview + Actions (sticky) */}
      <div className="w-[340px] shrink-0 sticky top-24 space-y-5">
        {/* Status badge */}
        {mode === "edit" && (
          <div className="flex items-center justify-between">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${
                status === "published"
                  ? "bg-[#e8f0eb] text-[#7B9E8C]"
                  : "bg-[#F1F4F6] text-[#8A99A8]"
              }`}
            >
              {status}
            </span>
            {postId && (
              <span className="text-xs text-[#8A99A8]">ID: {postId}</span>
            )}
          </div>
        )}

        {/* Live Preview */}
        <SlidePreview
          data={data}
          activeSlide={activeSlide}
          onSlideChange={setActiveSlide}
        />

        {/* Generated slides preview */}
        {generatedSlides.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#4A5B6A] tracking-wider uppercase mb-2">
              Generated PNGs
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {generatedSlides.map((s) => (
                <a
                  key={s.id}
                  href={`/api/slides/${s.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-[#F1F4F6] hover:border-[#7B9E8C] transition"
                >
                  <img
                    src={`/api/slides/${s.filename}`}
                    alt={`Slide ${s.slideNumber}`}
                    className="w-full aspect-[4/5] object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !data.topicTag || !data.headline}
            className="w-full py-3 bg-[#7B9E8C] text-white font-semibold text-sm rounded-xl hover:bg-[#6a8d7b] disabled:opacity-50 disabled:cursor-not-allowed transition tracking-wider uppercase"
          >
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create Post"
                : "Save Changes"}
          </button>

          {mode === "edit" && (
            <>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 bg-[#1E2A36] text-white font-semibold text-sm rounded-xl hover:bg-[#2a3d4d] disabled:opacity-50 disabled:cursor-not-allowed transition tracking-wider uppercase"
              >
                {generating ? "Generating..." : "Generate Slides"}
              </button>

              {status === "draft" ? (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishing || generatedSlides.length === 0}
                  className="w-full py-3 bg-[#e8f0eb] text-[#7B9E8C] font-semibold text-sm rounded-xl hover:bg-[#d8e8dd] disabled:opacity-50 disabled:cursor-not-allowed transition tracking-wider uppercase"
                >
                  {publishing ? "Publishing..." : "Publish"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleUnpublish}
                  className="w-full py-3 bg-[#F1F4F6] text-[#8A99A8] font-semibold text-sm rounded-xl hover:bg-[#e4e9ed] transition tracking-wider uppercase"
                >
                  Unpublish
                </button>
              )}

              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-2.5 text-red-400 text-sm font-medium hover:text-red-600 transition"
              >
                Delete Post
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
