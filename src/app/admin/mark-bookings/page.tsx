"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Calendar, User, DollarSign } from "lucide-react"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  booking_ready: { label: "Booking Ready", color: "bg-blue-100 text-blue-800" },
  deposit_paid: { label: "Deposit Paid", color: "bg-yellow-100 text-yellow-800" },
  awaiting_owner: { label: "Awaiting Owner", color: "bg-orange-100 text-orange-800" },
  owner_confirmed: { label: "Owner Confirmed", color: "bg-purple-100 text-purple-800" },
  balance_info_sent: { label: "Balance Info Sent", color: "bg-indigo-100 text-indigo-800" },
  proof_uploaded: { label: "Proof Uploaded", color: "bg-teal-100 text-teal-800" },
  closed: { label: "Closed", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
}

const TYPE_LABELS: Record<string, string> = { car: "Car", villa: "Villa", event: "Event" }

export default function AdminMarkBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    fetch("/api/admin/mark-bookings")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBookings(data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "all" && b.workflowStatus !== statusFilter) return false
    if (typeFilter !== "all" && b.itemType !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        b.customerName?.toLowerCase().includes(q) ||
        b.customerEmail?.toLowerCase().includes(q) ||
        b.bookingNumber?.toLowerCase().includes(q) ||
        b.itemName?.toLowerCase().includes(q)
      )
    }
    return true
  })

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-mist-900 mb-8">Mark AI Bookings</h1>
        <div className="text-center py-12 text-mist-500">Loading bookings...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-mist-900 mb-6">Mark AI Bookings</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, booking #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-mist-200 rounded-lg text-sm focus:border-black focus:outline-none"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-mist-200 rounded-lg text-sm px-3 py-2.5 focus:border-black focus:outline-none">
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-white border border-mist-200 rounded-lg text-sm px-3 py-2.5 focus:border-black focus:outline-none">
          <option value="all">All Types</option>
          <option value="car">Car</option>
          <option value="villa">Villa</option>
          <option value="event">Event</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-mist-200 rounded-xl p-4">
          <p className="text-xs text-mist-500">Total</p>
          <p className="text-2xl font-bold text-mist-900">{bookings.length}</p>
        </div>
        <div className="bg-white border border-mist-200 rounded-xl p-4">
          <p className="text-xs text-mist-500">Active</p>
          <p className="text-2xl font-bold text-blue-600">{bookings.filter((b) => !["closed", "cancelled"].includes(b.workflowStatus)).length}</p>
        </div>
        <div className="bg-white border border-mist-200 rounded-xl p-4">
          <p className="text-xs text-mist-500">Deposits Received</p>
          <p className="text-2xl font-bold text-green-600">${bookings.filter((b) => b.depositPaid).reduce((sum: number, b: any) => sum + b.depositAmount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white border border-mist-200 rounded-xl p-4">
          <p className="text-xs text-mist-500">Total Value</p>
          <p className="text-2xl font-bold text-mist-900">${bookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-mist-500 bg-white border border-mist-200 rounded-xl">
          No Mark AI bookings found.
        </div>
      ) : (
        <div className="bg-white border border-mist-200 rounded-xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mist-100">
                  <th className="text-left px-4 py-3 text-mist-500 font-medium">Booking #</th>
                  <th className="text-left px-4 py-3 text-mist-500 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 text-mist-500 font-medium">Item</th>
                  <th className="text-left px-4 py-3 text-mist-500 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-mist-500 font-medium">Dates</th>
                  <th className="text-left px-4 py-3 text-mist-500 font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-mist-500 font-medium">Deposit</th>
                  <th className="text-left px-4 py-3 text-mist-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const status = STATUS_LABELS[b.workflowStatus] || { label: b.workflowStatus, color: "bg-gray-100 text-gray-800" }
                  return (
                    <tr key={b.id} className="border-b border-mist-50 hover:bg-mist-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/mark-bookings/${b.id}`} className="text-blue-600 hover:underline font-medium">{b.bookingNumber}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-mist-400" />
                          <div>
                            <div className="font-medium text-mist-900">{b.customerName}</div>
                            <div className="text-xs text-mist-400">{b.customerEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-mist-900">{b.itemName}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs bg-mist-100 text-mist-700">{TYPE_LABELS[b.itemType] || b.itemType}</span></td>
                      <td className="px-4 py-3 text-mist-600 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <DollarSign size={12} className="text-mist-400" />
                          <span className="font-medium">{b.totalPrice?.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={b.depositPaid ? "text-green-600 font-medium" : "text-mist-400"}>
                          ${b.depositAmount?.toLocaleString()} {b.depositPaid ? "" : "(pending)"}
                        </span>
                      </td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-mist-100">
            {filtered.map((b) => {
              const status = STATUS_LABELS[b.workflowStatus] || { label: b.workflowStatus, color: "bg-gray-100 text-gray-800" }
              return (
                <Link key={b.id} href={`/admin/mark-bookings/${b.id}`} className="block p-4 hover:bg-mist-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-mist-900">{b.bookingNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                  </div>
                  <p className="text-sm text-mist-700">{b.customerName} — {b.itemName}</p>
                  <p className="text-xs text-mist-400 mt-1">${b.totalPrice?.toLocaleString()} total | ${b.depositAmount?.toLocaleString()} deposit</p>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
