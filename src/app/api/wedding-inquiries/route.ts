import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, eventType, eventDate, guestCount, addOns, specialRequests } = body

    if (!firstName || !email || !eventType || !eventDate) {
      return NextResponse.json({ error: 'First name, email, event type and event date are required' }, { status: 400 })
    }

    const inquiry = await prisma.weddingInquiry.create({
      data: {
        firstName,
        lastName: lastName || null,
        email,
        phone: phone || null,
        eventType,
        eventDate: new Date(eventDate),
        guestCount: parseInt(guestCount) || 50,
        addOns: addOns || null,
        specialRequests: specialRequests || null,
      },
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
