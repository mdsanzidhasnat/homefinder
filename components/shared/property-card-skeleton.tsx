export function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 skeleton w-3/4" />
        <div className="h-4 skeleton w-1/2" />
        <div className="flex gap-4">
          <div className="h-4 skeleton w-16" />
          <div className="h-4 skeleton w-16" />
          <div className="h-4 skeleton w-20" />
        </div>
        <div className="pt-2 border-t">
          <div className="h-6 skeleton w-24" />
        </div>
      </div>
    </div>
  );
}
