import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingBadgeProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingBadge({
  rating,
  reviewCount,
  size = 'md',
}: RatingBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const starSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4) return 'text-blue-600 bg-blue-50';
    if (rating >= 3.5) return 'text-amber-600 bg-amber-50';
    return 'text-slate-600 bg-slate-50';
  };

  return (
    <div className={cn('flex items-center gap-1 rounded-md px-2 py-1', getRatingColor(rating))}>
      <div className="flex items-center gap-0.5">
        <Star className={cn('fill-current', starSizes[size])} />
        <span className={cn('font-semibold', sizeClasses[size])}>{rating.toFixed(1)}</span>
      </div>
      {reviewCount && (
        <span className={cn('text-slate-600', sizeClasses[size])}>{reviewCount}</span>
      )}
    </div>
  );
}
