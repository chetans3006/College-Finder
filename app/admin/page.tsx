'use client'

import { useEffect, useState } from 'react'
import { Loader2, TrendingUp, Users, MessageSquare, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AdminStats {
  totalLeads: number
  newLeads: number
  totalInteractions: number
  conversionRate: number
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalLeads: 0,
    newLeads: 0,
    totalInteractions: 0,
    conversionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/leads')

        if (response.status === 401) {
          router.push('/sign-in')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }

        const leads = await response.json()
        const newLeadsCount = leads.filter((l: any) => l.status === 'new').length
        const convertedCount = leads.filter((l: any) => l.status === 'converted').length

        setStats({
          totalLeads: leads.length,
          newLeads: newLeadsCount,
          totalInteractions: leads.length, // Placeholder for now
          conversionRate:
            leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your college finder platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Leads */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Leads</h3>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.totalLeads}</p>
            <p className="text-xs text-muted-foreground mt-2">All student inquiries</p>
          </div>

          {/* New Leads */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">New Leads</h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.newLeads}</p>
            <p className="text-xs text-muted-foreground mt-2">Awaiting follow-up</p>
          </div>

          {/* Chat Interactions */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Interactions</h3>
              <MessageSquare className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.totalInteractions}</p>
            <p className="text-xs text-muted-foreground mt-2">Chat conversations</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Conversion Rate</h3>
              <BarChart3 className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.conversionRate}%</p>
            <p className="text-xs text-muted-foreground mt-2">Lead to conversion</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Leads Management */}
          <Link
            href="/admin/leads"
            className="bg-background border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer"
          >
            <Users className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Manage Leads</h3>
            <p className="text-muted-foreground mb-4">
              View, filter, and manage all student leads with detailed profiles and interaction history.
            </p>
            <span className="text-primary font-medium text-sm">View All Leads →</span>
          </Link>

          {/* Settings */}
          <Link
            href="/admin/settings"
            className="bg-background border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer"
          >
            <MessageSquare className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">AI Settings</h3>
            <p className="text-muted-foreground mb-4">
              Configure AI advisor behavior, college database, and integration settings.
            </p>
            <span className="text-primary font-medium text-sm">Configure →</span>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-secondary/20 rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/leads?status=new"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Review New Leads
            </Link>
            <Link
              href="/chat"
              className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              Test AI Advisor
            </Link>
            <Link
              href="/advisor"
              className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              View Live Tool
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
