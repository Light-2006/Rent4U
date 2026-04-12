export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-[#EDE0D0]" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/2 bg-[#EDE0D0] rounded-full" />
        <div className="h-4 w-4/5 bg-[#EDE0D0] rounded-full" />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-3 h-3 bg-[#EDE0D0] rounded-sm" />
          ))}
        </div>
        <div className="h-4 w-1/3 bg-[#EDE0D0] rounded-full" />
        <div className="h-9 w-full bg-[#F0E8DC] rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex gap-4 bg-white rounded-2xl overflow-hidden p-4 animate-pulse">
      <div className="w-24 h-32 bg-[#EDE0D0] rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3 py-2">
        <div className="h-3 w-1/3 bg-[#EDE0D0] rounded-full" />
        <div className="h-4 w-2/3 bg-[#EDE0D0] rounded-full" />
        <div className="h-3 w-1/2 bg-[#EDE0D0] rounded-full" />
        <div className="h-4 w-1/4 bg-[#EDE0D0] rounded-full" />
      </div>
    </div>
  );
}
