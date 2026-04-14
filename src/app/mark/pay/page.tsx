"use client"

import { useState, useEffect, use } from "react"
import { CheckCircle, AlertCircle, CreditCard } from "lucide-react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

export default function MarkPayPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = use(searchParams)

  const [booking, setBooking] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Invalid link — no token provided.")
      setLoading(false)
      return
    }
    fetch(`/api/mark/pay?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setBooking(data)
      })
      .catch(() => setError("Failed to load booking details."))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-mist-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-mist-900" />
      </div>
    )
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-mist-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h1 className="text-xl font-bold text-mist-900 mb-2">Invalid Link</h1>
          <p className="text-mist-500">{error}</p>
        </div>
      </div>
    )
  }

  if (success || booking?.depositPaid) {
    return (
      <div className="min-h-screen bg-mist-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
          <h1 className="text-xl font-bold text-mist-900 mb-2">
            {booking?.depositPaid && !success ? "Deposit Already Paid" : "Deposit Payment Received!"}
          </h1>
          <p className="text-mist-500">
            {booking?.depositPaid && !success
              ? "Your deposit has already been received for this booking."
              : "Thank you! Your deposit has been received. Our team will confirm availability with the property owner and get back to you shortly."}
          </p>
          {booking && (
            <p className="mt-4 text-sm text-mist-400">Booking Reference: <strong>{booking.bookingNumber}</strong></p>
          )}
        </div>
      </div>
    )
  }

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""

  return (
    <div className="min-h-screen bg-mist-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-mist-100 rounded-full mb-3">
            <CreditCard className="text-mist-700" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-mist-900">Deposit Payment</h1>
          <p className="text-mist-500 text-sm mt-1">Vidi Vici Hospitality Group</p>
        </div>

        {/* Booking Info */}
        {booking && (
          <div className="bg-mist-50 rounded-xl p-4 mb-6 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-mist-500">Booking #</span>
              <span className="font-semibold text-mist-900">{booking.bookingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mist-500">Item</span>
              <span className="font-semibold text-mist-900">{booking.itemName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mist-500">Dates</span>
              <span className="text-mist-900">{new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}</span>
            </div>
            {booking.guests && (
              <div className="flex justify-between">
                <span className="text-mist-500">Guests</span>
                <span className="text-mist-900">{booking.guests}</span>
              </div>
            )}
            <div className="border-t border-mist-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-mist-500">Total Price</span>
                <span className="text-mist-900">${booking.totalPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-base mt-1">
                <span className="text-mist-900">Deposit Due Now</span>
                <span className="text-mist-900">${booking.depositAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {processing && (
          <div className="text-center py-4 text-mist-500">Processing payment...</div>
        )}

        {/* PayPal Buttons */}
        {booking && paypalClientId && (
          <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD", intent: "capture" }}>
            <PayPalButtons
              style={{ layout: "vertical", color: "black", shape: "rect", label: "pay" }}
              createOrder={async () => {
                const res = await fetch("/api/paypal/create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    totalPrice: booking.depositAmount,
                    currency: "USD",
                    bookingRef: booking.bookingNumber,
                    intent: "CAPTURE",
                  }),
                })
                const data = await res.json()
                if (!data.orderId) throw new Error("Failed to create order")
                return data.orderId
              }}
              onApprove={async (data) => {
                setProcessing(true)
                try {
                  const res = await fetch("/api/mark/pay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, orderId: data.orderID }),
                  })
                  const result = await res.json()
                  if (!res.ok) throw new Error(result.error)
                  setSuccess(true)
                } catch (err: any) {
                  setError(err.message)
                } finally {
                  setProcessing(false)
                }
              }}
              onError={() => setError("Payment failed. Please try again.")}
            />
          </PayPalScriptProvider>
        )}

        {!paypalClientId && (
          <p className="text-center text-mist-500 text-sm">Payment system is being configured. Please contact us.</p>
        )}

        <p className="text-xs text-mist-400 text-center mt-4">
          Your deposit secures your booking. Our team will confirm availability and send you the remaining balance details.
        </p>
      </div>
    </div>
  )
}
