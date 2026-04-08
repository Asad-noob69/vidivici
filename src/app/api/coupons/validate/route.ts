import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { code, scope, itemId } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 })
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 })
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 })
    }

    // Check scope match
    const validScopes = getValidScopes(scope)
    if (!validScopes.includes(coupon.scope)) {
      return NextResponse.json({ error: "This coupon is not valid for this booking type" }, { status: 400 })
    }

    // If coupon is for a specific item, check itemId
    if (coupon.scopeItemId && coupon.scopeItemId !== itemId) {
      return NextResponse.json({ error: "This coupon is not valid for this item" }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      discountPercent: coupon.discountPercent,
      code: coupon.code,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 })
  }
}

function getValidScopes(bookingScope: string): string[] {
  switch (bookingScope) {
    case "car":
      return ["all_cars", "individual_car"]
    case "villa":
      return ["all_villas", "individual_villa"]
    case "event":
      return ["all_events", "individual_event"]
    default:
      return []
  }
}
