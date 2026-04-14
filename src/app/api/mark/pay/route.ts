import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { capturePayPalOrder } from "@/lib/paypal"
import { notifyAdmin } from "@/lib/email"

// GET /api/mark/pay?token=TOKEN — return booking info for deposit payment page
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 })

  const booking = await prisma.markBooking.findUnique({
    where: { depositPaymentToken: token },
    select: {
      id: true,
      bookingNumber: true,
      itemName: true,
      itemType: true,
      startDate: true,
      endDate: true,
      guests: true,
      totalPrice: true,
      depositAmount: true,
      balanceDue: true,
      depositPaid: true,
      customerName: true,
      workflowStatus: true,
    },
  })

  if (!booking) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 })
  }

  return NextResponse.json({
    bookingNumber: booking.bookingNumber,
    itemName: booking.itemName,
    itemType: booking.itemType,
    startDate: booking.startDate,
    endDate: booking.endDate,
    guests: booking.guests,
    totalPrice: booking.totalPrice,
    depositAmount: booking.depositAmount,
    balanceDue: booking.balanceDue,
    depositPaid: booking.depositPaid,
    customerName: booking.customerName,
  })
}

// POST /api/mark/pay — capture deposit payment
export async function POST(request: NextRequest) {
  try {
    const { token, orderId } = await request.json()

    if (!token || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const booking = await prisma.markBooking.findUnique({
      where: { depositPaymentToken: token },
    })

    if (!booking) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 })
    }

    if (booking.depositPaid) {
      return NextResponse.json({ error: "Deposit already paid" }, { status: 400 })
    }

    // Capture the PayPal order
    const captureResult = await capturePayPalOrder(orderId)
    const captureId = captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.id

    if (!captureId) {
      return NextResponse.json({ error: "Failed to capture payment" }, { status: 500 })
    }

    // Parse existing activity log
    let activityLog: any[] = []
    try { activityLog = JSON.parse(booking.activityLog || "[]") } catch {}
    activityLog.push({ action: "Deposit paid via PayPal", timestamp: new Date().toISOString() })

    // Update booking
    await prisma.markBooking.update({
      where: { id: booking.id },
      data: {
        depositPaid: true,
        depositPaidAt: new Date(),
        paypalOrderId: orderId,
        paypalCaptureId: captureId,
        workflowStatus: "deposit_paid",
        activityLog: JSON.stringify(activityLog),
      },
    })

    // Notify admin
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    await notifyAdmin(
      `Deposit Paid — ${booking.bookingNumber}`,
      `<h2>Deposit Payment Received</h2>
      <p><strong>Booking #:</strong> ${booking.bookingNumber}</p>
      <p><strong>Customer:</strong> ${booking.customerName} (${booking.customerEmail})</p>
      <p><strong>Item:</strong> ${booking.itemName}</p>
      <p><strong>Deposit Amount:</strong> $${booking.depositAmount.toLocaleString()}</p>
      <p><strong>Remaining Balance:</strong> $${booking.balanceDue.toLocaleString()}</p>
      <p>Please confirm availability with the property owner.</p>
      <p><a href="${baseUrl}/admin/mark-bookings/${booking.id}">View in Admin →</a></p>`
    ).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Mark deposit capture error:", error)
    return NextResponse.json({ error: error.message || "Failed to process payment" }, { status: 500 })
  }
}
