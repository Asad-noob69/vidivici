import {
  Waves, Bath, Tv, Dumbbell, Wine, Utensils, Car, Wifi,
  AirVent, Flame, TreePine, Shield, Music, Gamepad2,
  Sun, Mountain, Sparkles, BedDouble, Coffee, Umbrella,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const AMENITY_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  waves:    { icon: Waves, label: "Pool / Water" },
  bath:     { icon: Bath, label: "Bath / Hot Tub" },
  tv:       { icon: Tv, label: "TV / Theater" },
  dumbbell: { icon: Dumbbell, label: "Gym" },
  wine:     { icon: Wine, label: "Wine / Bar" },
  utensils: { icon: Utensils, label: "Kitchen" },
  car:      { icon: Car, label: "Parking / Garage" },
  wifi:     { icon: Wifi, label: "WiFi" },
  airvent:  { icon: AirVent, label: "AC / Climate" },
  flame:    { icon: Flame, label: "Fireplace" },
  treepine: { icon: TreePine, label: "Garden" },
  shield:   { icon: Shield, label: "Security" },
  music:    { icon: Music, label: "Music / Sound" },
  gamepad2: { icon: Gamepad2, label: "Gaming" },
  sun:      { icon: Sun, label: "Outdoor / Patio" },
  mountain: { icon: Mountain, label: "View" },
  sparkles: { icon: Sparkles, label: "Luxury" },
  bed:      { icon: BedDouble, label: "Bedroom" },
  coffee:   { icon: Coffee, label: "Coffee / Lounge" },
  umbrella: { icon: Umbrella, label: "Beach / Shade" },
}

export const ICON_KEYS = Object.keys(AMENITY_ICONS)
export const DEFAULT_ICON_KEY = "sparkles"

export function parseAmenity(raw: string): { name: string; iconKey: string } {
  const colonIdx = raw.lastIndexOf(":")
  if (colonIdx > 0) {
    const name = raw.slice(0, colonIdx).trim()
    const key = raw.slice(colonIdx + 1).trim().toLowerCase()
    if (AMENITY_ICONS[key]) return { name, iconKey: key }
  }
  return { name: raw.trim(), iconKey: DEFAULT_ICON_KEY }
}

export function serializeAmenities(items: { name: string; iconKey: string }[]): string {
  return items
    .filter((a) => a.name.trim())
    .map((a) => `${a.name.trim()}:${a.iconKey}`)
    .join(", ")
}
