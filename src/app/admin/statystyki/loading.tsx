function TileSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#e2e7eb] p-5 h-[92px] animate-pulse">
      <div className="h-3 w-20 bg-[#F1F4F6] rounded mb-3" />
      <div className="h-6 w-12 bg-[#F1F4F6] rounded" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-12">
      <div className="animate-pulse">
        <div className="h-7 w-40 bg-[#F1F4F6] rounded mb-2" />
        <div className="h-4 w-72 bg-[#F1F4F6] rounded" />
      </div>

      <div className="h-10 w-full max-w-md bg-[#F1F4F6] rounded-lg animate-pulse" />

      {[0, 1, 2].map((section) => (
        <div key={section} className="space-y-4">
          <div className="h-5 w-24 bg-[#F1F4F6] rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TileSkeleton />
            <TileSkeleton />
            <TileSkeleton />
            <TileSkeleton />
          </div>
          <div className="h-40 bg-white rounded-xl border border-[#e2e7eb] animate-pulse" />
        </div>
      ))}
    </div>
  );
}
