import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm text-slate-600">Your gateway to premium engineering colleges</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl mb-6">
            Find Your Perfect <span className="text-blue-600">College</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Explore India&apos;s best engineering colleges. Compare placements, fees, ratings, and
            facilities. Make informed decisions with comprehensive data and reviews.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center mb-12">
            <Link href="/colleges">
              <Button size="lg" className="gap-2">
                Explore Colleges <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/colleges">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mt-16">
            <div className="rounded-lg border border-slate-200 p-6 bg-white">
              <div className="text-3xl font-bold text-slate-900">50+</div>
              <div className="text-sm text-slate-600 mt-1">Top Engineering Colleges</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-6 bg-white">
              <div className="text-3xl font-bold text-slate-900">100%</div>
              <div className="text-sm text-slate-600 mt-1">Verified Data</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-6 bg-white">
              <div className="text-3xl font-bold text-slate-900">5000+</div>
              <div className="text-sm text-slate-600 mt-1">Student Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose CollegeFinder?</h2>
            <p className="text-slate-600">Everything you need to make the right college choice</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Real Placements Data</h3>
              <p className="text-sm text-slate-600">
                Accurate placement records, average packages, and placement rates from verified sources.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Student Reviews</h3>
              <p className="text-sm text-slate-600">
                Read authentic reviews from current and alumni students. Get honest campus insights.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Easy Comparison</h3>
              <p className="text-sm text-slate-600">
                Compare up to 3 colleges side by side. Filter by location, fees, ratings, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center rounded-lg bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to find your dream college?
          </h2>
          <p className="text-slate-600 mb-8">
            Start exploring now and compare colleges based on your preferences.
          </p>
          <Link href="/colleges">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
