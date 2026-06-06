import { GoogleGenerativeAI } from '@google/generative-ai'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { chatInteractions } from '@/lib/db/schema'
import { auth } from '@/lib/auth'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = body.messages || []

    if (!messages || messages.length === 0) {
      return new Response('No messages provided', { status: 400 })
    }

    // Get user session (optional - for logging interactions)
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    console.log('[v0] API Key available:', !!apiKey)
    console.log('[v0] API Key starts with:', apiKey?.substring(0, 10))
    console.log('[v0] Env vars available:', Object.keys(process.env).filter(k => k.includes('GOOGLE')))
    
    if (!apiKey) {
      console.error('[v0] GOOGLE_GENERATIVE_AI_API_KEY not found in process.env')
      return new Response(
        JSON.stringify({ error: 'Google API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const client = new GoogleGenerativeAI({ apiKey })
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

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

    // Convert messages to Gemini format
    const conversationHistory = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [
        {
          text:
            msg.parts
              ?.filter((p: any) => p.type === 'text')
              .map((p: any) => p.text)
              .join('') || msg.content || '',
        },
      ],
    }))

    // Get the latest user message
    const latestUserMessage =
      messages[messages.length - 1]?.parts
        ?.filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('') || messages[messages.length - 1]?.content || ''

    // Stream the response
    const encoder = new TextEncoder()
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          const stream = await model.generateContentStream({
            contents: conversationHistory,
            systemInstruction: systemPrompt,
          })

          let fullResponse = ''

          for await (const chunk of stream.stream) {
            const text = chunk.text()
            fullResponse += text

            // Send as SSE-like format for compatibility with useChat
            const sseMessage = `data: ${JSON.stringify({
              type: 'text-delta',
              delta: text,
            })}\n\n`

            controller.enqueue(encoder.encode(sseMessage))
          }

          // Log interaction if user authenticated
          if (userId && latestUserMessage && fullResponse) {
            try {
              await db.insert(chatInteractions).values({
                id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                message: latestUserMessage,
                response: fullResponse,
                context: JSON.parse(JSON.stringify({ timestamp: new Date() })),
              })
            } catch (dbError) {
              console.error('[v0] Error logging chat interaction:', dbError)
            }
          }

          // Send completion message
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
          controller.close()
        } catch (error) {
          console.error('[v0] Streaming error:', error)
          const errorMessage = error instanceof Error ? error.message : String(error)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                error: errorMessage,
              })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[v0] Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request', details: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
