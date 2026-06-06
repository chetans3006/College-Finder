import Link from 'next/link'
import { ArrowRight, Sparkles, Brain, BarChart3, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">College Finder</h1>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/advisor">
              <Button size="sm" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border border-border bg-secondary/30 px-4 py-2 mb-6">
            <Brain className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm text-foreground">AI-Powered College Recommendations</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6 text-balance">
            Find Your Perfect College with <span className="text-primary">AI Guidance</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Get personalized college recommendations based on your academic profile, interests, and goals. Our AI advisor helps you discover colleges that match your unique needs.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center mb-12">
            <Link href="/advisor">
              <Button size="lg" className="gap-2">
                Talk to AI Advisor <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline">
                Quick Chat
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mt-16">
            <div className="rounded-lg border border-border p-6 bg-background/50 backdrop-blur">
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground mt-1">Colleges in Database</div>
            </div>
            <div className="rounded-lg border border-border p-6 bg-background/50 backdrop-blur">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground mt-1">AI-Powered Recommendations</div>
            </div>
            <div className="rounded-lg border border-border p-6 bg-background/50 backdrop-blur">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground mt-1">Instant Guidance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-secondary/10 border-y border-border">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose College Finder?</h2>
            <p className="text-muted-foreground">Everything you need to make the right college choice</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-border hover:border-primary transition-colors bg-background">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI-Powered Matching</h3>
              <p className="text-sm text-muted-foreground">
                Our advanced AI analyzes your profile to recommend colleges that align with your academic
                goals and preferences.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border hover:border-primary transition-colors bg-background">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Comprehensive Data</h3>
              <p className="text-sm text-muted-foreground">
                Access detailed information about colleges including rankings, admissions rates, tuition costs, and
                specializations.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border hover:border-primary transition-colors bg-background">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Lead Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage your college inquiries and track your application journey with our integrated platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground">Get personalized recommendations in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Share Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Tell us about your academic performance, interests, and college preferences through our intuitive form.
              </p>
            </div>

            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Chat with AI Advisor</h3>
              <p className="text-sm text-muted-foreground">
                Have a personalized conversation with our AI advisor to explore colleges and answer your questions.
              </p>
            </div>

            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Get Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Receive personalized college matches with detailed information to help you make your decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to find your perfect college?</h2>
          <p className="text-muted-foreground mb-8">
            Start your personalized college search journey today with our AI-powered advisor.
          </p>
          <Link href="/advisor">
            <Button size="lg" className="gap-2">
              Get Started Now <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
