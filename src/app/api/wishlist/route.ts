import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')

    const includeClauses: any = {}
    if (type === 'car' || !type) {
      includeClauses.car = { include: { brand: true, images: { orderBy: { isPrimary: 'desc' }, take: 1 } } }
    }
    if (type === 'villa' || !type) {
      includeClauses.villa = { include: { images: { orderBy: { isPrimary: 'desc' }, take: 1 } } }
    }
    if (type === 'event' || !type) {
      includeClauses.event = { include: { images: { orderBy: { isPrimary: 'desc' }, take: 1 } } }
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: (session.user as any).id },
      include: includeClauses,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error('Wishlist GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { carId, villaId, eventId } = body
    const userId = (session.user as any).id

    // Handle Car
    if (carId) {
      const existing = await prisma.wishlist.findUnique({
        where: { userId_carId: { userId, carId } },
      })

      if (existing) {
        await prisma.wishlist.delete({ where: { id: existing.id } })
        return NextResponse.json({ wishlisted: false, type: 'car' })
      }

      await prisma.wishlist.create({ data: { userId, carId } })
      return NextResponse.json({ wishlisted: true, type: 'car' }, { status: 201 })
    }

    // Handle Villa
    if (villaId) {
      const existing = await prisma.wishlist.findUnique({
        where: { userId_villaId: { userId, villaId } },
      })

      if (existing) {
        await prisma.wishlist.delete({ where: { id: existing.id } })
        return NextResponse.json({ wishlisted: false, type: 'villa' })
      }

      await prisma.wishlist.create({ data: { userId, villaId } })
      return NextResponse.json({ wishlisted: true, type: 'villa' }, { status: 201 })
    }

    // Handle Event
    if (eventId) {
      const existing = await prisma.wishlist.findUnique({
        where: { userId_eventId: { userId, eventId } },
      })

      if (existing) {
        await prisma.wishlist.delete({ where: { id: existing.id } })
        return NextResponse.json({ wishlisted: false, type: 'event' })
      }

      await prisma.wishlist.create({ data: { userId, eventId } })
      return NextResponse.json({ wishlisted: true, type: 'event' }, { status: 201 })
    }

    return NextResponse.json({ error: 'carId, villaId, or eventId is required' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle wishlist' }, { status: 500 })
  }
}
