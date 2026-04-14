"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { ArrowLeft, Check, X, Send, Eye, Download, Clock } from "lucide-react"

const WORKFLOW_STEPS = [
  { key: "booking_ready", label: "Booking Ready" },
  { key: "deposit_paid", label: "Deposit Paid" },
  { key: "awaiting_owner", label: "Awaiting Owner" },
  { key: "owner_confirmed", label: "Owner Confirmed" },
  { key: "balance_info_sent", label: "Balance Info Sent" },
  { key: "proof_uploaded", label: "Proof Uploaded" },
  { key: "closed", label: "Closed" },
]

const STATUS_COLORS: Record<string, string> = {
  booking_ready: "bg-blue-100 text-blue-800",
  deposit_paid: "bg-yellow-100 text-yellow-800",
  awaiting_owner: "bg-orange-100 text-orange-800",
  owner_confirmed: "bg-purple-100 text-purple-800",
  balance_info_sent: "bg-indigo-100 text-indigo-800",
  proof_uploaded: "bg-teal-100 text-teal-800",
  closed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function MarkBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [balanceDueDate, setBalanceDueDate] = useState("")

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/admin/mark-bookings/${id}`)
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }
      setBooking(data)
      setAdminNotes(data.adminNotes || "")
      setBalanceDueDate(data.balanceDueDate ? new Date(data.balanceDueDate).toISOString().split("T")[0] : "")
    } catch { toast.error("Failed to load booking") }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBooking() }, [id])

  const updateStatus = async (workflowStatus: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/mark-bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowStatus }),
      })
      if (!res.ok) throw new Error("Failed to update")
      toast.success("Status updated")
      fetchBooking()
    } catch { toast.error("Failed to update status") }
    finally { setUpdating(false) }
  }

  const sendConfirmation = async () => {
    if (!balanceDueDate) {
      toast.error("Please set a balance due date first")
      return
    }
    setUpdating(true)
    try {
      // Save balance due date first
      await fetch(`/api/admin/mark-bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balanceDueDate }),
      })
      // Then send confirmation
      const res = await fetch(`/api/admin/mark-bookings/${id}/send-confirmation`, { method: "POST" })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed") }
      toast.success("Confirmation email sent!")
      fetchBooking()
    } catch (e: any) { toast.error(e.message) }
    finally { setUpdating(false) }
  }

  const saveNotes = async () => {
    try {
      const res = await fetch(`/api/admin/mark-bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      })
      if (!res.ok) throw new Error()
      toast.success("Notes saved")
    } catch { toast.error("Failed to save notes") }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-mist-900 mb-8">Loading...</h1>
        <div className="text-center py-12 text-mist-500">Loading booking details...</div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-mist-900 mb-8">Booking Not Found</h1>
        <Link href="/admin/mark-bookings" className="text-blue-600 hover:underline">Back to Mark Bookings</Link>
      </div>
    )
  }

  const currentStepIndex = WORKFLOW_STEPS.findIndex((s) => s.key === booking.workflowStatus)
  const isCancelled = booking.workflowStatus === "cancelled"
  const activityLog = (() => { try { return JSON.parse(booking.activityLog || "[]") } catch { return [] } })()
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/mark-bookings" className="text-mist-400 hover:text-mist-900">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-mist-900">{booking.bookingNumber}</h1>
          <p className="text-sm text-mist-500">{booking.itemName} ({booking.itemType})</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[booking.workflowStatus] || "bg-gray-100 text-gray-800"}`}>
          {isCancelled ? "Cancelled" : WORKFLOW_STEPS.find((s) => s.key === booking.workflowStatus)?.label || booking.workflowStatus}
        </span>
      </div>

      {/* Workflow Stepper */}
      {!isCancelled && (
        <div className="bg-white border border-mist-200 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-mist-500 mb-4">WORKFLOW PROGRESS</h2>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {WORKFLOW_STEPS.map((step, i) => {
              const isCompleted = i < currentStepIndex
              const isCurrent = i === currentStepIndex
              return (
                <div key={step.key} className="flex items-center flex-shrink-0">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isCompleted ? "bg-green-100 text-green-800" : isCurrent ? "bg-black text-white" : "bg-mist-100 text-mist-400"
                  }`}>
                    {isCompleted ? <Check size={12} /> : <span className="w-4 text-center">{i + 1}</span>}
                    <span className="whitespace-nowrap">{step.label}</span>
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div className={`w-4 h-0.5 mx-1 ${i < currentStepIndex ? "bg-green-400" : "bg-mist-200"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Customer & Booking Info */}
        <div className="space-y-6">
          <div className="bg-white border border-mist-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-mist-500 mb-4">CUSTOMER</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-mist-500">Name:</span> <span className="font-medium text-mist-900">{booking.customerName}</span></div>
              <div><span className="text-mist-500">Email:</span> <span className="text-mist-900">{booking.customerEmail}</span></div>
              <div><span className="text-mist-500">Phone:</span> <span className="text-mist-900">{booking.customerPhone || "N/A"}</span></div>
            </div>
          </div>

          <div className="bg-white border border-mist-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-mist-500 mb-4">BOOKING DETAILS</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-mist-500">Item:</span> <span className="font-medium text-mist-900">{booking.itemName}</span></div>
              <div><span className="text-mist-500">Type:</span> <span className="text-mist-900 capitalize">{booking.itemType}</span></div>
              <div><span className="text-mist-500">Dates:</span> <span className="text-mist-900">{new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}</span></div>
              {booking.guests && <div><span className="text-mist-500">Guests:</span> <span className="text-mist-900">{booking.guests}</span></div>}
              {booking.notes && <div><span className="text-mist-500">Notes:</span> <span className="text-mist-900">{booking.notes}</span></div>}
            </div>
          </div>
        </div>

        {/* Column 2: Pricing & Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-mist-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-mist-500 mb-4">PRICING</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-mist-500">Total Price</span><span className="font-bold text-mist-900">${booking.totalPrice?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-mist-500">Deposit</span><span className={booking.depositPaid ? "text-green-600 font-medium" : "text-mist-400"}>${booking.depositAmount?.toLocaleString()} {booking.depositPaid ? "(paid)" : "(pending)"}</span></div>
              <div className="flex justify-between border-t border-mist-100 pt-2"><span className="text-mist-500 font-medium">Balance Due</span><span className="font-bold text-mist-900">${booking.balanceDue?.toLocaleString()}</span></div>
              {booking.depositPaidAt && <div className="text-xs text-mist-400">Deposit paid: {new Date(booking.depositPaidAt).toLocaleString()}</div>}
              {booking.paypalOrderId && <div className="text-xs text-mist-400">PayPal: {booking.paypalOrderId}</div>}
            </div>
          </div>

          {/* Wire Proof */}
          {booking.wireProofUrl && (
            <div className="bg-white border border-mist-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-mist-500 mb-4">WIRE PROOF</h2>
              <div className="space-y-3">
                <a href={booking.wireProofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <Eye size={14} /> View Uploaded Proof
                </a>
                <a href={booking.wireProofUrl} download className="inline-flex items-center gap-2 text-sm text-mist-600 hover:text-mist-900 ml-4">
                  <Download size={14} /> Download
                </a>
                {booking.wireProofUploadedAt && <p className="text-xs text-mist-400">Uploaded: {new Date(booking.wireProofUploadedAt).toLocaleString()}</p>}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white border border-mist-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-mist-500 mb-4">ACTIONS</h2>
            <div className="space-y-3">
              {booking.workflowStatus === "booking_ready" && (
                <div>
                  <p className="text-xs text-mist-500 mb-2">Deposit payment link:</p>
                  <input type="text" readOnly value={`${baseUrl}/mark/pay?token=${booking.depositPaymentToken}`} className="w-full text-xs bg-mist-50 border border-mist-200 rounded px-3 py-2 text-mist-600 mb-2" onClick={(e) => (e.target as HTMLInputElement).select()} />
                  <p className="text-xs text-mist-400">Share this link with the customer to pay their deposit.</p>
                </div>
              )}

              {booking.workflowStatus === "deposit_paid" && (
                <button onClick={() => updateStatus("awaiting_owner")} disabled={updating} className="w-full bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50">
                  <Send size={14} className="inline mr-2" />Send to Owner for Confirmation
                </button>
              )}

              {booking.workflowStatus === "awaiting_owner" && (
                <div className="space-y-2">
                  <button onClick={() => updateStatus("owner_confirmed")} disabled={updating} className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                    <Check size={14} className="inline mr-2" />Owner Confirmed
                  </button>
                  <button onClick={() => updateStatus("cancelled")} disabled={updating} className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                    <X size={14} className="inline mr-2" />Owner Declined
                  </button>
                </div>
              )}

              {booking.workflowStatus === "owner_confirmed" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-mist-500 block mb-1">Balance Due Date</label>
                    <input type="date" value={balanceDueDate} onChange={(e) => setBalanceDueDate(e.target.value)} className="w-full bg-mist-50 border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none" />
                  </div>
                  <button onClick={sendConfirmation} disabled={updating} className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-mist-800 disabled:opacity-50">
                    <Send size={14} className="inline mr-2" />Send Confirmation + Wire Instructions
                  </button>
                </div>
              )}

              {booking.workflowStatus === "balance_info_sent" && (
                <div>
                  <p className="text-xs text-mist-500 mb-2">Wire proof upload link:</p>
                  <input type="text" readOnly value={`${baseUrl}/mark/upload-proof?token=${booking.wireProofToken}`} className="w-full text-xs bg-mist-50 border border-mist-200 rounded px-3 py-2 text-mist-600" onClick={(e) => (e.target as HTMLInputElement).select()} />
                  <p className="text-xs text-mist-400 mt-1">Waiting for customer to upload wire transfer proof.</p>
                </div>
              )}

              {booking.workflowStatus === "proof_uploaded" && (
                <button onClick={() => updateStatus("closed")} disabled={updating} className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                  <Check size={14} className="inline mr-2" />Close Booking
                </button>
              )}

              {!["closed", "cancelled"].includes(booking.workflowStatus) && booking.workflowStatus !== "awaiting_owner" && (
                <button onClick={() => { if (confirm("Are you sure you want to cancel this booking?")) updateStatus("cancelled") }} disabled={updating} className="w-full border border-red-300 text-red-600 py-2 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50">
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Notes & Activity Log */}
        <div className="space-y-6">
          <div className="bg-white border border-mist-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-mist-500 mb-4">ADMIN NOTES</h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this booking..."
              rows={4}
              className="w-full bg-mist-50 border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none resize-none"
            />
            <button onClick={saveNotes} className="mt-2 bg-black text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-mist-800">
              Save Notes
            </button>
          </div>

          <div className="bg-white border border-mist-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-mist-500 mb-4">ACTIVITY LOG</h2>
            {activityLog.length === 0 ? (
              <p className="text-sm text-mist-400">No activity yet.</p>
            ) : (
              <div className="space-y-3">
                {activityLog.slice().reverse().map((entry: any, i: number) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <Clock size={14} className="text-mist-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-mist-900">{entry.action}</p>
                      <p className="text-xs text-mist-400">{new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {booking.ownerNotes && (
            <div className="bg-white border border-mist-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-mist-500 mb-4">OWNER NOTES</h2>
              <p className="text-sm text-mist-900">{booking.ownerNotes}</p>
              {booking.ownerConfirmedAt && <p className="text-xs text-mist-400 mt-2">Confirmed: {new Date(booking.ownerConfirmedAt).toLocaleString()}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
