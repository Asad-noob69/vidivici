import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ session: null })
    }

    const userId = (session.user as any).id

    // Get the most recent chat session for this user, with all messages
    const chatSession = await prisma.chatSession.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json({ session: chatSession })
  } catch (error) {
    return NextResponse.json({ session: null })
  }
}
