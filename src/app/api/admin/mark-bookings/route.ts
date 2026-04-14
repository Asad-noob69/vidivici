import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/admin/mark-bookings — list all Mark bookings
export async function GET() {
  try {
    const bookings = await prisma.markBooking.findMany({
      include: {
        car: { select: { name: true, brand: { select: { name: true } } } },
        villa: { select: { name: true } },
        event: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(bookings)
  } catch (error: any) {
    console.error("Error fetching mark bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
