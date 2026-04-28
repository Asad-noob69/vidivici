"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import VillaCard from "@/components/ui/VillaCard";

interface VillaFromAPI {
  id: string;
  name: string;
  slug: string;
  location: string;
  bedrooms: number;
  guests: number;
  sqft: number;
  pricePerNight: number;
  originalPrice?: number | null;
  images: { url: string; isPrimary: boolean }[];
}

const CARD_WIDTH = 240 + 16; // desktop

export default function Villa({ showHeader = true }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [villas, setVillas] = useState<VillaFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVillas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/villas?limit=10&sort=newest");
      if (res.ok) {
        const data = await res.json();
        setVillas(data.villas || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVillas();
  }, [fetchVillas]);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.children[0];
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width + 16
      : CARD_WIDTH;
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollTo = (index) => {
    if (!trackRef.current || villas.length === 0) return;
    const clamped = Math.max(0, Math.min(index, villas.length - 1));

    // Get actual card width dynamically
    const firstCard = trackRef.current.children[0];
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width + 16 // 16 = gap
      : CARD_WIDTH;

    trackRef.current.scrollTo({ left: clamped * cardWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  return (
    <section className="w-full mt-24 2xl:mt-48">
      <div className="">

        {/* Header */}
        {showHeader && (
        <div className="flex items-center justify-between mb-8 px-6 sm:px-16 lg:px-20 2xl:px-32 gap-4 pb-7 ">
          <h2 className="text-2xl sm:text-4xl 2xl:text-5xl font-bold text-mist-900 tracking-tight">
            Luxury Villa Rentals
          </h2>
          <a href="/villas" className="flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 text-sm sm:text-base 2xl:text-xl 2xl:py-4 2xl:px-6 text-mist-500 bg-mist-200 border border-mist-200 rounded-xl hover:bg-mist-50 hover:border-mist-300 transition-all duration-200 whitespace-nowrap">
      View all
      <ArrowUpRight size={15} />
    </a>
        </div>
      )}


        <div className="relative">
         
            <button
              onClick={() => scrollTo(activeIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full 2xl:w-12 2xl:h-12 bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
            >
              <ChevronLeft size={16} strokeWidth={2.5} className="text-mist-700 2xl:w-6 2xl:h-6" />
            </button>

            <button
              onClick={() => scrollTo(activeIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full 2xl:w-12 2xl:h-12 bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
            >
              <ChevronRight size={16} strokeWidth={2.5} className="text-mist-700 2xl:w-6 2xl:h-6" />
            </button>
    


          {/* Carousel Track */}
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex gap-5 px-6 md:px-12 overflow-x-auto pb-2 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              // Loading skeleton cards
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[270px] 2xl:w-[450px] flex-shrink-0 bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="h-56 2xl:h-[300px] bg-mist-100" />
                  <div className="flex flex-col gap-2 2xl:gap-4 px-6 2xl:px-8 pt-3.5 2xl:pt-5 pb-4 2xl:pb-6">
                    <div className="h-3 w-24 bg-mist-100 rounded" />
                    <div className="h-5 w-32 bg-mist-100 rounded" />
                    <div className="flex items-center justify-between py-3">
                      <div className="h-8 w-12 bg-mist-100 rounded" />
                      <div className="h-8 w-px bg-mist-100" />
                      <div className="h-8 w-12 bg-mist-100 rounded" />
                      <div className="h-8 w-px bg-mist-100" />
                      <div className="h-8 w-12 bg-mist-100 rounded" />
                    </div>
                    <div className="h-px bg-mist-100" />
                    <div className="flex items-center justify-between mt-0.5">
                      <div className="h-4 w-20 bg-mist-100 rounded" />
                      <div className="h-5 w-16 bg-mist-100 rounded" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              villas.map((villa) => {
                const primaryImage = villa.images?.[0]?.url;
                return (
                  <VillaCard
                    key={villa.id}
                    image={primaryImage || "/placeholder.jpg"}
                    tag={`Luxury Villa for Rent | ${villa.location} - 2025`}
                    name={villa.name}
                    bedrooms={villa.bedrooms}
                    guests={villa.guests}
                    sqft={villa.sqft?.toString() || "—"}
                    price={`$${villa.pricePerNight.toLocaleString()}`}
                    oldPrice={villa.originalPrice ? `$${villa.originalPrice.toLocaleString()}` : undefined}
                    isFavorited={false}
                  />
                );
              })
            )}
            <div className="w-4 flex-shrink-0" />
          </div>

        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2  mt-10 2xl:mt-16">
          {villas.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${i === activeIndex
               ? "w-6 h-3 bg-mist-800"
                : "w-2 h-2 2xl:w-3 2xl:h-3 bg-mist-300 hover:bg-mist-400"
                }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}