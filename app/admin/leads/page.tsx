'use client'

import { useEffect, useState } from 'react'
import { Loader2, Mail, Phone, MapPin, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Lead {
  id: string
  email: string
  name: string
  phone?: string
  state?: string
  interests?: string[]
  gpa?: string
  satScore?: string
  actScore?: string
  status: string
  createdAt: string
}

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads')

        if (response.status === 401) {
          router.push('/sign-in')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch leads')
        }

        const data = await response.json()
        setLeads(data)
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [router])

  const filteredLeads =
    filterStatus === 'all'
      ? leads
      : leads.filter((lead) => lead.status === filterStatus)

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Student Leads</h1>
          <p className="text-muted-foreground">
            Manage and track student inquiries and college preferences
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {['all', 'new', 'contacted', 'converted'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors capitalize ${
                filterStatus === status
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {status} ({leads.filter((l) => status === 'all' || l.status === status).length})
            </button>
          ))}
        </div>

        {/* Leads Table */}
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Academic Info
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Interests
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-secondary/20 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {lead.state ? (
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            {lead.state}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          {lead.gpa && <div>GPA: {lead.gpa}</div>}
                          {lead.satScore && <div>SAT: {lead.satScore}</div>}
                          {lead.actScore && <div>ACT: {lead.actScore}</div>}
                          {!lead.gpa && !lead.satScore && !lead.actScore && (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {lead.interests && lead.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {lead.interests.slice(0, 2).map((interest, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                              >
                                {interest}
                              </span>
                            ))}
                            {lead.interests.length > 2 && (
                              <span className="text-muted-foreground text-xs">
                                +{lead.interests.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            lead.status === 'new'
                              ? 'bg-blue-100 text-blue-700'
                              : lead.status === 'contacted'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
