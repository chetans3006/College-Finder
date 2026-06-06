import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { chatInteractions } from '@/lib/db/schema'
import { auth } from '@/lib/auth'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

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

  const result = streamText({
    model: 'openai/gpt-4-turbo',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: allMessages, isAborted }) => {
      if (isAborted || !userId) return

      // Log the interaction to database
      try {
        const userMessage = messages[messages.length - 1]
        const aiMessage = allMessages[allMessages.length - 1]

        if (userMessage && aiMessage) {
          // Extract text from UIMessage format
          const userText =
            userMessage.parts
              ?.filter((p: any) => p.type === 'text')
              .map((p: any) => p.text)
              .join('') || ''

          const aiText =
            aiMessage.parts
              ?.filter((p: any) => p.type === 'text')
              .map((p: any) => p.text)
              .join('') || ''

          await db.insert(chatInteractions).values({
            id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            message: userText,
            response: aiText,
            context: JSON.parse(JSON.stringify({ timestamp: new Date() })),
          })
        }
      } catch (error) {
        console.error('Error logging chat interaction:', error)
      }
    },
    consumeSseStream: consumeStream,
  })
}
