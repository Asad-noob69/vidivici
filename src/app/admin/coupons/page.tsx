"use client"

import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Plus, Trash2, Copy, Search } from "lucide-react"

interface Coupon {
  id: string
  code: string
  discountPercent: number
  maxUses: number
  usedCount: number
  scope: string
  scopeItemId: string | null
  isActive: boolean
  expiresAt: string | null
  createdAt: string
}

interface ItemOption {
  id: string
  name: string
}

const SCOPE_OPTIONS = [
  { value: "all_cars", label: "All Cars" },
  { value: "individual_car", label: "Specific Car" },
  { value: "all_villas", label: "All Villas" },
  { value: "individual_villa", label: "Specific Villa" },
  { value: "all_events", label: "All Events" },
  { value: "individual_event", label: "Specific Event" },
]

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")

  // form
  const [code, setCode] = useState("")
  const [discountPercent, setDiscountPercent] = useState("")
  const [maxUses, setMaxUses] = useState("1")
  const [scope, setScope] = useState("all_cars")
  const [scopeItemId, setScopeItemId] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [creating, setCreating] = useState(false)

  // scope item options
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([])

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons")
      if (!res.ok) throw new Error()
      setCoupons(await res.json())
    } catch {
      toast.error("Failed to load coupons")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCoupons() }, [])

  useEffect(() => {
    if (scope === "individual_car") {
      fetch("/api/cars?limit=200").then(r => r.json()).then(d => setItemOptions((d.cars || []).map((c: any) => ({ id: c.id, name: `${c.brand?.name || ""} ${c.name}`.trim() }))))
    } else if (scope === "individual_villa") {
      fetch("/api/villas?limit=200").then(r => r.json()).then(d => setItemOptions((d.villas || []).map((v: any) => ({ id: v.id, name: v.name }))))
    } else if (scope === "individual_event") {
      fetch("/api/events?limit=200").then(r => r.json()).then(d => setItemOptions((d.events || []).map((e: any) => ({ id: e.id, name: e.name }))))
    } else {
      setItemOptions([])
      setScopeItemId("")
    }
  }, [scope])

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = "VIDI"
    for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length))
    setCode(result)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !discountPercent) return
    setCreating(true)
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountPercent: parseFloat(discountPercent),
          maxUses: parseInt(maxUses) || 1,
          scope,
          scopeItemId: scopeItemId || null,
          expiresAt: expiresAt || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      toast.success("Coupon created!")
      setShowForm(false)
      setCode("")
      setDiscountPercent("")
      setMaxUses("1")
      setScope("all_cars")
      setScopeItemId("")
      setExpiresAt("")
      fetchCoupons()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setCreating(false)
    }
  }

  const toggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      })
      if (!res.ok) throw new Error()
      toast.success(coupon.isActive ? "Coupon deactivated" : "Coupon activated")
      fetchCoupons()
    } catch {
      toast.error("Failed to update")
    }
  }

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Coupon deleted")
      fetchCoupons()
    } catch {
      toast.error("Failed to delete")
    }
  }

  const copyCode = (c: string) => {
    navigator.clipboard.writeText(c)
    toast.success("Copied!")
  }

  const filtered = coupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const scopeLabel = (s: string) => SCOPE_OPTIONS.find(o => o.value === s)?.label || s

  const inputClass = "w-full rounded-lg border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mist-900">Coupons</h1>
          <p className="text-sm text-mist-500 mt-1">Create and manage discount codes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-mist-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-mist-800 transition-colors"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-mist-200 rounded-xl p-5 mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-mist-600 mb-1">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VIDI20"
                  className={`${inputClass} flex-1`}
                  required
                />
                <button type="button" onClick={generateCode} className="px-3 py-2 bg-mist-100 text-mist-600 rounded-lg text-xs font-medium hover:bg-mist-200 transition-colors whitespace-nowrap">
                  Generate
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-mist-600 mb-1">Discount %</label>
              <input
                type="number"
                min="1"
                max="100"
                value={discountPercent}
                onChange={e => setDiscountPercent(e.target.value)}
                placeholder="e.g. 15"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-mist-600 mb-1">Max Uses</label>
              <input
                type="number"
                min="1"
                value={maxUses}
                onChange={e => setMaxUses(e.target.value)}
                placeholder="e.g. 10"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-mist-600 mb-1">Applies To</label>
              <select value={scope} onChange={e => setScope(e.target.value)} className={inputClass}>
                {SCOPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {scope.startsWith("individual_") && (
              <div>
                <label className="block text-xs font-medium text-mist-600 mb-1">Select Item</label>
                <select value={scopeItemId} onChange={e => setScopeItemId(e.target.value)} className={inputClass} required>
                  <option value="">Choose...</option>
                  {itemOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-mist-600 mb-1">Expires At (optional)</label>
              <input
                type="date"
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={creating}
              className="bg-mist-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-mist-800 transition-colors disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Coupon"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-mist-500 hover:bg-mist-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
          <input
            placeholder="Search coupons..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-mist-200 rounded-lg text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-mist-400 text-sm py-8 text-center">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-mist-400 text-sm py-8 text-center">No coupons found</p>
      ) : (
        <div className="bg-white border border-mist-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mist-100 bg-mist-50/50">
                  <th className="text-left px-4 py-3 font-medium text-mist-600">Code</th>
                  <th className="text-left px-4 py-3 font-medium text-mist-600">Discount</th>
                  <th className="text-left px-4 py-3 font-medium text-mist-600">Scope</th>
                  <th className="text-left px-4 py-3 font-medium text-mist-600">Usage</th>
                  <th className="text-left px-4 py-3 font-medium text-mist-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-mist-600">Expires</th>
                  <th className="text-right px-4 py-3 font-medium text-mist-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-mist-100 last:border-0 hover:bg-mist-50/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-mist-900">{c.code}</span>
                        <button onClick={() => copyCode(c.code)} className="text-mist-400 hover:text-mist-600"><Copy size={14} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-green-600 font-medium">{c.discountPercent}%</td>
                    <td className="px-4 py-3 text-mist-500">{scopeLabel(c.scope)}</td>
                    <td className="px-4 py-3 text-mist-500">{c.usedCount} / {c.maxUses}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(c)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-mist-400 text-xs">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteCoupon(c.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
