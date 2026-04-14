import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

// POST /api/admin/mark-bookings/[id]/send-confirmation — send confirmation email with wire instructions
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const booking = await prisma.markBooking.findUnique({ where: { id } })
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.workflowStatus !== "owner_confirmed") {
      return NextResponse.json({ error: "Owner must confirm before sending confirmation" }, { status: 400 })
    }

    // Get wire transfer settings
    const settings = await prisma.siteSettings.findMany({
      where: {
        key: { in: ["wireBankName", "wireAccountNumber", "wireRoutingNumber", "wireSwiftCode", "wireBankAddress"] },
      },
    })
    const wireSettings: Record<string, string> = {}
    settings.forEach((s) => { wireSettings[s.key] = s.value })

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const uploadLink = `${baseUrl}/mark/upload-proof?token=${booking.wireProofToken}`

    const balanceDueDateStr = booking.balanceDueDate
      ? new Date(booking.balanceDueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "As soon as possible"

    // Send confirmation email to customer
    await sendEmail({
      to: booking.customerEmail,
      subject: `Booking Confirmed — ${booking.bookingNumber}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1a1a1a; padding: 24px; text-align: center;">
          <h1 style="color: #dbb241; margin: 0; font-size: 24px; letter-spacing: 2px;">VIDI VICI</h1>
          <p style="color: #999; margin: 4px 0 0; font-size: 12px;">HOSPITALITY GROUP</p>
        </div>

        <div style="padding: 32px 24px;">
          <h2 style="color: #1a1a1a; margin-top: 0;">Your Booking is Confirmed!</h2>
          <p>Dear ${booking.customerName},</p>
          <p>Great news! Your booking has been confirmed by the property owner. Here are your booking details:</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">Booking #</td><td style="padding: 10px; border: 1px solid #eee; font-weight: bold;">${booking.bookingNumber}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">Item</td><td style="padding: 10px; border: 1px solid #eee; font-weight: bold;">${booking.itemName}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">Dates</td><td style="padding: 10px; border: 1px solid #eee;">${new Date(booking.startDate).toLocaleDateString()} — ${new Date(booking.endDate).toLocaleDateString()}</td></tr>
            ${booking.guests ? `<tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">Guests</td><td style="padding: 10px; border: 1px solid #eee;">${booking.guests}</td></tr>` : ""}
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">Total Price</td><td style="padding: 10px; border: 1px solid #eee; font-weight: bold;">$${booking.totalPrice.toLocaleString()}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">Deposit Received</td><td style="padding: 10px; border: 1px solid #eee; color: green;">$${booking.depositAmount.toLocaleString()}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666; font-weight: bold;">Remaining Balance</td><td style="padding: 10px; border: 1px solid #eee; font-weight: bold; color: #c00;">$${booking.balanceDue.toLocaleString()}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">Due Date</td><td style="padding: 10px; border: 1px solid #eee;">${balanceDueDateStr}</td></tr>
          </table>

          ${wireSettings.wireBankName ? `
          <h3 style="color: #1a1a1a; margin-top: 28px;">Wire Transfer Instructions</h3>
          <p>Please wire the remaining balance to the following account:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: #f8f8f8;">
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">Bank Name</td><td style="padding: 10px; border: 1px solid #eee;">${wireSettings.wireBankName}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">Account Number</td><td style="padding: 10px; border: 1px solid #eee;">${wireSettings.wireAccountNumber || ""}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">Routing Number</td><td style="padding: 10px; border: 1px solid #eee;">${wireSettings.wireRoutingNumber || ""}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">SWIFT Code</td><td style="padding: 10px; border: 1px solid #eee;">${wireSettings.wireSwiftCode || ""}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; color: #666;">Bank Address</td><td style="padding: 10px; border: 1px solid #eee;">${wireSettings.wireBankAddress || ""}</td></tr>
          </table>
          ` : ""}

          <p style="margin-top: 24px;">After completing the wire transfer, please upload your proof of payment (bank receipt, SWIFT confirmation, or screenshot):</p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${uploadLink}" style="background: #1a1a1a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Upload Wire Transfer Proof</a>
          </div>

          <p style="color: #666; font-size: 13px;">If you have any questions, reply to this email or chat with Mark at our website.</p>
        </div>

        <div style="background: #1a1a1a; padding: 16px; text-align: center;">
          <p style="color: #666; margin: 0; font-size: 11px;">VIDI VICI Hospitality Group</p>
        </div>
      </div>`,
    })

    // Update booking
    let activityLog: any[] = []
    try { activityLog = JSON.parse(booking.activityLog || "[]") } catch {}
    activityLog.push({ action: "Confirmation email sent with wire instructions", timestamp: new Date().toISOString() })

    await prisma.markBooking.update({
      where: { id },
      data: {
        workflowStatus: "balance_info_sent",
        activityLog: JSON.stringify(activityLog),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Send confirmation error:", error)
    return NextResponse.json({ error: error.message || "Failed to send confirmation" }, { status: 500 })
  }
}
