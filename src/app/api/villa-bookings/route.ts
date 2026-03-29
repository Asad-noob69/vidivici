import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { villaId, checkIn, checkOut, guests, notes } = body

    if (!villaId || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const villa = await prisma.villa.findUnique({ where: { id: villaId } })
    if (!villa) return NextResponse.json({ error: "Villa not found" }, { status: 404 })

    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

    const nightsTotal = villa.pricePerNight * nights
    const subtotal = nightsTotal + villa.cleaningFee
    const tax = subtotal * 0.14
    const totalPrice = subtotal + tax + villa.securityDeposit

    const booking = await prisma.villaBooking.create({
      data: {
        userId: (session.user as any).id,
        villaId,
        checkIn: start,
        checkOut: end,
        guests: guests || 1,
        totalPrice,
        notes,
      },
      include: { villa: true },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create villa booking" }, { status: 500 })
  }
}
