"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart, BedDouble, Users, Maximize2 } from "lucide-react"
import Banner from "@/components/ui/Banner"
import Rentals from "@/components/home/Rentals"
import CarBrowse from "@/components/home/CarBrowse"
import Villa from "@/components/home/Villa"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"

/* ================================================================== */
/*  Match Fixtures Data                                                */
/* ================================================================== */
const FIXTURES = [
  { date: "12 June", matchNo: "M4", stage: "Group Stage (USA opener)", stadium: "LA Stadium" },
  { date: "15 June", matchNo: "M15", stage: "Group Stage", stadium: "LA Stadium" },
  { date: "18 June", matchNo: "M26", stage: "Group Stage", stadium: "LA Stadium" },
  { date: "21 June", matchNo: "M39", stage: "Group Stage", stadium: "LA Stadium" },
  { date: "25 June", matchNo: "M59", stage: "Group Stage (USA)", stadium: "LA Stadium" },
  { date: "28 June", matchNo: "M73", stage: "Round of 32", stadium: "LA Stadium" },
  { date: "2 July", matchNo: "M84", stage: "Round of 32", stadium: "LA Stadium" },
  { date: "10 July", matchNo: "M98", stage: "Quarter-Final", stadium: "LA Stadium" },
]

/* ================================================================== */
/*  Event Card Slider                                                  */
/* ================================================================== */
interface EventFromAPI {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  location: string
  category: string
  images: { url: string; isPrimary: boolean }[]
}

function EventSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [events, setEvents] = useState<EventFromAPI[]>([])
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  useEffect(() => {
    fetch("/api/events?limit=8")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => {})
  }, [])

  const updateScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 5)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateScroll)
    updateScroll()
    return () => el.removeEventListener("scroll", updateScroll)
  }, [events])

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" })
  }

  if (events.length === 0) return null

  return (
    <section className="bg-white py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-mist-900">FIFA World Cup 2026 Events</h2>
          <Link href="/events" className="flex items-center gap-1 text-sm font-semibold text-mist-500 hover:text-mist-900 transition-colors">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="relative">
          {canLeft && (
            <button onClick={() => scroll("left")} className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-mist-200 rounded-full flex items-center justify-center shadow-sm hover:bg-mist-50">
              <ChevronLeft size={16} />
            </button>
          )}
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
            {events.map((event) => {
              const img = event.images?.[0]?.url
              return (
                <div key={event.id} className="flex-shrink-0 w-[270px] bg-white rounded-2xl overflow-hidden border border-mist-100 group">
                  <div className="relative h-44 overflow-hidden">
                    {img ? (
                      <img src={img} alt={event.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-mist-900 mb-1 truncate">{event.name}</h3>
                    {event.shortDescription && <p className="text-[11px] text-mist-400 line-clamp-2 mb-2">{event.shortDescription}</p>}
                    <Link href={`/events/${event.slug}`} className="flex items-center gap-1 text-[11px] font-semibold text-mist-500 hover:text-mist-900 transition-colors">
                      View Details <ArrowUpRight size={11} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
          {canRight && (
            <button onClick={() => scroll("right")} className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-mist-200 rounded-full flex items-center justify-center shadow-sm hover:bg-mist-50">
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  Gallery Bento Grid                                                 */
/* ================================================================== */
const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80", alt: "FIFA World Cup Trophy", className: "col-span-1 row-span-2" },
  { src: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80", alt: "Stadium panorama", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80", alt: "Stadium roof interior", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80", alt: "Fans celebrating", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80", alt: "Stadium crowd", className: "col-span-1 row-span-2" },
  { src: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80", alt: "Football field", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80", alt: "Los Angeles Stadium", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=600&q=80", alt: "Trophy celebration", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80", alt: "Stadium exterior night", className: "col-span-1 row-span-1" },
]

function GalleryBentoGrid() {
  return (
    <section className="bg-white py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-mist-900 text-center mb-10">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] sm:auto-rows-[200px] md:auto-rows-[220px] gap-3">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl group ${img.className}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  Big Image Slider                                                   */
/* ================================================================== */
const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1400&q=80",
    title: "Feel the Energy of LA × World Cup 2026",
    subtitle: "Matches, celebrations, nightlife — enjoy it all with seamless VIP services.",
  },
  {
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1400&q=80",
    title: "VIP Match Day Experiences",
    subtitle: "Premium seating, luxury transport & exclusive lounge access at every game.",
  },
  {
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1400&q=80",
    title: "Luxury Stays for the World Stage",
    subtitle: "Private villas and penthouses minutes from the stadium.",
  },
  {
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80",
    title: "Celebrate Like a Champion",
    subtitle: "After-party planning, club reservations & bottle service — all arranged for you.",
  },
]

function BigImageSlider() {
  const [current, setCurrent] = useState(0)
  const total = HERO_SLIDES.length
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % total)
    }, 5000)
  }, [total])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetTimer])

  const go = (dir: "prev" | "next") => {
    setCurrent((p) => (dir === "prev" ? (p - 1 + total) % total : (p + 1) % total))
    resetTimer()
  }

  return (
    <section className="bg-mist-50 py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Slides wrapper */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {HERO_SLIDES.map((slide, i) => (
              <div key={i} className="w-full flex-shrink-0 relative">
                <div className="relative h-[320px] sm:h-[400px] md:h-[480px]">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight max-w-xl">
                      {slide.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/80 max-w-lg">
                      {slide.subtitle}
                    </p>
                  </div>
                  {/* FIFA badge */}
                  <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-14 h-14 sm:w-16 sm:h-16 bg-white/90 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-[10px] sm:text-xs font-black text-mist-900 leading-tight text-center">
                      FIFA<br />2026
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next buttons */}
          <button
            onClick={() => go("prev")}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="text-mist-800" />
          </button>
          <button
            onClick={() => go("next")}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="text-mist-800" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); resetTimer() }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-5" : "bg-white/50"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  FIFA Page                                                          */
/* ================================================================== */
function FifaContent() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <Banner
        heading="Los Angeles FIFA World Cup 2026"
        description="Exclusive cars, luxury villas, elite nightlife & concierge services for the world's biggest event."
        height="h-[520px]"
        image="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1400&q=80"
        searchBar={{
          placeholder: "Search cars, villas, or events...",
          onSearch: () => {},
        }}
      />

      {/* VIP Journey Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-mist-900 mb-4">Your VIP World Cup Journey Starts Here</h2>
              <div className="space-y-3 text-sm text-mist-600 leading-relaxed">
                <p>
                  Experience the FIFA World Cup 2026 in Los Angeles like never before.
                  Taking place at the world-class <strong>Los Angeles Stadium</strong>, the
                  tournament brings unparalleled energy — and we elevate it with VIP comfort.
                </p>
                <p>
                  From private villas and high-end car rentals to exclusive
                  nightlife and tailored city experiences, our dedicated team
                  ensures every moment is curated to perfection.
                </p>
                <p className="font-medium text-mist-900">
                  Enjoy a seamless, personalized, and truly unforgettable
                  World Cup journey with Vidi Vici.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=700&q=80"
                alt="SoFi Stadium"
                className="w-full h-[320px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Match Fixtures */}
      <section className="bg-mist-50 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-mist-900 text-center mb-2">
            FIFA World Cup 2026&#8482; Fixtures
          </h2>
          <p className="text-center text-sm text-mist-500 mb-8">in Los Angeles</p>
          <div className="bg-white rounded-2xl border border-mist-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-mist-500 border-b border-mist-200">
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Match No.</th>
                  <th className="px-6 py-3.5">Stage</th>
                  <th className="px-6 py-3.5">Stadium</th>
                </tr>
              </thead>
              <tbody>
                {FIXTURES.map((f, i) => (
                  <tr key={i} className="border-b border-mist-100 last:border-0 text-sm">
                    <td className="px-6 py-3.5 text-mist-700">{f.date}</td>
                    <td className="px-6 py-3.5 text-mist-500">{f.matchNo}</td>
                    <td className="px-6 py-3.5 text-mist-700">{f.stage}</td>
                    <td className="px-6 py-3.5 text-mist-500">{f.stadium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Gallery Bento Grid */}
      <GalleryBentoGrid />

      {/* Big Image Slider */}
      <BigImageSlider />

      {/* Car Rentals Slider */}
      <div className="py-4">
        <Rentals showHeader={true} />
      </div>

      {/* Browse by Make & Type */}
      <CarBrowse />

      {/* Villa Slider */}
      <Villa showHeader={true} />

      {/* Event Slider */}
      <EventSlider />

      {/* Why Choose Vidi Vici */}
      <WhyChooseUs />

      {/* Client Testimonials */}
      <Reviews />

      {/* FAQ */}
      <FAQ />

      {/* Contact / Booking Form */}
      <Contact />
    </div>
  )
}

export default function FifaWorldCupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <FifaContent />
    </Suspense>
  )
}
