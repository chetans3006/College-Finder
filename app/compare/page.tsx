'use client';

import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { useCompareStore } from '@/store/compare';
import { CompareTable } from '@/components/CompareTable';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

export default function ComparePage() {
  const { compareList, clearCompare } = useCompareStore();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Compare Colleges
            </h1>
            <p className="text-slate-600">
              Compare up to 3 colleges side by side
            </p>
          </div>
          <Link href="/colleges">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add More
            </Button>
          </Link>
        </div>

        {compareList.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="No Colleges to Compare"
            description="Start by adding colleges to compare. Visit the colleges page to select colleges you want to compare."
            action={{
              label: 'Explore Colleges',
              onClick: () => (window.location.href = '/colleges'),
            }}
          />
        ) : (
          <div className="space-y-6">
            {/* Comparison Table */}
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <CompareTable colleges={compareList} />
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Link href="/colleges">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Another College
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={clearCompare}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
