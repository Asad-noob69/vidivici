import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { authorizePayPalOrder } from "@/lib/paypal"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, bookingType, bookingData } = body

    if (!orderId || !bookingType || !bookingData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Authorize the PayPal order
    const { authorizationId } = await authorizePayPalOrder(orderId)

    if (!authorizationId) {
      return NextResponse.json({ error: "Failed to get authorization ID" }, { status: 500 })
    }

    let booking: any

    if (bookingType === "car") {
      const session = await auth()
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const car = await prisma.car.findUnique({ where: { id: bookingData.carId } })
      if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 })

      const start = new Date(bookingData.startDate)
      const end = new Date(bookingData.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

      if (days < car.minRentalDays) {
        return NextResponse.json({ error: `Minimum rental is ${car.minRentalDays} days` }, { status: 400 })
      }

      let discount = 0
      if (days >= 28) discount = 0.4
      else if (days >= 7) discount = 0.15
      const totalPrice = car.pricePerDay * days * (1 - discount)

      booking = await prisma.booking.create({
        data: {
          userId: (session.user as any).id,
          carId: bookingData.carId,
          startDate: start,
          endDate: end,
          pickupLocation: bookingData.pickupLocation || "",
          dropoffLocation: bookingData.dropoffLocation || bookingData.pickupLocation || "",
          deliveryType: bookingData.deliveryType || "pickup",
          isOneWay: bookingData.isOneWay || false,
          notes: bookingData.notes || null,
          totalPrice,
          paymentStatus: "AUTHORIZED",
          paypalOrderId: orderId,
          paypalAuthorizationId: authorizationId,
        },
        include: { car: { include: { brand: true } } },
      })
    } else if (bookingType === "villa") {
      const session = await auth()
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const villa = await prisma.villa.findUnique({ where: { id: bookingData.villaId } })
      if (!villa) return NextResponse.json({ error: "Villa not found" }, { status: 404 })

      const start = new Date(bookingData.checkIn)
      const end = new Date(bookingData.checkOut)
      const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

      const nightsTotal = villa.pricePerNight * nights
      const subtotal = nightsTotal + villa.cleaningFee
      const tax = subtotal * 0.14
      const totalPrice = subtotal + tax + villa.securityDeposit

      booking = await prisma.villaBooking.create({
        data: {
          userId: (session.user as any).id,
          villaId: bookingData.villaId,
          checkIn: start,
          checkOut: end,
          guests: bookingData.guests || 1,
          totalPrice,
          notes: bookingData.notes || null,
          paymentStatus: "AUTHORIZED",
          paypalOrderId: orderId,
          paypalAuthorizationId: authorizationId,
        },
        include: { villa: true },
      })
    } else if (bookingType === "event") {
      booking = await prisma.eventBooking.create({
        data: {
          eventId: bookingData.eventId || null,
          firstName: bookingData.firstName,
          lastName: bookingData.lastName || null,
          email: bookingData.email,
          phone: bookingData.phone || null,
          clubVenue: bookingData.clubVenue || null,
          bookingDate: new Date(bookingData.bookingDate),
          guestsTotal: bookingData.guestsTotal || null,
          budget: bookingData.budget || null,
          addOns: bookingData.addOns || null,
          specialRequests: bookingData.specialRequests || null,
          totalPrice: bookingData.totalPrice || 0,
          paymentStatus: "AUTHORIZED",
          paypalOrderId: orderId,
          paypalAuthorizationId: authorizationId,
        },
      })
    } else {
      return NextResponse.json({ error: "Invalid booking type" }, { status: 400 })
    }

    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 })
  } catch (error: any) {
    console.error("PayPal authorize error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to authorize payment" },
      { status: 500 }
    )
  }
}
