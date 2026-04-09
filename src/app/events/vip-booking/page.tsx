"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { ChevronDown } from "lucide-react"

const BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
]

const ADD_ONS = ["Chauffeur / Party Bus", "Security / Bodyguard"]
const VENUE_OPTIONS = [
  "Delilah Los Angeles",
  "Catch LA Rooftop",
  "The Highlight Room",
  "Trinity Ballroom",
]

const EVENT_TYPE_OPTIONS = [
  "Birthday Party",
  "Corporate Event",
  "Wedding Reception",
  "Private Dinner",
  "Album Release",
  "Networking Event",
  "Other",
]

type BookingForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  clubVenue: string
  eventType: string
  bookingDate: string
  guestsTotal: string
  budget: string
  addOns: string[]
  specialRequests: string
}

const defaultForm: BookingForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  clubVenue: "",
  eventType: "",
  bookingDate: "",
  guestsTotal: "",
  budget: "",
  addOns: [],
  specialRequests: "",
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: "Info", step: 1 },
    { label: "Pay", step: 2 },
    { label: "Done", step: 3 },
  ]

  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto mb-10">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-4 h-4 rounded-full border-2 transition-colors ${
                currentStep >= s.step
                  ? "bg-blue-500 border-blue-500"
                  : "bg-gray-200 border-gray-300"
              }`}
            />
            <span
              className={`text-sm font-medium mt-2 ${
                currentStep >= s.step ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 mx-2 mb-6">
              <div
                className={`h-0.5 w-full ${
                  currentStep > s.step
                    ? "bg-blue-500"
                    : currentStep === s.step
                    ? "bg-blue-500 opacity-50"
                    : "bg-gray-200 border-t-2 border-dashed border-gray-300 h-0"
                }`}
                style={
                  currentStep <= s.step
                    ? { borderTop: "2px dashed #d1d5db", height: 0 }
                    : {}
                }
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function switchTemporalInputType(input: HTMLInputElement, kind: "date" | "time") {
  if (input.type !== "text") return
  const isIOS =
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

  const lockedWidth = Math.ceil(input.getBoundingClientRect().width)
  if (isIOS && lockedWidth > 0) {
    input.style.width = `${lockedWidth}px`
    input.style.minWidth = `${lockedWidth}px`
    input.style.maxWidth = `${lockedWidth}px`
    input.style.fontSize = "16px"
  }

  input.type = kind
  requestAnimationFrame(() => {
    input.focus()
    if (
      typeof (input as HTMLInputElement & { showPicker?: () => void }).showPicker ===
      "function"
    ) {
      try {
        ;(input as HTMLInputElement & { showPicker: () => void }).showPicker()
      } catch {
        // Fallback
      }
    }
    if (isIOS) {
      requestAnimationFrame(() => {
        input.style.width = "100%"
        input.style.minWidth = "0"
        input.style.maxWidth = "100%"
        input.style.fontSize = "16px"
      })
    }
  })
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}

function EventPayPalButton({
  bookingData,
  onSuccess,
  onError,
}: {
  bookingData: Record<string, any>
  onSuccess: () => void
  onError: (msg: string) => void
}) {
  const [processing, setProcessing] = useState(false)
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  if (!clientId)
    return (
      <p className="text-red-400 text-sm text-center">
        PayPal is not configured.
      </p>
    )

  return (
    <PayPalScriptProvider
      options={{ clientId, currency: "USD", intent: "capture" }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay",
        }}
        disabled={processing}
        createOrder={async () => {
          setProcessing(true)
          try {
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                totalPrice: 100,
                currency: "USD",
                bookingRef: "event",
                intent: "CAPTURE",
              }),
            })
            const data = await res.json()
            if (!res.ok)
              throw new Error(data.error || "Failed to create order")
            return data.orderId
          } catch (err: any) {
            setProcessing(false)
            onError(err.message)
            throw err
          }
        }}
        onApprove={async (data) => {
          try {
            const res = await fetch("/api/paypal/capture-event", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderID,
                bookingData,
              }),
            })
            const result = await res.json()
            if (!res.ok)
              throw new Error(result.error || "Payment failed")
            onSuccess()
          } catch (err: any) {
            onError(err.message)
          } finally {
            setProcessing(false)
          }
        }}
        onError={(err) => {
          setProcessing(false)
          onError(String(err))
        }}
        onCancel={() => setProcessing(false)}
      />
    </PayPalScriptProvider>
  )
}

export default function VipBookingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<BookingForm>(defaultForm)
  const [paymentError, setPaymentError] = useState("")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("vipBookingData")
      if (raw) {
        const data = JSON.parse(raw)
        setForm((prev) => ({
          ...prev,
          ...data,
          addOns: Array.isArray(data.addOns)
            ? data.addOns
            : typeof data.addOns === "string" && data.addOns
            ? data.addOns.split(", ").filter(Boolean)
            : [],
        }))
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true)
  }, [])

  const inputClass =
    "w-full border border-mist-300 rounded-xl px-4 py-3 text-sm text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white"

  const isFormValid =
    form.firstName && form.email && form.bookingDate && form.clubVenue

  const toggleAddOn = (addon: string) => {
    setForm((f) => ({
      ...f,
      addOns: f.addOns.includes(addon)
        ? f.addOns.filter((a) => a !== addon)
        : [...f.addOns, addon],
    }))
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    // Save updated form data back to sessionStorage
    sessionStorage.setItem("vipBookingData", JSON.stringify(form))
    setStep(2)
  }

  const handlePaymentSuccess = () => {
    sessionStorage.removeItem("vipBookingData")
    setStep(3)
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-mist-300 border-t-mist-900 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="border border-mist-200 rounded-3xl shadow-sm p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-mist-900 text-center mb-8 tracking-tight">
            VIP Venue Booking Request
          </h1>

          <StepIndicator currentStep={step} />

          {/* Step 1: Info */}
          {step === 1 && (
            <form onSubmit={handleInfoSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="First Name">
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className={inputClass}
                    required
                  />
                </Field>
                <Field label="Last Name">
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Email Address">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                    required
                  />
                </Field>
                <Field label="Phone">
                  <div className="flex items-center border border-mist-300 rounded-xl overflow-hidden focus-within:border-mist-400 transition-colors duration-200 bg-white">
                    <span className="px-4 py-3 text-sm border-r border-mist-300 bg-mist-50 flex items-center gap-2 text-mist-600 flex-shrink-0">
                      🇺🇸
                    </span>
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="Enter your phone number"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="flex-1 px-4 py-3 text-sm text-mist-900 placeholder-mist-400 outline-none bg-white"
                    />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Select Club / Event">
                  <div className="relative">
                    <select
                      value={form.clubVenue}
                      onChange={(e) =>
                        setForm({ ...form, clubVenue: e.target.value })
                      }
                      className={`${inputClass} appearance-none pr-10`}
                      required
                    >
                      <option value="" disabled>
                        Choose a venue
                      </option>
                      {VENUE_OPTIONS.map((venue) => (
                        <option key={venue} value={venue}>
                          {venue}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist-400"
                    />
                  </div>
                </Field>
                <Field label="Event Type">
                  <div className="relative">
                    <select
                      value={form.eventType}
                      onChange={(e) =>
                        setForm({ ...form, eventType: e.target.value })
                      }
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="" disabled>
                        Choose event type
                      </option>
                      {EVENT_TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist-400"
                    />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Guests (Total & Ratio)">
                  <input
                    type="text"
                    placeholder="e.g. 6 guests ~ 4M / 2F"
                    value={form.guestsTotal}
                    onChange={(e) =>
                      setForm({ ...form, guestsTotal: e.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Booking Date">
                  <input
                    type={form.bookingDate ? "date" : "text"}
                    onPointerDown={(e) =>
                      switchTemporalInputType(e.currentTarget, "date")
                    }
                    onFocus={(e) =>
                      switchTemporalInputType(e.currentTarget, "date")
                    }
                    onBlur={(e) => {
                      if (!form.bookingDate) e.currentTarget.type = "text"
                    }}
                    value={form.bookingDate}
                    onChange={(e) =>
                      setForm({ ...form, bookingDate: e.target.value })
                    }
                    placeholder="dd/mm/yyyy"
                    className={`${inputClass} ios-temporal-input`}
                    required
                  />
                </Field>
              </div>

              <Field label="Budget">
                <div className="relative">
                  <select
                    value={form.budget}
                    onChange={(e) =>
                      setForm({ ...form, budget: e.target.value })
                    }
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    <option value="" disabled>
                      Select your budget range
                    </option>
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist-400"
                  />
                </div>
              </Field>

              <Field label="Add-Ons">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  {ADD_ONS.map((addon) => (
                    <button
                      key={addon}
                      type="button"
                      onClick={() => toggleAddOn(addon)}
                      className={`w-full px-4 py-3 rounded-2xl text-sm font-medium border transition-all flex items-center gap-4 ${
                        form.addOns.includes(addon)
                          ? "bg-white text-mist-900 border-mist-300"
                          : "bg-white text-mist-700 border-mist-200 hover:border-mist-300"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          form.addOns.includes(addon)
                            ? "border-blue-500"
                            : "border-mist-400"
                        }`}
                      >
                        {form.addOns.includes(addon) && (
                          <span className="w-3 h-3 rounded-full bg-blue-500" />
                        )}
                      </span>
                      {addon}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Special Requests / Notes">
                <textarea
                  placeholder="e.g. Birthday celebration, bottle preferences, etc."
                  value={form.specialRequests}
                  onChange={(e) =>
                    setForm({ ...form, specialRequests: e.target.value })
                  }
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-mist-900 text-white font-medium py-4 rounded-3xl hover:bg-mist-800 transition-colors disabled:opacity-50 mt-2 text-base"
              >
                Next
              </button>
            </form>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-mist-900 mb-1">
                  Secure Payment Authorization
                </h3>
                <p className="text-sm text-mist-600 leading-relaxed">
                  A $100 service fee will be authorized to process your request.
                  You will only be charged if your reservation is confirmed.
                  This fee is non-refundable once confirmed.
                </p>
              </div>

              {paymentError && (
                <p className="text-sm text-red-500 text-center">
                  {paymentError}
                </p>
              )}

              <EventPayPalButton
                bookingData={{
                  firstName: form.firstName,
                  lastName: form.lastName,
                  email: form.email,
                  phone: form.phone,
                  clubVenue: form.clubVenue,
                  eventType: form.eventType,
                  bookingDate: form.bookingDate,
                  guestsTotal: form.guestsTotal,
                  budget: form.budget,
                  addOns: form.addOns.join(", "),
                  specialRequests: form.specialRequests,
                }}
                onSuccess={handlePaymentSuccess}
                onError={(msg) => setPaymentError(msg)}
              />

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-mist-500 hover:text-mist-700 transition-colors text-center"
              >
                &larr; Back to Info
              </button>
            </div>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center py-8">
              <h2 className="text-xl font-bold text-mist-900 mb-3">
                Booking Request Submitted
              </h2>
              <p className="text-mist-600 mb-4">
                Your booking request has been received.
              </p>
              <p className="text-mist-600 mb-1">
                A $100 service fee has been authorized (not charged yet).
              </p>
              <p className="text-mist-600 mb-6">
                You will only be charged once your reservation is confirmed.
              </p>
              <p className="text-mist-600">
                Our team will contact you shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
