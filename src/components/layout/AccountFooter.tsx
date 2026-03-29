import Link from "next/link"

export default function FooterBottom() {
  return (
    <div className="border-t border-mist-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Left: Copyright + Links */}
        <p className="text-xs text-mist-400 text-center sm:text-left">
          ©2025 <span className="font-semibold text-mist-700">Vidi Vici.</span> All rights reserved.
          {" · "}
          <Link href="/privacy" className="hover:text-mist-700 transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-mist-700 transition-colors">Terms</Link>
          {" · "}
          <Link href="/sitemap" className="hover:text-mist-700 transition-colors">Sitemap</Link>
        </p>

        {/* Right: Payment icons */}
        <div className="flex items-center gap-2">
          {/* Visa */}
          <div className="flex items-center justify-center h-6 px-2 bg-white border border-mist-200 rounded">
            <svg viewBox="0 0 50 16" className="h-3.5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1A1F71">VISA</text>
            </svg>
          </div>

          {/* PayPal */}
          <div className="flex items-center justify-center h-6 px-2 bg-white border border-mist-200 rounded">
            <svg viewBox="0 0 60 16" className="h-3.5 w-auto" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#003087">Pay</text>
              <text x="20" y="13" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#009CDE">Pal</text>
            </svg>
          </div>

          {/* Shop Pay */}
          <div className="flex items-center justify-center h-6 px-2.5 bg-[#5a31f4] rounded">
            <span className="text-white text-[10px] font-bold tracking-tight">shop</span>
          </div>

          {/* Google Pay */}
          <div className="flex items-center justify-center h-6 px-2 bg-white border border-mist-200 rounded">
            <svg viewBox="0 0 52 16" className="h-3.5 w-auto" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="13" fontFamily="Arial" fontSize="10" fill="#4285F4" fontWeight="500">G</text>
              <text x="9" y="13" fontFamily="Arial" fontSize="10" fill="#5F6368" fontWeight="500">Pay</text>
            </svg>
          </div>

          {/* Mastercard */}
          <div className="flex items-center justify-center h-6 w-9 bg-white border border-mist-200 rounded">
            <div className="flex -space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#EB001B] opacity-90" />
              <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-90" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}