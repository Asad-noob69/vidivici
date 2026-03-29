"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Banner from "@/components/ui/Banner"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import {
  Heart,
  BedDouble,
  Users,
  Maximize2,
  ArrowUpRight,
  SlidersHorizontal,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
} from "lucide-react"

interface VillaFromAPI {
  id: string
  name: string
  slug: string
  location: string
  bedrooms: number
  guests: number
  sqft: number
  pricePerNight: number
  images: { url: string; isPrimary: boolean }[]
}

const ADD_ONS = ["Valet Parking", "Security", "Mixologist", "Drivers"]
const EVENT_TYPES = ["Wedding", "Cocktail Party", "Corporate Event", "Birthday Party", "Private Celebration", "Other"]

/* ================================================================== */
/*  Wedding Booking Inquiry Form                                       */
/* ================================================================== */
function WeddingBookingInquiry() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    addOns: [] as string[],
    specialRequests: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggleAddOn = (addon: string) => {
    setForm((f) => ({
      ...f,
      addOns: f.addOns.includes(addon) ? f.addOns.filter((a) => a !== addon) : [...f.addOns, addon],
    }))
  }

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.eventType || !form.eventDate) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/wedding-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guestCount: parseInt(form.guestCount) || 50,
          addOns: form.addOns.join(", "),
        }),
      })
      if (res.ok) setSubmitted(true)
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-xl font-bold text-mist-900 mb-2">Inquiry Submitted!</h3>
        <p className="text-sm text-mist-500">Our team will get back to you within 24 hours.</p>
      </div>
    )
  }

  return (
    <section className="bg-mist-50 py-16 px-4" id="inquiry">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 bg-white rounded-3xl overflow-hidden shadow-sm">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 bg-mist-900 text-white p-8 flex flex-col justify-center space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Have questions or want to book your luxury experience?</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Our team is here to assist you with villas, cars, and VIP events across Los Angeles.
              </p>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-white/60 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Phone</p>
                  <p className="text-sm text-white/70">(310) 555-0991</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-white/60 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Email</p>
                  <p className="text-sm text-white/70">admin@vidivicirental.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-white/60 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Address</p>
                  <p className="text-sm text-white/70">8687 Melrose Ave, Los Angeles CA 90069, United States</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-white/60 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Working Hours</p>
                  <p className="text-sm text-white/70">Mon-Sun: 8 AM – 8 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3 p-8">
            <h2 className="text-2xl font-bold text-mist-900 mb-6">Wedding Booking Inquiry</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-mist-500 block mb-1.5">Full Name</label>
                  <input type="text" placeholder="Enter your full name" value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-mist-500 block mb-1.5">Last Name</label>
                  <input type="text" placeholder="Enter your last name" value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-mist-500 block mb-1.5">Email Address</label>
                  <input type="email" placeholder="Enter your email address" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-mist-500 block mb-1.5">Phone</label>
                  <input type="tel" placeholder="Enter your phone number" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-mist-500 block mb-1.5">Event Type</label>
                  <select value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    className="w-full appearance-none border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 bg-white focus:border-mist-400 focus:outline-none">
                    <option value="">Event Type</option>
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-mist-500 block mb-1.5">Event Date</label>
                  <input type="date" value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 focus:border-mist-400 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-mist-500 block mb-1.5">Number of Guests</label>
                <input type="number" placeholder="e.g. 120" value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                  className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
              </div>

              <div>
                <label className="text-xs font-medium text-mist-500 block mb-1.5">Add-Ons</label>
                <div className="flex flex-wrap gap-3">
                  {ADD_ONS.map((addon) => (
                    <label key={addon} className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        form.addOns.includes(addon) ? "border-blue-600" : "border-mist-300"
                      }`}>
                        {form.addOns.includes(addon) && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      <span className="text-sm text-mist-600">{addon}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-mist-500 block mb-1.5">Special Requests / Notes</label>
                <textarea placeholder="Tell us more about your event ..." value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} rows={3}
                  className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none resize-none" />
              </div>

              <button onClick={handleSubmit} disabled={submitting || !form.firstName || !form.email || !form.eventType || !form.eventDate}
                className="w-full bg-mist-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-mist-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {submitting ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  Villa Card                                                          */
/* ================================================================== */
function WeddingVillaCard({ villa }: { villa: VillaFromAPI }) {
  const [fav, setFav] = useState(false)
  const image = villa.images?.[0]?.url

  const formatSqft = (sqft: number) => sqft >= 1000 ? `${(sqft / 1000).toFixed(1)}k` : sqft.toString()

  return (
    <div className="relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
      <div className="relative h-56 overflow-hidden">
        {image ? (
          <img src={image} alt={villa.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm">No Image</div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setFav((p) => !p) }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            fav ? "bg-red-500 text-white" : "bg-white/75 text-mist-500 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} fill={fav ? "currentColor" : "none"} strokeWidth={2} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
      <div className="flex flex-col gap-2 px-4 pt-3.5 pb-4">
        <p className="text-[10px] text-mist-400 font-medium tracking-wide uppercase truncate">
          Luxury Villa for Rent | {villa.location}
        </p>
        <h3 className="text-[15px] font-semibold text-mist-900 leading-snug -mt-0.5">{villa.name}</h3>
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-mist-400"><BedDouble size={12} /></div>
            <span className="text-[10px] text-mist-400">Bedrooms</span>
            <span className="text-[11px] font-semibold text-mist-700">{villa.bedrooms}</span>
          </div>
          <div className="w-px h-8 bg-mist-100" />
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-mist-400"><Users size={12} /></div>
            <span className="text-[10px] text-mist-400">Guests</span>
            <span className="text-[11px] font-semibold text-mist-700">{villa.guests}</span>
          </div>
          <div className="w-px h-8 bg-mist-100" />
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-mist-400"><Maximize2 size={12} /></div>
            <span className="text-[10px] text-mist-400">Sq.ft</span>
            <span className="text-[11px] font-semibold text-mist-700">{formatSqft(villa.sqft)}</span>
          </div>
        </div>
        <div className="h-px bg-mist-100 mt-0.5" />
        <div className="flex items-center justify-between mt-0.5">
          <Link href={`/villas/${villa.slug}`} className="flex items-center gap-1 text-[11px] font-semibold text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} strokeWidth={2.5} />
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-[15px] font-bold text-mist-900">${villa.pricePerNight.toLocaleString()}</span>
            <span className="text-[10px] text-mist-400">/night</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Main Content                                                        */
/* ================================================================== */
function WeddingVillasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [villas, setVillas] = useState<VillaFromAPI[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const sort = searchParams.get("sort") || "popular"

  const fetchVillas = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const search = searchParams.get("search")
      if (search) params.set("search", search)
      params.set("limit", "12")

      const res = await fetch(`/api/villas?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        let sorted = data.villas || []
        if (sort === "price-asc") sorted.sort((a: VillaFromAPI, b: VillaFromAPI) => a.pricePerNight - b.pricePerNight)
        else if (sort === "price-desc") sorted.sort((a: VillaFromAPI, b: VillaFromAPI) => b.pricePerNight - a.pricePerNight)
        setVillas(sorted)
        setTotal(data.total || 0)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [searchParams, sort])

  useEffect(() => { fetchVillas() }, [fetchVillas])

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", newSort)
    router.push(`/wedding-villas?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero Banner */}
      <Banner
        heading="Celebrate Your Dream Wedding in Style"
        description="Host your dream wedding, cocktail party, or private celebration at our exclusive villas across Los Angeles"
        height="h-[500px]"
        image="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=80"
        searchBar={{
          placeholder: "Search by location or villa name...",
          onSearch: (value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value.trim()) params.set("search", value.trim())
            else params.delete("search")
            router.push(`/wedding-villas?${params.toString()}`)
          },
        }}
      />

      {/* Luxury Wedding Venues Section */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-mist-900 text-center mb-8">
            Luxury Wedding Venues Los Angeles
          </h2>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-mist-200 rounded-xl text-sm text-mist-600 hover:bg-mist-50 transition-colors"
            >
              <SlidersHorizontal size={14} />
              {showFilters ? "Hide Filter" : "Show Filter"}
            </button>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-white border border-mist-200 text-mist-700 text-sm px-3 py-2 rounded-lg focus:border-mist-400 focus:outline-none"
            >
              <option value="popular">Sort by: Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-mist-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : villas.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-mist-400 text-lg mb-2">No wedding venues found</p>
              <p className="text-mist-300 text-sm">Try adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {villas.map((villa) => <WeddingVillaCard key={villa.id} villa={villa} />)}
            </div>
          )}
        </div>
      </section>

      {/* Wedding Booking Inquiry */}
      <WeddingBookingInquiry />

      {/* Reuse existing sections */}
      <WhyChooseUs />
      <Reviews />
      <FAQ />
    </div>
  )
}

export default function WeddingVillasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <WeddingVillasContent />
    </Suspense>
  )
}
