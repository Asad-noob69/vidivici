"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, User, Menu, X } from "lucide-react"

const navLinks = [
  { label: "Cars",   href: "/cars",   hasDropdown: true  },
  { label: "Villas", href: "/villas", hasDropdown: true  },
  { label: "Events", href: "/events", hasDropdown: true  },
  { label: "About",  href: "/about",  hasDropdown: true  },
  { label: "Contact",href: "/contact",hasDropdown: false },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className=" bg-white border-b border-mist-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Left: Nav links (desktop) ───────────────────────── */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-0.5 text-sm text-mist-700 hover:text-mist-900 transition-colors"
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown size={13} className="text-mist-400 mt-0.5" />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Center: Logo ────────────────────────────────────── */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <Image
                src="/Logo 2.png"
                alt="Logo"
                width={44}
                height={44}
                className="object-contain"
              />
            </Link>
          </div>

          {/* ── Right: Actions (desktop) ────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/partner"
              className="text-sm font-medium text-mist-900 bg-mist-200 rounded-lg px-4 py-2 hover:bg-mist-50 transition-colors"
            >
              Become a Partner
            </Link>
            <Link
              href="/reserve"
              className="text-sm font-medium text-white bg-mist-900 rounded-lg px-4 py-2 hover:bg-mist-700 transition-colors"
            >
              Reserve Now
            </Link>
            <Link
              href="/account"
              className="flex items-center justify-center w-9 h-9 text-mist-900 bg-mist-200 rounded-full hover:bg-mist-50 transition-colors"
            >
              <User size={16} className="text-mist-600" />
            </Link>
          </div>

          {/* ── Mobile: Hamburger ───────────────────────────────── */}
          <div className="flex lg:hidden items-center gap-3 ml-auto">
            <Link
              href="/reserve"
              className="text-xs text-white bg-mist-900 rounded-lg px-3 py-2 hover:bg-mist-700 transition-colors"
            >
              Reserve Now
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center w-9 h-9 border border-mist-200 rounded-lg hover:bg-mist-50 transition-colors"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-mist-100 px-4 pb-5 pt-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-3 text-sm text-mist-700 border-b border-mist-50 hover:text-mist-900"
            >
              {link.label}
              {link.hasDropdown && <ChevronDown size={14} className="text-mist-400" />}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/partner"
              className="text-sm text-center text-mist-700 border border-mist-300 rounded-lg px-4 py-2.5 hover:bg-mist-50 transition-colors"
            >
              Become a Partner
            </Link>
            <Link
              href="/account"
              className="flex items-center justify-center gap-2 text-sm text-mist-700 border border-mist-200 rounded-lg px-4 py-2.5 hover:bg-mist-50 transition-colors"
            >
              <User size={15} /> My Account
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}