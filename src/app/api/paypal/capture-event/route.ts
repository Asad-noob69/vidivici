import { NextRequest, NextResponse } from "next/server"
import { capturePayPalOrder } from "@/lib/paypal"
import { prisma } from "@/lib/prisma"
import { notifyAdmin } from "@/lib/email"
import { verifyTurnstile } from "@/lib/turnstile"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, bookingData } = body

    if (!orderId || !bookingData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const valid = await verifyTurnstile(bookingData.turnstileToken)
    if (!valid) {
      return NextResponse.json({ error: "Bot verification failed" }, { status: 403 })
    }

    // Capture the order immediately (non-refundable $100)
    const captureResult = await capturePayPalOrder(orderId)
    const captureId = captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.id

    if (!captureId) {
      return NextResponse.json({ error: "Failed to capture payment" }, { status: 500 })
    }

    const booking = await prisma.eventBooking.create({
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
        totalPrice: 100,
        paymentStatus: "PAID",
        paypalOrderId: orderId,
        paypalAuthorizationId: captureId,
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    await notifyAdmin(
      `New Event Booking — $100 Fee Captured`,
      `<h2>New Event Booking Received</h2>
      <p><strong>Customer:</strong> ${bookingData.firstName} ${bookingData.lastName || ""}</p>
      <p><strong>Email:</strong> ${bookingData.email}</p>
      <p><strong>Phone:</strong> ${bookingData.phone || "N/A"}</p>
      <p><strong>Venue:</strong> ${bookingData.clubVenue || "N/A"}</p>
      <p><strong>Date:</strong> ${new Date(bookingData.bookingDate).toLocaleDateString()}</p>
      <p><strong>Guests:</strong> ${bookingData.guestsTotal || "N/A"}</p>
      <p><strong>Budget:</strong> ${bookingData.budget || "N/A"}</p>
      <p><strong>Booking Fee:</strong> $100.00 (Non-refundable, Captured)</p>
      <p><a href="${baseUrl}/admin/bookings/${booking.id}">View Booking in Admin</a></p>`
    ).catch(console.error)

    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 })
  } catch (error: any) {
    console.error("Event capture error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to process event booking" },
      { status: 500 }
    )
  }
}
