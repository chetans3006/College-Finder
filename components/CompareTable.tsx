'use client';

import { X } from 'lucide-react';
import { CompareCollege } from '@/types';
import { RatingBadge } from './RatingBadge';
import { Button } from '@/components/ui/button';
import { useCompareStore } from '@/store/compare';

interface CompareTableProps {
  colleges: CompareCollege[];
}

export function CompareTable({ colleges }: CompareTableProps) {
  const { removeFromCompare } = useCompareStore();

  const rows = [
    { label: 'Rating', key: 'rating', format: (v: number) => v.toFixed(1) },
    { label: 'Avg Package (L)', key: 'avgPackage', format: (v: number) => v.toFixed(1) },
    { label: 'Fees (per year)', key: 'fees', format: (v: number) => `₹${(v / 100000).toFixed(1)}L` },
    { label: 'Placement Rate (%)', key: 'placementRate', format: (v: number) => `${v}%` },
    { label: 'Location', key: 'location', format: (v: string) => v },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
              Criteria
            </th>
            {colleges.map((college) => (
              <th
                key={college.id}
                className="px-6 py-3 text-left text-sm font-semibold text-slate-900"
              >
                <div className="flex items-start justify-between">
                  <span>{college.name}</span>
                  <button
                    onClick={() => removeFromCompare(college.id)}
                    className="ml-2 rounded hover:bg-slate-200 p-1"
                    aria-label={`Remove ${college.name}`}
                  >
                    <X className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.label}</td>
              {colleges.map((college) => (
                <td key={college.id} className="px-6 py-4 text-sm text-slate-600">
                  {row.key === 'rating' ? (
                    <RatingBadge rating={college.rating} size="sm" />
                  ) : (
                    row.format(college[row.key as keyof Omit<CompareCollege, 'id' | 'name'>])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
