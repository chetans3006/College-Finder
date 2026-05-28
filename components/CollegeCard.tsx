'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, IndianRupee, TrendingUp } from 'lucide-react';
import { College } from '@/types';
import { RatingBadge } from './RatingBadge';
import { Button } from '@/components/ui/button';
import { useFavoritesStore } from '@/store/favorites';
import { useCompareStore } from '@/store/compare';
import { cn } from '@/lib/utils';

interface CollegeCardProps {
  college: College;
  variant?: 'grid' | 'list';
}

export function CollegeCard({ college, variant = 'grid' }: CollegeCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { isInCompare, addToCompare, removeFromCompare, canAddMore } =
    useCompareStore();

  const favorite = isFavorite(college.id);
  const inCompare = isInCompare(college.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFavorite(college.id);
    } else {
      addFavorite(college.id);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(college.id);
    } else if (canAddMore()) {
      addToCompare({
        id: college.id,
        name: college.name,
        rating: college.rating,
        avgPackage: college.placements.avgPackage,
        fees: college.fees,
        placementRate: college.placements.placementRate,
        location: college.location,
      });
    }
  };

  if (variant === 'list') {
    return (
      <Link href={`/college/${college.id}`}>
        <div className="flex gap-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-md">
          <div className="relative h-24 w-32 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={college.image}
              alt={college.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{college.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4" />
              {college.location}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <RatingBadge rating={college.rating} reviewCount={college.reviews} />
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-slate-600" />
                <span className="text-sm">{college.placements.avgPackage}L avg</span>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4 text-slate-600" />
                <span className="text-sm">₹{(college.fees / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleFavorite}
              className="rounded-md border border-slate-200 p-2 hover:bg-slate-50"
              aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
            >
              <Heart
                className={cn('h-5 w-5', {
                  'fill-red-500 text-red-500': favorite,
                  'text-slate-400': !favorite,
                })}
              />
            </button>
            <button
              onClick={handleCompare}
              disabled={!inCompare && !canAddMore()}
              className={cn(
                'rounded-md border border-slate-200 px-3 py-2 text-xs font-medium transition-colors',
                {
                  'border-blue-600 bg-blue-50 text-blue-600': inCompare,
                  'hover:bg-slate-50': !inCompare,
                  'opacity-50 cursor-not-allowed': !inCompare && !canAddMore(),
                }
              )}
            >
              {inCompare ? '✓ Compare' : 'Compare'}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/college/${college.id}`}>
      <div className="group rounded-lg border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-lg">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-slate-100">
          <Image
            src={college.image}
            alt={college.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <button
            onClick={handleFavorite}
            className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110"
            aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Heart
              className={cn('h-5 w-5', {
                'fill-red-500 text-red-500': favorite,
                'text-slate-400': !favorite,
              })}
            />
          </button>
        </div>

        <div className="p-4">
          <h3 className="line-clamp-2 font-semibold text-slate-900">{college.name}</h3>

          <div className="mt-2 flex items-center gap-1 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            {college.location}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <RatingBadge rating={college.rating} reviewCount={college.reviews} size="sm" />
            <div className="flex items-center gap-1 text-sm font-semibold text-slate-900">
              <TrendingUp className="h-4 w-4" />
              {college.placements.avgPackage}L
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1 text-sm text-slate-600">
            <IndianRupee className="h-4 w-4" />
            ₹{(college.fees / 100000).toFixed(1)}L
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleCompare}
              disabled={!inCompare && !canAddMore()}
              variant={inCompare ? 'default' : 'outline'}
              size="sm"
              className="flex-1 text-xs"
            >
              {inCompare ? '✓ Compare' : 'Compare'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
