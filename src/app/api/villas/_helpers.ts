export type ImageInput = string | { url: string; isPrimary?: boolean }

export function normalizeImages(images: ImageInput[]): { url: string; isPrimary: boolean }[] {
  const normalized = images.map((img, i) =>
    typeof img === 'string'
      ? { url: img, isPrimary: i === 0 }
      : { url: img.url, isPrimary: !!img.isPrimary }
  )
  if (normalized.length > 0 && !normalized.some((img) => img.isPrimary)) {
    normalized[0].isPrimary = true
  }
  return normalized
}
