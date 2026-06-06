import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      email,
      name,
      phone,
      state,
      interests,
      gpa,
      satScore,
      actScore,
      collegePreferences,
    } = body

    if (!email || !name) {
      return Response.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Get user session
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id

    // Insert lead into database
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await db.insert(leads).values({
      id: leadId,
      userId: userId || null,
      email,
      name,
      phone: phone || null,
      state: state || null,
      interests: interests || [],
      gpa: gpa || null,
      satScore: satScore || null,
      actScore: actScore || null,
      collegePreferences: collegePreferences || null,
      status: 'new',
      zapierWebhookSent: false,
    })

    // Send to Zapier webhook if configured
    if (process.env.ZAPIER_WEBHOOK_URL) {
      try {
        await fetch(process.env.ZAPIER_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: leadId,
            email,
            name,
            phone,
            state,
            interests,
            gpa,
            satScore,
            actScore,
            collegePreferences,
            timestamp: new Date().toISOString(),
          }),
        })

        // Mark as sent
        await db
          .update(leads)
          .set({ zapierWebhookSent: true })
          .where((t: any) => t.id === leadId)
      } catch (webhookError) {
        console.error('Error sending to Zapier:', webhookError)
        // Continue even if webhook fails
      }
    }

    return Response.json(
      { success: true, leadId, message: 'Lead captured successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error capturing lead:', error)
    return Response.json(
      { error: 'Failed to capture lead' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get leads for this user
    const userLeads = await db
      .select()
      .from(leads)
      .where((t: any) => t.userId === session.user.id)

    return Response.json(userLeads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return Response.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
