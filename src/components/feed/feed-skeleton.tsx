export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#F1F4F6] animate-pulse"
        >
          {/* Image placeholder */}
          <div className="aspect-[4/5] bg-[#F1F4F6]" />
          {/* Content placeholder */}
          <div className="p-5 space-y-3">
            <div className="h-3 w-32 bg-[#F1F4F6] rounded" />
            <div className="h-5 w-3/4 bg-[#F1F4F6] rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-[#F1F4F6] rounded" />
              <div className="h-3 w-2/3 bg-[#F1F4F6] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
