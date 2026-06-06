import { streamText } from 'ai'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { chatInteractions } from '@/lib/db/schema'
import { auth } from '@/lib/auth'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    console.log('[v0] Chat API called')
    const body = await req.json()
    const messages = body.messages || []

    if (!messages || messages.length === 0) {
      console.log('[v0] No messages provided')
      return new Response('No messages provided', { status: 400 })
    }

    console.log('[v0] Received messages:', messages.length)

    // Get user session (optional - for logging interactions)
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id

    const systemPrompt = `You are an AI college advisor helping students find the perfect college. 
You provide personalized college recommendations based on student's:
- Academic performance (GPA, SAT/ACT scores)
- Geographic preferences
- Career interests and specializations
- College type preferences (public/private, large/small)
- Budget considerations

When making recommendations:
1. Ask clarifying questions about their preferences if not provided
2. Recommend colleges that match their criteria
3. Provide information about acceptance rates, costs, and specializations
4. Offer advice on college selection process

Be encouraging, informative, and personalized in your responses.`

    // Manually convert messages to model format
    const modelMessages = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content:
        msg.parts
          ?.filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('') || msg.content || '',
    }))

    console.log('[v0] Calling streamText with model: google/gemini-2.0-flash')
    const result = streamText({
      model: 'google/gemini-2.0-flash',
      system: systemPrompt,
      messages: modelMessages,
      maxTokens: 1024,
    })

    // Log interaction asynchronously without blocking the response
    if (userId) {
      result.then(async (message) => {
        try {
          const userMessage = messages[messages.length - 1]
          const userText =
            userMessage.parts
              ?.filter((p: any) => p.type === 'text')
              .map((p: any) => p.text)
              .join('') || userMessage.content || ''

          const aiText = message.text || ''

          if (userText && aiText) {
            await db.insert(chatInteractions).values({
              id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              userId,
              message: userText,
              response: aiText,
              context: JSON.parse(JSON.stringify({ timestamp: new Date() })),
            })
          }
        } catch (error) {
          console.error('[v0] Error logging chat interaction:', error)
        }
      }).catch((error) => {
        console.error('[v0] Error in chat completion:', error)
      })
    }

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[v0] Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[v0] Error details:', errorMessage)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request', details: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
