import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check role from session or from DB as fallback
    const userId = (session.user as any).id
    const sessionRole = (session.user as any).role
    let isAdmin = sessionRole === 'ADMIN'

    if (!isAdmin && userId) {
      const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
      isAdmin = dbUser?.role === 'ADMIN'
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
        _count: { select: { bookings: true, wishlist: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
