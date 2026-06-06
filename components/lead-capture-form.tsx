'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LeadCaptureForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    state: '',
    gpa: '',
    satScore: '',
    actScore: '',
    interests: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          interests: formData.interests
            .split(',')
            .map((i) => i.trim())
            .filter((i) => i),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      toast.success('Your information has been saved! An advisor will reach out soon.')
      setFormData({
        email: '',
        name: '',
        phone: '',
        state: '',
        gpa: '',
        satScore: '',
        actScore: '',
        interests: '',
      })
    } catch (error) {
      toast.error('Failed to save your information. Please try again.')
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background rounded-lg p-8 border border-border">
      <h2 className="text-2xl font-bold text-foreground">Get Personalized College Recommendations</h2>
      <p className="text-muted-foreground">
        Share your information and let our AI match you with the perfect colleges.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Preferred State
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          >
            <option value="">Select a state...</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
            <option value="IL">Illinois</option>
            <option value="PA">Pennsylvania</option>
            <option value="OH">Ohio</option>
            <option value="GA">Georgia</option>
            <option value="NC">North Carolina</option>
            <option value="MI">Michigan</option>
          </select>
        </div>

        {/* GPA */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            GPA (on 4.0 scale)
          </label>
          <input
            type="number"
            name="gpa"
            value={formData.gpa}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="4"
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="3.8"
          />
        </div>

        {/* SAT Score */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            SAT Score
          </label>
          <input
            type="number"
            name="satScore"
            value={formData.satScore}
            onChange={handleChange}
            min="400"
            max="1600"
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="1500"
          />
        </div>

        {/* ACT Score */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            ACT Score
          </label>
          <input
            type="number"
            name="actScore"
            value={formData.actScore}
            onChange={handleChange}
            min="1"
            max="36"
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="35"
          />
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Areas of Interest (comma-separated)
        </label>
        <textarea
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          placeholder="e.g., Computer Science, Engineering, Business, Biology"
          className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Submitting...' : 'Get Recommendations'}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        Your information will be used to provide personalized college recommendations and may be shared with colleges as part of our lead sharing program.
      </p>
    </form>
  )
}
