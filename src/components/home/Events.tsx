"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "@/components/ui/EventCard";
import Link from "next/link";

interface EventFromAPI {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  location: string;
  category: string;
  capacity: number;
  images: { url: string; isPrimary: boolean }[];
}

const CARD_WIDTH = 270 + 20;

export default function ExclusiveNightlife({ showHeader = true }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrolling = useRef(false);
  const [events, setEvents] = useState<EventFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events?limit=10");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const originalLength = events.length;
  const shouldLoop = events.length >= 4;
  const repeatedEvents = shouldLoop ? [...events, ...events, ...events] : events;

  const handleScroll = () => {
    if (!trackRef.current || isScrolling.current) return;
    const el = trackRef.current;
    const singleSetWidth = el.scrollWidth / 3;

    if (el.scrollLeft >= singleSetWidth * 2 - 10) {
      isScrolling.current = true;
      el.scrollLeft = el.scrollLeft - singleSetWidth;
      setActiveIndex((prev) => (prev >= originalLength - 1 ? 0 : prev + 1));
      requestAnimationFrame(() => { isScrolling.current = false; });
    } else if (el.scrollLeft <= 10) {
      isScrolling.current = true;
      el.scrollLeft = el.scrollLeft + singleSetWidth;
      setActiveIndex((prev) => (prev <= 0 ? originalLength - 1 : prev - 1));
      requestAnimationFrame(() => { isScrolling.current = false; });
    } else {
      const cardWidth = el.firstElementChild
        ? (el.firstElementChild as HTMLElement).getBoundingClientRect().width + 20
        : CARD_WIDTH;
      setActiveIndex(Math.round((el.scrollLeft % singleSetWidth) / cardWidth));
    }
  };

  const scrollTo = (index: number) => {
    if (!trackRef.current || events.length === 0) return;
    const el = trackRef.current;
    const singleSetWidth = el.scrollWidth / 3;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).getBoundingClientRect().width + 20
      : CARD_WIDTH;

    let target = index;
    if (target < 0) target = originalLength - 1;
    if (target >= originalLength) target = 0;

    setActiveIndex(target);
    el.scrollTo({ left: singleSetWidth + target * cardWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (!trackRef.current || events.length === 0) return;
    const el = trackRef.current;
    const singleSetWidth = el.scrollWidth / 3;
    el.scrollLeft = singleSetWidth;
  }, [events.length]);

  return (
    <section className="bg-white w-full mt-24 2xl:mt-48 overflow-hidden">

      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-8 px-6 sm:px-16 lg:px-20 2xl:px-32 gap-4 pb-7">
          <h2 className="text-2xl sm:text-4xl 2xl:text-5xl font-bold text-mist-900 tracking-tight w-xl">
            Exclusive Nightlife & VIP Experiences
          </h2>
          <Link href="/events" className="flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 text-sm sm:text-base 2xl:text-xl 2xl:py-4 2xl:px-6 text-mist-500 bg-mist-200 border border-mist-200 rounded-xl hover:bg-mist-50 hover:border-mist-300 transition-all duration-200 whitespace-nowrap">
            View all
            <ArrowUpRight size={15} />
          </Link>
        </div>
      )}

      <div className="relative">
        {/* Left Arrow */}

        {/* Right Arrow */}
        <button
          onClick={() => scrollTo(activeIndex + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full 2xl:w-12 2xl:h-12 bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
        >
          <ChevronRight size={16} strokeWidth={2.5} className="text-mist-700  2xl:w-6 2xl:h-6" />
        </button>

        {/* Carousel track */}
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
                  <div className="h-4 w-full bg-mist-100 rounded" />
                  <div className="h-px bg-mist-100" />
                  <div className="flex items-center justify-between mt-0.5">
                    <div className="h-4 w-20 bg-mist-100 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            repeatedEvents.map((event, i) => {
              const primaryImage = event.images?.[0]?.url;
              return (
                <div key={`${event.id}-${i}`} className="shrink-0">
                  <EventCard
                    event={{
                      id: event.id,
                      name: event.name,
                      slug: event.slug,
                      image: primaryImage || "/placeholder.jpg",
                      venue: event.location || event.category || "VIP Experience",
                      description: event.shortDescription || "",
                      liked: false,
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2  mt-10 2xl:mt-16">
        {events.map((_, i) => (
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

    </section>
  );
}