"use client"

import { useEffect, useState } from "react"
import { Star, X } from "lucide-react"

export interface ExistingImage {
  id: string
  url: string
  isPrimary: boolean
}

interface Props {
  existingImages: ExistingImage[]
  onExistingChange: (images: ExistingImage[]) => void
  newFiles: File[]
  onNewFilesChange: (files: File[]) => void
  // Index into newFiles that the user has explicitly chosen as primary.
  // null means primary (if any) lives in existingImages.
  newPrimaryIndex?: number | null
  onNewPrimaryIndexChange?: (index: number | null) => void
}

export default function ImageManager({
  existingImages,
  onExistingChange,
  newFiles,
  onNewFilesChange,
  newPrimaryIndex = null,
  onNewPrimaryIndexChange,
}: Props) {
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    const urls = newFiles.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [newFiles])

  const removeExisting = (id: string) => {
    onExistingChange(existingImages.filter((img) => img.id !== id))
  }

  const removeNew = (index: number) => {
    onNewFilesChange(newFiles.filter((_, i) => i !== index))
    if (onNewPrimaryIndexChange && newPrimaryIndex !== null) {
      if (index === newPrimaryIndex) onNewPrimaryIndexChange(null)
      else if (index < newPrimaryIndex) onNewPrimaryIndexChange(newPrimaryIndex - 1)
    }
  }

  const setExistingAsPrimary = (id: string) => {
    onExistingChange(existingImages.map((img) => ({ ...img, isPrimary: img.id === id })))
    onNewPrimaryIndexChange?.(null)
  }

  const setNewAsPrimary = (index: number) => {
    onExistingChange(existingImages.map((img) => ({ ...img, isPrimary: false })))
    onNewPrimaryIndexChange?.(index)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files)
      onNewFilesChange([...newFiles, ...selected])
    }
    e.target.value = ""
  }

  const hasImages = existingImages.length > 0 || newFiles.length > 0
  const supportsPrimary = !!onNewPrimaryIndexChange

  return (
    <div className="bg-white border border-mist-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-mist-900 mb-2">Images</h2>
      {supportsPrimary && hasImages && (
        <p className="text-xs text-mist-500 mb-4">
          The primary image is the thumbnail shown on the website. Click the star to change it.
          By default the first image is primary.
        </p>
      )}

      {hasImages && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {existingImages.map((img) => (
            <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-mist-200">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {img.isPrimary && (
                <span className="absolute top-1 left-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  PRIMARY
                </span>
              )}
              {supportsPrimary && !img.isPrimary && (
                <button
                  type="button"
                  onClick={() => setExistingAsPrimary(img.id)}
                  title="Set as primary"
                  className="absolute bottom-1 left-1 bg-white/90 text-mist-900 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <Star size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeExisting(img.id)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {previews.map((url, i) => {
            const isPrimary = supportsPrimary && newPrimaryIndex === i
            return (
              <div key={`new-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-green-200">
                <img src={url} alt="" className="w-full h-full object-cover" />
                {isPrimary ? (
                  <span className="absolute top-1 left-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    PRIMARY
                  </span>
                ) : (
                  <span className="absolute top-1 left-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                )}
                {supportsPrimary && !isPrimary && (
                  <button
                    type="button"
                    onClick={() => setNewAsPrimary(i)}
                    title="Set as primary"
                    className="absolute bottom-1 left-1 bg-white/90 text-mist-900 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="text-sm text-mist-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-mist-800"
      />
    </div>
  )
}
