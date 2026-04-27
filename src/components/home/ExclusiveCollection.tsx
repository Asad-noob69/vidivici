"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "@/components/ui/CarCard";
import EventCard from "@/components/ui/EventCard";
import VillaCard from "@/components/ui/VillaCard";

type CollectionTab = "All" | "Cars" | "Villas" | "Events";

interface CarFromAPI {
  id: string;
  name: string;
  slug: string;
  pricePerDay: number;
  originalPrice?: number | null;
  seats: number;
  horsepower: number | null;
  acceleration: string | null;
  brand: { name: string; slug: string };
  images: { url: string; isPrimary: boolean }[];
}

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

interface EventFromAPI {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  location: string;
  category: string;
  images: { url: string; isPrimary: boolean }[];
}

export default function ExclusiveCollection() {
  const [activeTab, setActiveTab] = useState<CollectionTab>("Cars");
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [cars, setCars] = useState<CarFromAPI[]>([]);
  const [villas, setVillas] = useState<VillaFromAPI[]>([]);
  const [events, setEvents] = useState<EventFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [carsRes, villasRes, eventsRes] = await Promise.all([
        fetch("/api/cars?limit=10"),
        fetch("/api/villas?limit=10"),
        fetch("/api/events?limit=10"),
      ]);

      const [carsData, villasData, eventsData] = await Promise.all([
        carsRes.ok ? carsRes.json() : Promise.resolve({ cars: [] }),
        villasRes.ok ? villasRes.json() : Promise.resolve({ villas: [] }),
        eventsRes.ok ? eventsRes.json() : Promise.resolve({ events: [] }),
      ]);

      setCars(carsData.cars || []);
      setVillas(villasData.villas || []);
      setEvents(eventsData.events || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetAndSetTab = (tab: CollectionTab) => {
    setActiveTab(tab);
    setActiveIndex(0);
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const getCardCount = () => {
    if (activeTab === "Cars") return cars.length;
    if (activeTab === "Villas") return villas.length;
    if (activeTab === "Events") return events.length;
    return cars.length + villas.length + events.length;
  };

  const maxIndex = Math.max(0, getCardCount() - 1);

  const getCardWidth = () => {
    if (!trackRef.current) return 300;
    const firstCard = trackRef.current.children[0] as HTMLElement | null;
    return firstCard ? firstCard.getBoundingClientRect().width + 20 : 300;
  };

  const scrollTo = (index: number) => {
    if (!trackRef.current) return;
    const clamped = Math.max(0, Math.min(index, getCardCount() - 1));
    const cardWidth = getCardWidth();
    trackRef.current.scrollTo({ left: clamped * cardWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  const onTrackScroll = () => {
    if (!trackRef.current) return;
    const cardWidth = getCardWidth();
    setActiveIndex(Math.round(trackRef.current.scrollLeft / cardWidth));
  };

  const renderCards = () => {
    if (loading) {
      return Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-[270px] 2xl:w-[450px] flex-shrink-0 bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse"
        >
          <div className="h-56 2xl:h-[300px] bg-mist-100" />
          <div className="flex flex-col gap-2 2xl:gap-4 px-6 2xl:px-8 pt-3.5 2xl:pt-5 pb-4 2xl:pb-6">
            <div className="h-3 w-16 bg-mist-100 rounded" />
            <div className="h-5 w-32 bg-mist-100 rounded" />
            <div className="h-px bg-mist-100" />
            <div className="flex items-center justify-between mt-0.5">
              <div className="h-4 w-20 bg-mist-100 rounded" />
              <div className="h-5 w-16 bg-mist-100 rounded" />
            </div>
          </div>
        </div>
      ));
    }

    if (activeTab === "Cars") {
      return cars.map((car) => {
        const primaryImage = car.images?.[0]?.url;
        return (
          <CarCard
            key={`car-${car.id}`}
            car={{
              id: car.id,
              name: car.name,
              slug: car.slug,
              image: primaryImage || "/placeholder.jpg",
              brand: car.brand?.name || "",
              seats: car.seats?.toString() || "—",
              zeroToSixty: car.acceleration || "—",
              engine: car.horsepower ? `${car.horsepower} hp` : "—",
              pricePerDay: car.pricePerDay,
              originalPrice: car.originalPrice?.toString(),
              liked: false,
            }}
          />
        );
      });
    }
    if (activeTab === "Villas") {
      return villas.map((villa) => {
        const primaryImage = villa.images?.[0]?.url;
        return (
          <VillaCard
            key={`villa-${villa.id}`}
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
      });
    }
    if (activeTab === "Events") {
      return events.map((event) => {
        const primaryImage = event.images?.[0]?.url;
        return (
          <EventCard
            key={`event-${event.id}`}
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
        );
      });
    }

    return [
      ...cars.map((car) => {
        const primaryImage = car.images?.[0]?.url;
        return (
          <CarCard
            key={`all-car-${car.id}`}
            car={{
              id: car.id,
              name: car.name,
              slug: car.slug,
              image: primaryImage || "/placeholder.jpg",
              brand: car.brand?.name || "",
              seats: car.seats?.toString() || "—",
              zeroToSixty: car.acceleration || "—",
              engine: car.horsepower ? `${car.horsepower} hp` : "—",
              pricePerDay: car.pricePerDay,
              originalPrice: car.originalPrice?.toString(),
              liked: false,
            }}
          />
        );
      }),
      ...villas.map((villa) => {
        const primaryImage = villa.images?.[0]?.url;
        return (
          <VillaCard
            key={`all-villa-${villa.id}`}
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
      }),
      ...events.map((event) => {
        const primaryImage = event.images?.[0]?.url;
        return (
          <EventCard
            key={`all-event-${event.id}`}
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
        );
      }),
    ];
  };

  return (
    <section className="w-full mt-24 2xl:mt-48  overflow-hidden">
      <div className="px-6 sm:px-16 lg:px-20 2xl:px-40">
        <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 text-center mb-8 2xl:mb-12">Our Exclusive Collection</h2>

        <div className="flex items-center justify-center gap-2 mb-8 2xl:mb-12">
          {(["All", "Cars", "Villas", "Events"] as CollectionTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => resetAndSetTab(tab)}
              className={`px-5 2xl:px-8 py-2 2xl:py-3 rounded-lg text-sm 2xl:text-xl transition-colors ${
                activeTab === tab
                  ? "bg-[#1f1f1f] text-white"
                  : "bg-[#e8e8e8] text-mist-600 hover:bg-[#dddddd]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => scrollTo(activeIndex - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
        >
          <ChevronLeft size={16} className="text-mist-700" />
        </button>

        <button
          onClick={() => scrollTo(activeIndex + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
        >
          <ChevronRight size={16} className="text-mist-700" />
        </button>

        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="flex gap-5 px-6 md:px-12 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {renderCards()}
          <div className="w-6 shrink-0" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2  mt-10 2xl:mt-16">
        {Array.from({ length: getCardCount() }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === Math.min(activeIndex, maxIndex)
                ? "w-6 h-3 bg-mist-800"
                : "w-2 h-2 2xl:w-3 2xl:h-3 bg-mist-300 hover:bg-mist-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
