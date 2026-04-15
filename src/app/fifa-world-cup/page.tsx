"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart, BedDouble, Users, Maximize2 } from "lucide-react"
import Banner from "@/components/ui/Banner"
import Rentals from "@/components/home/Rentals"
import CarBrowse from "@/components/home/CarBrowse"
import Villa from "@/components/home/Villa"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import Services from "@/components/home/Services"
import Events from "@/components/home/Events"

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
      .catch(() => { })
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
    <section className="bg-white py-14 2xl:py-21 px-4 2xl:px-8">
      <div className="max-w-7xl 2xl:max-w-[1840px] mx-auto">
        <div className="flex items-center justify-between mb-6 2xl:mb-12">
          <h2 className="text-2xl 2xl:text-6xl font-bold text-mist-900">FIFA World Cup 2026 Events</h2>
          <Link href="/events" className="flex items-center gap-1 text-sm 2xl:text-2xl font-semibold text-mist-500 hover:text-mist-900 transition-colors">
            View all <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="relative">
          {canLeft && (
            <button onClick={() => scroll("left")} className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 2xl:w-12 2xl:h-12 bg-white border border-mist-200 rounded-full flex items-center justify-center shadow-sm hover:bg-mist-50">
              <ChevronLeft size={16} />
            </button>
          )}
          <div ref={scrollRef} className="flex gap-5 2xl:gap-10 overflow-x-auto scrollbar-hide scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
            {events.map((event) => {
              const img = event.images?.[0]?.url
              return (
                <div key={event.id} className="flex-shrink-0 w-[270px] 2xl:w-[320px] bg-white rounded-2xl overflow-hidden border border-mist-100 group">
                  <div className="relative h-44 2xl:h-52 overflow-hidden">
                    {img ? (
                      <img src={img} alt={event.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-4 2xl:p-6">
                    <h3 className="text-sm 2xl:text-xl font-semibold text-mist-900 mb-1 truncate">{event.name}</h3>
                    {event.shortDescription && <p className="text-[11px] 2xl:text-lg text-mist-400 line-clamp-2 mb-2">{event.shortDescription}</p>}
                    <Link href={`/events/${event.slug}`} className="flex items-center gap-1 text-[11px] 2xl:text-lg font-semibold text-mist-500 hover:text-mist-900 transition-colors">
                      View Details <ArrowUpRight size={11} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
          {canRight && (
            <button onClick={() => scroll("right")} className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 2xl:w-12 2xl:h-12 bg-white border border-mist-200 rounded-full flex items-center justify-center shadow-sm hover:bg-mist-50">
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
  { src: "/fifa2.png", alt: "FIFA World Cup Trophy" },
  { src: "/fifa3.png", alt: "Stadium panorama" },
  { src: "/fifa4.png", alt: "Stadium roof interior" },
  { src: "/fifa5.png", alt: "Fans celebrating" },
  { src: "/fifa6.png", alt: "Stadium crowd" },
  { src: "/fifa7.png", alt: "Football field" },
  { src: "/fifa9.png", alt: "Los Angeles Stadium" },
  { src: "/fifa9.png", alt: "Trophy celebration" },
  { src: "/fifa7.png", alt: "Stadium exterior night" },
]

function GalleryBentoGrid() {
  return (
    <section className="sm:px-16 lg:px-20 2xl:px-32 px-6 mt-24 2xl:mt-48">
      <div className="">
        <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 text-center mb-16 2xl:mb-20">Gallery</h2>

        <div className="
          grid gap-2
          grid-cols-2
          [grid-template-rows:180px_120px_160px]

          sm:grid-cols-[1.2fr_1fr_1fr]
          sm:[grid-template-rows:260px_220px]
          sm:gap-[10px]

          lg:grid-cols-[1fr_1.5fr_1fr]
          lg:[grid-template-rows:300px_220px]
          lg:gap-3

          2xl:grid-cols-[1fr_1.6fr_1fr_1fr]
          2xl:[grid-template-rows:320px_240px]
          2xl:gap-[14px]
        ">

          {/* Image 1 — tall left (Trophy) */}
          <div className="
            overflow-hidden rounded-2xl 2xl:rounded-3xl group
            col-[1] row-[1]
            sm:row-[1/3]
            lg:row-[1]
            2xl:row-[1/3]
          ">
            <img
              src={GALLERY_IMAGES[0].src}
              alt={GALLERY_IMAGES[0].alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Image 2 — tall center hero (Stadium panorama) */}
          <div className="
            overflow-hidden rounded-2xl 2xl:rounded-3xl group
            col-[2] row-[1/3]
            sm:col-[2] sm:row-[1]
            lg:col-[2] lg:row-[1/3]
            2xl:col-[2] 2xl:row-[1]
          ">
            <img
              src={GALLERY_IMAGES[8].src}
              alt={GALLERY_IMAGES[8].alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Image 3 (Stadium roof interior) */}
          <div className="
            overflow-hidden rounded-2xl 2xl:rounded-3xl group
            col-[1] row-[2/4]
            sm:col-[3] sm:row-[1]
            lg:col-[3] lg:row-[1]
            2xl:col-[3] 2xl:row-[1]
          ">
            <img
              src={GALLERY_IMAGES[2].src}
              alt={GALLERY_IMAGES[2].alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Image 4 (Fans celebrating) */}
          <div className="
            overflow-hidden rounded-2xl 2xl:rounded-3xl group
            col-[2] row-[3]
            sm:col-[2] sm:row-[2]
            lg:col-[1] lg:row-[2]
            2xl:col-[4] 2xl:row-[1/3]
          ">
            <img
              src={GALLERY_IMAGES[3].src}
              alt={GALLERY_IMAGES[3].alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Image 5 — hidden on mobile (Stadium crowd) */}
          <div className="
            hidden sm:block
            overflow-hidden rounded-2xl 2xl:rounded-3xl group
            sm:col-[3] sm:row-[2]
            lg:col-[3] lg:row-[2]
            2xl:col-[2] 2xl:row-[2]
          ">
            <img
              src={GALLERY_IMAGES[4].src}
              alt={GALLERY_IMAGES[4].alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Image 6 — 2xl only (Football field) */}
          <div className="
            hidden 2xl:block
            overflow-hidden rounded-2xl 2xl:rounded-3xl group
            2xl:col-[3] 2xl:row-[2]
          ">
            <img
              src={GALLERY_IMAGES[5].src}
              alt={GALLERY_IMAGES[5].alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>



          {/* Image 8 — 2xl only (Trophy celebration) */}
          <div className="
            hidden 2xl:block
            overflow-hidden rounded-2xl 2xl:rounded-3xl group
            2xl:col-[3] 2xl:row-[2]
          ">
            <img
              src={GALLERY_IMAGES[6].src}
              alt={GALLERY_IMAGES[6].alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

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
    image: "/fifa-carousel.png",
    title: "Feel the Energy of LA × World Cup 2026",
    subtitle: "Matches, celebrations, nightlife — enjoy it all with seamless VIP services.",
  },
  {
    image: "/fifa-carousel.png",
    title: "VIP Match Day Experiences",
    subtitle: "Premium seating, luxury transport & exclusive lounge access at every game.",
  },
  {
    image: "/fifa-carousel.png",
    title: "Luxury Stays for the World Stage",
    subtitle: "Private villas and penthouses minutes from the stadium.",
  },
  {
    image: "/fifa-carousel.png",
    title: "Celebrate Like a Champion",
    subtitle: "After-party planning, club reservations & bottle service — all arranged for you.",
  },
]

const services = [
  {
    title: "Exotic Cars",
    description:
      "Unleash the thrill of the world's most powerful machines. From Lamborghinis to Rolls-Royces, your dream car is ready to be delivered to your door.",
    image: "/pic3.png",
    href: "/cars",
  },
  {
    title: "Villas",
    description:
      "Stay in breathtaking LA properties with skyline views, infinity pools, and unmatched comfort. A home that defines prestige.",
    image: "/pic2.png",
    href: "/villas",
  },
  {
    title: "Nightlife & Events",
    description:
      "Step into a world of exclusivity. From elite club access to personalized concierge services — we open the doors to unforgettable nights.",
    image: "/pic1.png",
    href: "/events",
  },
];

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3.5 12.5L12.5 3.5M12.5 3.5H6M12.5 3.5V10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function BigImageSlider() {
  const [current, setCurrent] = useState(0);
  const total = HERO_SLIDES.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % total);
    }, 5000);
  }, [total]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const go = (dir: "prev" | "next") => {
    setCurrent((p) => (dir === "prev" ? (p - 1 + total) % total : (p + 1) % total));
    resetTimer();
  };

  return (
    <section className="overflow-hidden ">
      <div className="relative">

        {/* Main Viewport */}
        <div className="relative overflow-visible sm:px-16 lg:px-20 2xl:px-32 px-6 mt-24 2xl:mt-48">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${current * 85}%)`,
              gap: '16px'
            }}
          >
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={i}
                className={`w-[85%] flex-shrink-0 relative transition-all duration-500 ${
                  i === current ? "scale-100 opacity-100" : "scale-95 opacity-60"
                }`}
              >
                {/* Card */}
                <div className="relative h-[260px] sm:h-[380px] lg:h-[440px] 2xl:h-[600px] rounded-2xl sm:rounded-3xl 2xl:rounded-[2.5rem] overflow-hidden shadow-xl">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-6 sm:bottom-10 2xl:bottom-14 left-6 sm:left-10 2xl:left-14 right-16 sm:right-20 2xl:right-24">
                    <h3 className="text-lg sm:text-2xl lg:text-3xl 2xl:text-5xl font-bold text-white mb-2 2xl:mb-3 tracking-tight leading-tight max-w-xl">
                      {slide.title}
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base 2xl:text-xl text-white/85 max-w-md font-medium">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
         {/* Navigation Buttons */}
           <button
             onClick={() => go("prev")}
             className="absolute left-3 2xl:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 2xl:w-10 2xl:h-10 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all disabled:opacity-20"
           >
             <ChevronLeft className="text-mist-700 w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={2.5} />
           </button>
         
           <button
             onClick={() => go("next")}
             className="absolute right-3 2xl:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 2xl:w-10 2xl:h-10 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all disabled:opacity-20"
           >
             <ChevronRight className="text-mist-700 w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={2.5} />
           </button>

        {/* Dots */}
        <div className="mt-10 2xl:mt-16 flex justify-center gap-2 2xl:gap-4">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); resetTimer(); }}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-5 h-2 2xl:w-7 2xl:h-2.5 bg-mist-900"
          : "w-2 h-2 2xl:w-2.5 2xl:h-2.5 bg-mist-300 hover:bg-mist-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FIFA Page                                                          */
/* ================================================================== */
function FifaContent() {
  const router = useRouter()
  return (
    <div className="bg-white">
      {/* Hero */}
      <Banner
        heading="Los Angeles FIFA World Cup 2026"
        description="Exclusive cars, luxury villas, elite nightlife & concierge services for the world's biggest event."
        height="h-[520px]"
        image="/fifa.png"
        searchBar={{
          placeholder: "Search cars, villas, or events...",
          onSearch: (value: string) => {
            if (value.trim()) router.push(`/cars?search=${encodeURIComponent(value.trim())}`)
          },
        }}
      />

      {/* VIP Journey Section */}
      <section className="sm:px-16 lg:px-20 2xl:px-32 px-6 mt-24 2xl:mt-48">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 2xl:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 mb-4 2xl:mb-10">Your VIP World Cup Journey Starts Here</h2>
              <div className="space-y-3 2xl:space-y-4 text-sm 2xl:text-2xl text-mist-500 leading-relaxed">
                <p>
                  Experience the FIFA World Cup 2026 in Los Angeles like never before.
                  Taking place at the world-class <strong className="text-mist-600">Los Angeles Stadium</strong>, the
                  tournament brings unparalleled energy — and we elevate it with VIP comfort.
                </p>
                <p>
                  From private villas and high-end car rentals to exclusive
                  nightlife and tailored city experiences, our dedicated team
                  ensures every moment is curated to perfection.
                </p>
                <p className="font-normal text-mist-800">
                  Enjoy a seamless, personalized, and truly unforgettable
                  World Cup journey with Vidi Vici.
                </p>
              </div>
            </div>
            <div className="rounded-2xl 2xl:rounded-3xl overflow-hidden">
              <img
                src="/fifa1.png"
                alt="SoFi Stadium"
                loading="lazy"
                className="w-full h-[320px] 2xl:h-[550px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="mt-24 2xl:mt-48">
     <section className="bg-[#f0f0ee] w-full py-16 2xl:py-24 sm:px-16 lg:px-20 px-6 2xl:px-32">
      <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 2xl:gap-40 ">

        {/* Left — heading + subtitle */}
        <div className="w-full lg:w-64 2xl:w-96 shrink-0 lg:pt-6 2xl:pt-8 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold leading-tight text-mist-900 mb-5 2xl:mb-7 mx-auto lg:mx-0">
            Our Luxury Services
          </h2>
          <p className="text-sm 2xl:text-xl text-mist-500 leading-relaxed font-normal max-w-xs mx-auto lg:mx-0">
            Exotic cars, premium villas, and unforgettable nightlife – all curated for your ultimate comfort and style.
          </p>
        </div>

        {/* Right — cards grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 2xl:gap-7">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
            >
             {/* Image */}
<div className="h-48 2xl:h-72 overflow-hidden relative">
  <img
    src={service.image}
    alt={service.title}
    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
  />

  {/* Black overlay */}
  <div className="absolute inset-0 bg-black/50" />

  {/* FIFA logo overlay */}
  <div className="absolute inset-0 flex items-center justify-center">
    <img
      src="/fifa-logo.png"
      alt="FIFA 2026"
      className="w-16 2xl:w-24 h-auto object-contain"
    />
  </div>
</div>

              {/* Body */}
              <div className="p-5 2xl:p-7 flex flex-col flex-1">
                <h3 className="text-base 2xl:text-2xl font-semibold text-mist-900 mb-2 2xl:mb-3">
                  {service.title}
                </h3>
                <p className="text-sm 2xl:text-xl text-mist-500 leading-relaxed font-normal flex-1">
                  {service.description}
                </p>

                {/* Footer */}
                <div className="mt-5 2xl:mt-7 flex items-center justify-end">
                  <span className="flex items-center gap-2 text-sm 2xl:text-lg group-hover:bg-mist-100 py-1 pr-2 pl-4 rounded-full text-mist-800 font-normal cursor-pointer transition-all duration-300">
                    <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-mist-800">
                      View Details
                    </span>
                    <span className="flex items-center justify-center w-8 h-8 2xl:w-11 2xl:h-11 rounded-full bg-mist-900 text-white">
                      <ArrowIcon />
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
      </div>

      {/* FIFA World Cup Fixtures Section */}
      <section className="sm:px-16 lg:px-20 2xl:px-32 px-6 mt-24 2xl:mt-48">
        {/* Header */}
        <div className="text-center mb-12 2xl:mb-24">
          <h2 className="text-3xl sm:text-4xl 2xl:text-6xl  font-bold text-mist-900 mb-8">
            FIFA World Cup 2026™
          </h2>
          <p className="text-xl 2xl:text-3xl text-mist-600 font-medium">Fixtures in Los Angeles</p>
        </div>

        <div className="bg-mist-200 rounded-xl sm:rounded-2xl 2xl:rounded-3xl">

          {/* Desktop Table — hidden on mobile */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-mist-300">
                  <th className="px-6 2xl:px-12 py-5 2xl:py-10 text-base 2xl:text-2xl font-bold text-[#1a1a1a] border-r border-mist-300">Date</th>
                  <th className="px-6 2xl:px-12 py-5 2xl:py-10 text-base 2xl:text-2xl font-bold text-[#1a1a1a] border-r border-mist-300">Match No.</th>
                  <th className="px-6 2xl:px-12 py-5 2xl:py-10 text-base 2xl:text-2xl font-bold text-[#1a1a1a] border-r border-mist-300">Stage</th>
                  <th className="px-6 2xl:px-12 py-5 2xl:py-10 text-base 2xl:text-2xl font-bold text-[#1a1a1a]">Stadium</th>
                </tr>
              </thead>
              <tbody>
                {FIXTURES.map((f, i) => (
                  <tr key={i} className="border-b border-mist-300 last:border-0 hover:bg-mist-100/50 transition-colors">
                    <td className="px-6 2xl:px-12 py-5 2xl:py-10 text-sm 2xl:text-xl font-medium text-mist-700 border-r border-mist-300">{f.date}</td>
                    <td className="px-6 2xl:px-12 py-5 2xl:py-10 text-sm 2xl:text-xl text-mist-500 border-r border-mist-300">{f.matchNo}</td>
                    <td className="px-6 2xl:px-12 py-5 2xl:py-10 text-sm 2xl:text-xl text-mist-600 italic lg:not-italic border-r border-mist-300">{f.stage}</td>
                    <td className="px-6 2xl:px-12 py-5 2xl:py-10 text-sm 2xl:text-xl text-mist-500">{f.stadium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Table — same style as long-term table */}
          <div className="sm:hidden rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mist-300">
                  <th className="text-left px-4 py-3 font-medium text-mist-500 text-xs">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-mist-500 text-xs border-l border-mist-300">Match</th>
                  <th className="text-left px-4 py-3 font-medium text-mist-500 text-xs border-l border-mist-300">Stage</th>
                  <th className="text-left px-4 py-3 font-medium text-mist-500 text-xs border-l border-mist-300">Stadium</th>
                </tr>
              </thead>
              <tbody>
                {FIXTURES.map((f, i) => (
                  <tr key={i} className="border-t border-mist-300">
                    <td className="px-4 py-4 text-sm text-mist-600">{f.date}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-mist-900 border-l border-mist-300">{f.matchNo}</td>
                    <td className="px-4 py-4 text-sm text-mist-600 border-l border-mist-300">{f.stage}</td>
                    <td className="px-4 py-4 text-xs text-mist-500 border-l border-mist-300">{f.stadium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>
      {/* Car Rentals Slider */}
      
      <Rentals showHeader={true} discountBadgeText={undefined} />

      {/* Browse by Make & Type */}
      <CarBrowse />

      <BigImageSlider />

      {/* Villa Slider */}
      <Villa showHeader={true} />

      {/* Event Slider */}
      <Events showHeader={true} />

      {/* Why Choose Vidi Vici */}
      <WhyChooseUs />

      {/* Client Testimonials */}
      <Reviews />

      <GalleryBentoGrid />

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
