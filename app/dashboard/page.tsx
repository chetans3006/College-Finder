'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useFavoritesStore } from '@/store/favorites';
import collegesData from '@/data/colleges.json';
import { CollegeCard } from '@/components/CollegeCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen } from 'lucide-react';
import { College } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { favorites } = useFavoritesStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const favoriteColleges = (collegesData as College[]).filter((c) =>
    favorites.includes(c.id)
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">
              Welcome, {user?.name}!
            </h1>
            <p className="text-slate-600">Manage your saved colleges and preferences</p>
          </div>
          <Button
            onClick={() => logout()}
            variant="outline"
          >
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Saved Colleges</h3>
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{favorites.length}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Profile Complete</h3>
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">100%</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Account Status</h3>
              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                <span className="text-xs font-medium text-green-700">Active</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-4">You&apos;re all set!</p>
          </div>
        </div>

        {/* Saved Colleges Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Saved Colleges</h2>
            <p className="text-slate-600">
              {favoriteColleges.length === 0
                ? 'You haven&apos;t saved any colleges yet'
                : `You have saved ${favoriteColleges.length} college${
                    favoriteColleges.length !== 1 ? 's' : ''
                  }`}
            </p>
          </div>

          {favoriteColleges.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No Saved Colleges"
              description="Start exploring and save colleges you&apos;re interested in to view them here later."
              action={{
                label: 'Explore Colleges',
                onClick: () => router.push('/colleges'),
              }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteColleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/colleges" className="flex-1">
              <Button variant="outline" className="w-full">
                Explore More Colleges
              </Button>
            </Link>
            <Link href="/compare" className="flex-1">
              <Button variant="outline" className="w-full">
                View Comparisons
              </Button>
            </Link>
            <Link href="/colleges" className="flex-1">
              <Button variant="outline" className="w-full">
                Search Colleges
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
