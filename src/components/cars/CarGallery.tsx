"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react"

interface CarGalleryProps {
  images: { url: string; alt?: string | null }[]
}

export default function CarGallery({ images }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const thumbsRef = useRef<HTMLDivElement | null>(null)

  const scrollThumbs = (direction: "left" | "right") => {
    const node = thumbsRef.current
    if (!node) return
    const step = Math.max(140, Math.floor(node.clientWidth * 0.7))
    node.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" })
  }

  if (!images || images.length === 0) {
    return (
      <div className="bg-mist-100 rounded-2xl 2xl:rounded-3xl h-96 2xl:h-[520px] flex items-center justify-center">
        <ImageOff size={48} className="text-mist-300" />
      </div>
    )
  }

  return (
    <div>
      <div className="bg-mist-100 rounded-2xl 2xl:rounded-3xl overflow-hidden h-80 sm:h-96 2xl:h-[520px] mb-3 2xl:mb-6">
        <img
          src={images[activeIndex].url}
          alt={images[activeIndex].alt || "Car image"}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollThumbs("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-mist-200 bg-white p-1.5 text-mist-600 shadow-sm transition-colors hover:bg-mist-50 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
            aria-label="Scroll thumbnails left"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={thumbsRef}
            className="mx-7 flex gap-2 2xl:gap-4 overflow-x-auto pb-2 2xl:pb-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-20 h-16 2xl:w-32 2xl:h-24 rounded-xl 2xl:rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                  i === activeIndex ? "border-transparent" : "border-mist-200 hover:border-mist-400"
                } focus:outline-none focus-visible:outline-none focus-visible:ring-0`}
              >
                <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollThumbs("right")}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-mist-200 bg-white p-1.5 text-mist-600 shadow-sm transition-colors hover:bg-mist-50 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
            aria-label="Scroll thumbnails right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
