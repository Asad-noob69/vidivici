import { NextRequest, NextResponse } from "next/server"
import { createPayPalOrder } from "@/lib/paypal"

export async function POST(request: NextRequest) {
  try {
    const { totalPrice, currency = "USD", bookingRef = "BOOKING", intent = "AUTHORIZE" } = await request.json()

    if (!totalPrice || totalPrice <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const order = await createPayPalOrder(totalPrice, currency, bookingRef, intent)

    return NextResponse.json({ orderId: order.id })
  } catch (error: any) {
    console.error("PayPal create order error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create PayPal order" },
      { status: 500 }
    )
  }
}
