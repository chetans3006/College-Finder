import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  count?: number;
  variant?: 'card' | 'line';
}

export function SkeletonLoader({ count = 6, variant = 'card' }: SkeletonLoaderProps) {
  if (variant === 'line') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-200 bg-white p-4 animate-pulse"
        >
          <div className="h-48 w-full rounded-lg bg-slate-200" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-4 w-1/2 rounded bg-slate-200" />
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded bg-slate-200" />
              <div className="h-6 w-16 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
