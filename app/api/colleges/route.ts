import { db } from '@/lib/db'
import { colleges } from '@/lib/db/schema'
import { ilike } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const state = searchParams.get('state')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

    let query = db.select().from(colleges)

    if (search) {
      query = query.where(ilike(colleges.name, `%${search}%`))
    }

    if (state) {
      query = query.where(ilike(colleges.state, `%${state}%`))
    }

    const results = await query.limit(limit)

    return Response.json(results)
  } catch (error) {
    console.error('Error searching colleges:', error)
    return Response.json(
      { error: 'Failed to search colleges' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Check if authorized (admin only - in production add proper auth)
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      state,
      location,
      type,
      tuition,
      acceptanceRate,
      satRange,
      actRange,
      specializations,
      description,
      website,
      ranking,
    } = body

    if (!name || !state) {
      return Response.json(
        { error: 'Name and state are required' },
        { status: 400 }
      )
    }

    const collegeId = `college_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await db.insert(colleges).values({
      id: collegeId,
      name,
      state,
      location: location || null,
      type: type || null,
      tuition: tuition || null,
      acceptanceRate: acceptanceRate || null,
      satRange: satRange || null,
      actRange: actRange || null,
      specializations: specializations || [],
      description: description || null,
      website: website || null,
      ranking: ranking || null,
    })

    return Response.json(
      { success: true, collegeId, message: 'College added successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding college:', error)
    return Response.json(
      { error: 'Failed to add college' },
      { status: 500 }
    )
  }
}
