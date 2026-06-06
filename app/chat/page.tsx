import { Metadata } from 'next'
import ChatInterface from '@/components/chat-interface'

export const metadata: Metadata = {
  title: 'College Advisor Chat | College Finder',
  description:
    'Chat with our AI college advisor to find colleges that match your profile and interests.',
}

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-background p-4">
      <ChatInterface />
    </main>
  )
}
