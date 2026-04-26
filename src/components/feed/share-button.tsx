"use client";

import { useState, useRef, useEffect } from "react";
import { t, type Locale } from "@/lib/i18n";

interface ShareButtonProps {
  slug: string;
  title: string;
  locale: Locale;
  variant: "post" | "card";
}

export function ShareButton({ slug, title, locale, variant }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const d = t(locale);

  useEffect(() => {
    // navigator.share is browser-only; defer to after hydration to avoid SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function getUrl() {
    return `${window.location.origin}/post/${slug}`;
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url: getUrl() });
    } catch {
      // user cancelled
    }
    setOpen(false);
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(title + " " + getUrl())}`,
      "_blank",
      "width=600,height=400,noopener,noreferrer"
    );
    setOpen(false);
  }

  const shareOptions = [
    {
      label: copied ? d.shareCopied : d.shareCopyLink,
      onClick: handleCopyLink,
      icon: copied ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7B9E8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
    ...(hasNativeShare
      ? [
          {
            label: d.shareNative,
            onClick: handleNativeShare,
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            ),
          },
        ]
      : [
          {
            label: "WhatsApp",
            onClick: handleWhatsApp,
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            ),
          },
        ]),
  ];

  const iconBtn =
    "p-2 text-[#8A99A8] hover:text-[#7B9E8C] hover:bg-white/60 rounded-full transition-colors cursor-pointer";

  const closedClass =
    "p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-[#F1F4F6] text-[#8A99A8] hover:text-[#7B9E8C] hover:bg-white transition-colors cursor-pointer";

  const openClass =
    "flex items-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-[#F1F4F6] animate-slide-in-right";

  return (
    <div ref={ref}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className={closedClass}
          aria-label={d.share}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      ) : (
        <div className={openClass}>
          {shareOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={opt.onClick}
              className={`${iconBtn} first:ml-1`}
              title={opt.label}
            >
              {opt.icon}
            </button>
          ))}
          <button
            onClick={() => setOpen(false)}
            className={`${iconBtn} mr-0.5`}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
