import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(coupons)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, discountPercent, maxUses, scope, scopeItemId, expiresAt } = body

    if (!code || !discountPercent) {
      return NextResponse.json({ error: "Code and discount are required" }, { status: 400 })
    }

    if (discountPercent <= 0 || discountPercent > 100) {
      return NextResponse.json({ error: "Discount must be between 1 and 100" }, { status: 400 })
    }

    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountPercent: parseFloat(discountPercent),
        maxUses: parseInt(maxUses) || 1,
        scope: scope || "all_cars",
        scopeItemId: scopeItemId || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 })
  }
}
