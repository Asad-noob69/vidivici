import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { notifyAdmin } from "@/lib/email"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// GET /api/mark/upload-proof?token=TOKEN — return booking info for upload page
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 })

  const booking = await prisma.markBooking.findUnique({
    where: { wireProofToken: token },
    select: {
      id: true,
      bookingNumber: true,
      itemName: true,
      customerName: true,
      totalPrice: true,
      depositAmount: true,
      balanceDue: true,
      wireProofUrl: true,
    },
  })

  if (!booking) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 })
  }

  return NextResponse.json({
    bookingNumber: booking.bookingNumber,
    itemName: booking.itemName,
    customerName: booking.customerName,
    totalPrice: booking.totalPrice,
    depositAmount: booking.depositAmount,
    balanceDue: booking.balanceDue,
    alreadyUploaded: !!booking.wireProofUrl,
  })
}

// POST /api/mark/upload-proof — customer uploads wire transfer proof
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const token = formData.get("token") as string
    const file = formData.get("file") as File | null

    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 })
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF, JPG, or PNG files are accepted" }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 })
    }

    const booking = await prisma.markBooking.findUnique({
      where: { wireProofToken: token },
    })

    if (!booking) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 })
    }

    // Save file
    const uploadDir = path.join(process.cwd(), "public", "uploads", "wire-proofs")
    await mkdir(uploadDir, { recursive: true })
    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf"
    const uniqueName = `wire-proof-${token.slice(0, 16)}-${Date.now()}.${ext}`
    const filePath = path.join(uploadDir, uniqueName)
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))
    const wireProofUrl = `/uploads/wire-proofs/${uniqueName}`

    // Parse existing activity log
    let activityLog: any[] = []
    try { activityLog = JSON.parse(booking.activityLog || "[]") } catch {}
    activityLog.push({ action: "Wire transfer proof uploaded", timestamp: new Date().toISOString() })

    // Update booking
    await prisma.markBooking.update({
      where: { id: booking.id },
      data: {
        wireProofUrl,
        wireProofUploadedAt: new Date(),
        workflowStatus: "proof_uploaded",
        activityLog: JSON.stringify(activityLog),
      },
    })

    // Notify admin
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    await notifyAdmin(
      `Wire Proof Uploaded — ${booking.bookingNumber}`,
      `<h2>Wire Transfer Proof Received</h2>
      <p><strong>Booking #:</strong> ${booking.bookingNumber}</p>
      <p><strong>Customer:</strong> ${booking.customerName} (${booking.customerEmail})</p>
      <p><strong>Item:</strong> ${booking.itemName}</p>
      <p><strong>Balance Due:</strong> $${booking.balanceDue.toLocaleString()}</p>
      <p>Please review the proof and close the booking if everything checks out.</p>
      <p><a href="${baseUrl}/admin/mark-bookings/${booking.id}">View in Admin →</a></p>`
    ).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Wire proof upload error:", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}
