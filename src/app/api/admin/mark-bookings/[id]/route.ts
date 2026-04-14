import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/admin/mark-bookings/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const booking = await prisma.markBooking.findUnique({
      where: { id },
      include: {
        car: { select: { name: true, slug: true, brand: { select: { name: true } }, images: { where: { isPrimary: true }, take: 1 } } },
        villa: { select: { name: true, slug: true, images: { where: { isPrimary: true }, take: 1 } } },
        event: { select: { name: true, slug: true, images: { where: { isPrimary: true }, take: 1 } } },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error: any) {
    console.error("Error fetching mark booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

// PUT /api/admin/mark-bookings/[id] — update workflow status and admin fields
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const booking = await prisma.markBooking.findUnique({ where: { id } })
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Parse existing activity log
    let activityLog: any[] = []
    try { activityLog = JSON.parse(booking.activityLog || "[]") } catch {}

    const updateData: any = {}

    if (body.workflowStatus) {
      updateData.workflowStatus = body.workflowStatus

      if (body.workflowStatus === "awaiting_owner") {
        activityLog.push({ action: "Sent to owner for confirmation", timestamp: new Date().toISOString() })
      } else if (body.workflowStatus === "owner_confirmed") {
        updateData.ownerConfirmedAt = new Date()
        activityLog.push({ action: "Owner confirmed availability", timestamp: new Date().toISOString() })
      } else if (body.workflowStatus === "closed") {
        activityLog.push({ action: "Booking closed by associate", timestamp: new Date().toISOString() })
      } else if (body.workflowStatus === "cancelled") {
        activityLog.push({ action: "Booking cancelled", timestamp: new Date().toISOString() })
      }
    }

    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes
    if (body.ownerNotes !== undefined) updateData.ownerNotes = body.ownerNotes
    if (body.balanceDueDate !== undefined) updateData.balanceDueDate = body.balanceDueDate ? new Date(body.balanceDueDate) : null
    if (body.totalPrice !== undefined) {
      updateData.totalPrice = body.totalPrice
      updateData.balanceDue = body.totalPrice - booking.depositAmount
    }

    updateData.activityLog = JSON.stringify(activityLog)

    const updated = await prisma.markBooking.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Error updating mark booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
