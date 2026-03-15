export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#F1F4F6] animate-pulse"
        >
          {/* Image placeholder with icon */}
          <div className="aspect-[4/5] bg-[#F1F4F6] flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-[#D5DCE3]">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 16l4.5-4.5a1.5 1.5 0 012.12 0L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 14l1.5-1.5a1.5 1.5 0 012.12 0L21 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Content placeholder */}
          <div className="p-5 space-y-3">
            <div className="h-3 w-24 bg-[#F1F4F6] rounded-full" />
            <div className="h-5 w-3/4 bg-[#F1F4F6] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
