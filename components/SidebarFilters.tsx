'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useFiltersStore } from '@/store/filters';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const STATES = [
  'Maharashtra',
  'Delhi',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Odisha',
  'Rajasthan',
  'Karnataka',
  'Telangana',
  'West Bengal',
  'Assam',
];

export function SidebarFilters() {
  const {
    location,
    feesRange,
    ratingRange,
    setLocation,
    setFeesRange,
    setRatingRange,
    resetFilters,
  } = useFiltersStore();

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    location: true,
    fees: true,
    rating: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleLocation = (state: string) => {
    if (location.includes(state)) {
      setLocation(location.filter((s) => s !== state));
    } else {
      setLocation([...location, state]);
    }
  };

  const hasActiveFilters = location.length > 0;

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={() => {
              resetFilters();
              setExpandedSections({
                location: true,
                fees: true,
                rating: true,
              });
            }}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            aria-label="Reset all filters"
          >
            <X className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Location Filter */}
      <div className="mb-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('location')}
          className="flex w-full items-center justify-between font-medium text-slate-900"
          aria-expanded={expandedSections.location}
        >
          Location
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              expandedSections.location ? 'rotate-180' : ''
            )}
          />
        </button>
        {expandedSections.location && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {STATES.map((state) => (
              <label
                key={state}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={location.includes(state)}
                  onCheckedChange={() => toggleLocation(state)}
                  id={`location-${state}`}
                />
                <span className="text-sm text-slate-600">{state}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Fees Range Filter */}
      <div className="mb-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection('fees')}
          className="flex w-full items-center justify-between font-medium text-slate-900"
          aria-expanded={expandedSections.fees}
        >
          Annual Fees
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              expandedSections.fees ? 'rotate-180' : ''
            )}
          />
        </button>
        {expandedSections.fees && (
          <div className="mt-3 space-y-2">
            <div className="text-sm text-slate-600">
              ₹{(feesRange[0] / 100000).toFixed(1)}L - ₹{(feesRange[1] / 100000).toFixed(1)}L
            </div>
            <input
              type="range"
              min="0"
              max="300000"
              step="10000"
              value={feesRange[0]}
              onChange={(e) => {
                const newMin = Number(e.target.value);
                if (newMin < feesRange[1]) {
                  setFeesRange([newMin, feesRange[1]]);
                }
              }}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="300000"
              step="10000"
              value={feesRange[1]}
              onChange={(e) => {
                const newMax = Number(e.target.value);
                if (newMax > feesRange[0]) {
                  setFeesRange([feesRange[0], newMax]);
                }
              }}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div>
        <button
          onClick={() => toggleSection('rating')}
          className="flex w-full items-center justify-between font-medium text-slate-900"
          aria-expanded={expandedSections.rating}
        >
          Minimum Rating
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              expandedSections.rating ? 'rotate-180' : ''
            )}
          />
        </button>
        {expandedSections.rating && (
          <div className="mt-3 space-y-2">
            <div className="text-sm text-slate-600">
              {ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)}
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={ratingRange[0]}
              onChange={(e) => {
                const newMin = Number(e.target.value);
                if (newMin < ratingRange[1]) {
                  setRatingRange([newMin, ratingRange[1]]);
                }
              }}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
