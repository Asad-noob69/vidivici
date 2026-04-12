"use client"

import { useEffect, useMemo, useRef, useState } from "react"

interface TimeOption {
  value: string
  label: string
}

interface TimeSelectDropdownProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: TimeOption[]
  disabled?: boolean
  desktop?: boolean
}

export default function TimeSelectDropdown({
  label,
  value,
  onChange,
  options,
  disabled = false,
  desktop = false,
}: TimeSelectDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const selectedLabel = useMemo(
    () => options.find((opt) => opt.value === value)?.label || "",
    [options, value]
  )

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("touchstart", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("touchstart", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  const hasValue = Boolean(value)

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev)
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      className={`w-full appearance-none bg-white border border-mist-300 rounded-md px-3 ${desktop ? "2xl:px-6 2xl:text-xl" : ""} text-sm text-mist-900 focus:outline-none focus:border-mist-400 h-11 2xl:h-16 flex items-end pb-1 2xl:pb-2 text-left ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {selectedLabel}
      </button>

      <span
       className={`pointer-events-none absolute left-3 ${desktop ? "2xl:left-6" : ""} top-1 ${desktop ? "2xl:top-2" : ""} text-[10px] ${desktop ? "2xl:text-sm" : ""} text-mist-400 transition-opacity duration-150 ${hasValue || open ? "opacity-100" : "opacity-0"}`}
      >
        {label}
        

      </span>
      <span
        className={`pointer-events-none absolute left-3 ${desktop ? "2xl:left-6" : ""} top-1/2 -translate-y-1/2 text-sm ${desktop ? "2xl:text-xl" : ""} text-mist-300 transition-opacity duration-150 ${hasValue || open ? "opacity-0" : "opacity-100"}`}
      >

        {label}
      </span>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 2xl:max-h-72 overflow-y-auto rounded-md border border-mist-200 bg-white py-1 shadow-lg ">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`block w-full px-3 py-2 text-left text-sm transition-colors 2xl:text-xl ${
                value === option.value
                  ? "bg-mist-100 text-mist-900"
                  : "text-mist-700 hover:bg-mist-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
