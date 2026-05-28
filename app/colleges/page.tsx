'use client';

import { useState, useMemo } from 'react';
import { Layout, List } from 'lucide-react';
import { useColleges } from '@/hooks/useColleges';
import { usePagination } from '@/hooks/usePagination';
import { useFiltersStore } from '@/store/filters';
import { SearchBar } from '@/components/SearchBar';
import { SidebarFilters } from '@/components/SidebarFilters';
import { CollegeCard } from '@/components/CollegeCard';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function CollegesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { colleges, isLoading, totalCount } = useColleges();
  const { setSortBy, sortBy } = useFiltersStore();

  const pagination = usePagination({
    initialPage: 1,
    pageSize: 12,
    totalItems: totalCount,
  });

  const displayedColleges = useMemo(() => {
    return colleges.slice(pagination.startIndex, pagination.endIndex);
  }, [colleges, pagination.startIndex, pagination.endIndex]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Explore Colleges</h1>
          <p className="text-slate-600">
            {totalCount === 0
              ? 'No colleges found. Try adjusting your filters.'
              : `Showing ${pagination.startIndex + 1}–${Math.min(
                  pagination.endIndex,
                  totalCount
                )} of ${totalCount} colleges`}
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <SidebarFilters />

              {/* Sort Options */}
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: 'rating', label: 'Rating (High to Low)' },
                    { value: 'fees-low', label: 'Fees (Low to High)' },
                    { value: 'fees-high', label: 'Fees (High to Low)' },
                    { value: 'placement', label: 'Placement Package' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={(e) =>
                          setSortBy(
                            e.target.value as
                              | 'rating'
                              | 'fees-low'
                              | 'fees-high'
                              | 'placement'
                          )
                        }
                        className="rounded"
                      />
                      <span className="text-sm text-slate-600">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar />
            </div>

            {/* View Toggle and Results */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  aria-label="Grid view"
                >
                  <Layout className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              <span className="text-sm text-slate-600">{totalCount} colleges found</span>
            </div>

            {/* Colleges Grid/List */}
            {isLoading ? (
              <SkeletonLoader count={12} variant="card" />
            ) : displayedColleges.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No Colleges Found"
                description="Try adjusting your search filters to find colleges that match your criteria."
              />
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                      : 'space-y-4'
                  }
                >
                  {displayedColleges.map((college) => (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      variant={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={pagination.goToPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
