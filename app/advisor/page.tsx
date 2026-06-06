import { Metadata } from 'next'
import ChatInterface from '@/components/chat-interface'
import LeadCaptureForm from '@/components/lead-capture-form'

export const metadata: Metadata = {
  title: 'College Advisor | College Finder',
  description:
    'Get personalized college recommendations from our AI advisor. Share your academic profile and find your perfect college match.',
}

export default function AdvisorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary/5 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your Perfect College
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powered by AI-driven guidance, discover colleges that match your academic achievements,
            interests, and goals.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface - Takes up 2 columns */}
          <div className="lg:col-span-2 h-[600px]">
            <ChatInterface />
          </div>

          {/* Lead Capture Form - Takes up 1 column */}
          <div className="lg:col-span-1">
            <LeadCaptureForm />
          </div>
        </div>
      </div>
    </main>
  )
}
