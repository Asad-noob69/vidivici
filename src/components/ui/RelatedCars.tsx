"use client";
import { useRef, useState, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "@/components/ui/CarCard";

const CARD_WIDTH = 270 + 20;

export default function ExoticCarRentals({ showHeader = true, discountBadgeText = undefined }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/cars?limit=8")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.cars) ? data.cars : [];
        setCars(
          list.map((c: any) => ({
            id: c.id,
            brand: c.brand?.name ?? "",
            name: c.name,
            image: c.images?.[0]?.url ?? "",
            seats: c.seats ? String(c.seats) : "-",
            zeroToSixty: c.acceleration ?? "-",
            engine: c.horsepower ? `${c.horsepower} hp` : "-",
            pricePerDay: c.pricePerDay,
            originalPrice: c.originalPrice ? String(c.originalPrice) : undefined,
            slug: c.slug,
            liked: false,
          }))
        );
      })
      .catch(() => {/* silently keep empty */});
  }, []);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.children[0];
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width + 20
      : CARD_WIDTH;
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const CARD_WIDTH = 270 + 20; // desktop

  const scrollTo = (index) => {
    if (!trackRef.current) return;
    const clamped = Math.max(0, Math.min(index, cars.length - 1));

    // Get actual card width dynamically
    const firstCard = trackRef.current.children[0];
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width + 20 // 20 = gap
      : CARD_WIDTH;

    trackRef.current.scrollTo({ left: clamped * cardWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  return (
    <section className="bg-white w-full overflow-hidden">

      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-8 sm:px-16 lg:px-20 px-6 2xl:px-32 gap-4 pb-7">
          <h2 className="text-2xl sm:text-4xl 2xl:text-5xl font-bold text-mist-900 tracking-tight">
            Exotic Car Rentals
          </h2>

          <button className="flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 text-sm sm:text-base 2xl:text-xl 2xl:py-4 2xl:px-6 text-mist-500 bg-mist-200 border border-mist-200 rounded-xl hover:bg-mist-50 hover:border-mist-300 transition-all duration-200 whitespace-nowrap">
            View all
            <ArrowUpRight size={15} />
          </button>
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


        {/* Carousel track */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex gap-5 px-6 md:px-12 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {cars.map((car) => (
            <CarCard key={car.id} car={car} discountBadgeText={discountBadgeText} />
          ))}
          <div className="w-6 shrink-0" />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-10 2xl:mt-16">
        {cars.map((_, i) => (
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