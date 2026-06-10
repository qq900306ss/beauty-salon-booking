export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded-2xl bg-gradient-to-r from-blush-50 via-cream-200 to-blush-50 bg-[length:200%_100%] ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-blush-100 bg-white/70 p-0 shadow-sm">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
