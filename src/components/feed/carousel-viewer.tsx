"use client";

import { useState, useRef, useCallback } from "react";

interface CarouselViewerProps {
  slides: { filename: string; slideNumber: number }[];
  alt: string;
  priority?: boolean;
}

const SWIPE_THRESHOLD = 40;

export function CarouselViewer({ slides, alt, priority }: CarouselViewerProps) {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(null);

  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(Math.max(0, Math.min(total - 1, index)));
    },
    [total]
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  function handlePointerDown(e: React.PointerEvent) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointerStart.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    setIsDragging(true);
    setDragOffset(0);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!pointerStart.current) return;
    if (e.pointerId !== pointerStart.current.id) return;
    const dx = e.clientX - pointerStart.current.x;
    setDragOffset(dx);
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!pointerStart.current) return;
    if (e.pointerId !== pointerStart.current.id) return;
    const dx = e.clientX - pointerStart.current.x;
    if (dx < -SWIPE_THRESHOLD) {
      next();
    } else if (dx > SWIPE_THRESHOLD) {
      prev();
    }
    pointerStart.current = null;
    setIsDragging(false);
    setDragOffset(0);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  }

  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#F1F4F6] select-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: "pan-y" }}
    >
      {/* Slides track */}
      <div
        className="absolute inset-0 flex h-full"
        style={{
          transform: `translateX(${-current * 100}%) translateX(${dragOffset}px)`,
          transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          willChange: "transform",
        }}
      >
        {slides.map((slide) => (
          <div key={slide.slideNumber} className="w-full h-full shrink-0">
            <img
              src={`/api/slides/${slide.filename}`}
              alt={`${alt} - Slide ${slide.slideNumber}`}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
              fetchPriority={priority && slide.slideNumber === slides[0]?.slideNumber ? "high" : undefined}
            />
          </div>
        ))}
      </div>

      {/* Left arrow */}
      {current > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition z-10"
          aria-label="Previous slide"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7L9 11" stroke="#1E2A36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {current < total - 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition z-10"
          aria-label="Next slide"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="#1E2A36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-6 h-2 bg-white shadow-sm"
                  : "w-2 h-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full z-10">
        {current + 1}/{total}
      </div>
    </div>
  );
}
