'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2, MapPin, IndianRupee, TrendingUp, Users } from 'lucide-react';
import { useCollegeById } from '@/hooks/useCollegeById';
import { useFavoritesStore } from '@/store/favorites';
import { useCompareStore } from '@/store/compare';
import { RatingBadge } from '@/components/RatingBadge';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CollegeDetailPage({ params }: PageProps) {
  const { id } = React.use(params);
  const { college, isLoading, error } = useCollegeById(id);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { isInCompare, addToCompare, removeFromCompare, canAddMore } =
    useCompareStore();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'courses' | 'placements' | 'reviews'
  >('overview');

  const favorite = college ? isFavorite(college.id) : false;
  const inCompare = college ? isInCompare(college.id) : false;

  const handleFavorite = () => {
    if (!college) return;
    if (favorite) {
      removeFavorite(college.id);
    } else {
      addFavorite(college.id);
    }
  };

  const handleCompare = () => {
    if (!college) return;
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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/colleges" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="h-5 w-5" />
            Back to Colleges
          </Link>
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">College not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Back Button */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Colleges
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <SkeletonLoader count={1} variant="card" />
        </div>
      ) : college ? (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="rounded-lg overflow-hidden bg-white border border-slate-200 mb-8">
            <div className="relative h-96 w-full">
              <Image
                src={college.image}
                alt={college.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    {college.name}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <MapPin className="h-5 w-5" />
                    {college.location}
                  </div>
                  <p className="text-slate-600 leading-relaxed">{college.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={handleFavorite}
                    className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
                  >
                    <Heart
                      className={cn('h-6 w-6', {
                        'fill-red-500 text-red-500': favorite,
                        'text-slate-400': !favorite,
                      })}
                    />
                  </button>
                  <button
                    onClick={handleCompare}
                    disabled={!inCompare && !canAddMore()}
                    className={cn(
                      'p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                      { 'bg-blue-50 border-blue-600': inCompare }
                    )}
                    aria-label="Add to compare"
                  >
                    <TrendingUp
                      className={cn('h-6 w-6', {
                        'text-blue-600': inCompare,
                        'text-slate-400': !inCompare,
                      })}
                    />
                  </button>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-8 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {college.rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-600">Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {college.placements.avgPackage}L
                  </div>
                  <div className="text-sm text-slate-600">Avg Package</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    ₹{(college.fees / 100000).toFixed(1)}L
                  </div>
                  <div className="text-sm text-slate-600">Annual Fees</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {college.placements.placementRate}%
                  </div>
                  <div className="text-sm text-slate-600">Placement Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-lg border border-slate-200 bg-white">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'courses', label: 'Courses' },
                { id: 'placements', label: 'Placements' },
                { id: 'reviews', label: 'Reviews' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as
                        | 'overview'
                        | 'courses'
                        | 'placements'
                        | 'reviews'
                    )
                  }
                  className={cn(
                    'px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-0.5',
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">About</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {college.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        {college.placements.highestPackage}L
                      </div>
                      <div className="text-sm text-slate-600">Highest Package</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        {college.reviews}
                      </div>
                      <div className="text-sm text-slate-600">Student Reviews</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">
                        {college.courses.length}
                      </div>
                      <div className="text-sm text-slate-600">Courses Offered</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Courses Tab */}
              {activeTab === 'courses' && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Offered Courses
                  </h3>
                  <div className="space-y-3">
                    {college.courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {course.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            Duration: {course.duration} years
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placements Tab */}
              {activeTab === 'placements' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-sm text-slate-600 mb-1">Average Package</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {college.placements.avgPackage}L
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm text-slate-600 mb-1">
                        Highest Package
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {college.placements.highestPackage}L
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <p className="text-sm text-slate-600 mb-1">Placement Rate</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {college.placements.placementRate}%
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    This college has an excellent placement record with
                    {college.placements.placementRate}% students getting placed in top companies.
                  </p>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Student Reviews
                  </h3>
                  <div className="space-y-4">
                    {college.reviews_data.map((review, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-slate-900">
                            {review.author}
                          </p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map(
                              (_, i) => (
                                <span key={i} className="text-yellow-400">
                                  ★
                                </span>
                              )
                            )}
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

import React from 'react';
