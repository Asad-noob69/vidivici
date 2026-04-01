"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

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
}

export default function ImageManager({ existingImages, onExistingChange, newFiles, onNewFilesChange }: Props) {
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
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files)
      onNewFilesChange([...newFiles, ...selected])
    }
    e.target.value = ""
  }

  const hasImages = existingImages.length > 0 || newFiles.length > 0

  return (
    <div className="bg-white border border-mist-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-mist-900 mb-4">Images</h2>

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
              <button
                type="button"
                onClick={() => removeExisting(img.id)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {previews.map((url, i) => (
            <div key={`new-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-green-200">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <span className="absolute top-1 left-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                NEW
              </span>
              <button
                type="button"
                onClick={() => removeNew(i)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
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
