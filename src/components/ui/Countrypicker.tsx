"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Country {
  code: string; // lowercase ISO2, used in flagcdn.com URL
  name: string;
  dial: string;
}

export interface CountryPickerProps {
  /** Currently selected country */
  value: Country;
  /** Called when user picks a country */
  onChange: (country: Country) => void;
  /** Show dial code next to flag in trigger (default: true) */
  showDialCode?: boolean;
  /** Placeholder text in search input */
  searchPlaceholder?: string;
  /** Extra class names for the trigger button wrapper */
  className?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
}

// ── Country Data (190+ countries) ─────────────────────────────────────────────
export const COUNTRIES: Country[] = [
  { code: "af", name: "Afghanistan", dial: "+93" },
  { code: "al", name: "Albania", dial: "+355" },
  { code: "dz", name: "Algeria", dial: "+213" },
  { code: "as", name: "American Samoa", dial: "+1-684" },
  { code: "ad", name: "Andorra", dial: "+376" },
  { code: "ao", name: "Angola", dial: "+244" },
  { code: "ag", name: "Antigua and Barbuda", dial: "+1-268" },
  { code: "ar", name: "Argentina", dial: "+54" },
  { code: "am", name: "Armenia", dial: "+374" },
  { code: "au", name: "Australia", dial: "+61" },
  { code: "at", name: "Austria", dial: "+43" },
  { code: "az", name: "Azerbaijan", dial: "+994" },
  { code: "bs", name: "Bahamas", dial: "+1-242" },
  { code: "bh", name: "Bahrain", dial: "+973" },
  { code: "bd", name: "Bangladesh", dial: "+880" },
  { code: "bb", name: "Barbados", dial: "+1-246" },
  { code: "by", name: "Belarus", dial: "+375" },
  { code: "be", name: "Belgium", dial: "+32" },
  { code: "bz", name: "Belize", dial: "+501" },
  { code: "bj", name: "Benin", dial: "+229" },
  { code: "bt", name: "Bhutan", dial: "+975" },
  { code: "bo", name: "Bolivia", dial: "+591" },
  { code: "ba", name: "Bosnia and Herzegovina", dial: "+387" },
  { code: "bw", name: "Botswana", dial: "+267" },
  { code: "br", name: "Brazil", dial: "+55" },
  { code: "bn", name: "Brunei", dial: "+673" },
  { code: "bg", name: "Bulgaria", dial: "+359" },
  { code: "bf", name: "Burkina Faso", dial: "+226" },
  { code: "bi", name: "Burundi", dial: "+257" },
  { code: "cv", name: "Cabo Verde", dial: "+238" },
  { code: "kh", name: "Cambodia", dial: "+855" },
  { code: "cm", name: "Cameroon", dial: "+237" },
  { code: "ca", name: "Canada", dial: "+1" },
  { code: "cf", name: "Central African Republic", dial: "+236" },
  { code: "td", name: "Chad", dial: "+235" },
  { code: "cl", name: "Chile", dial: "+56" },
  { code: "cn", name: "China", dial: "+86" },
  { code: "co", name: "Colombia", dial: "+57" },
  { code: "km", name: "Comoros", dial: "+269" },
  { code: "cd", name: "Congo (DRC)", dial: "+243" },
  { code: "cg", name: "Congo (Republic)", dial: "+242" },
  { code: "cr", name: "Costa Rica", dial: "+506" },
  { code: "hr", name: "Croatia", dial: "+385" },
  { code: "cu", name: "Cuba", dial: "+53" },
  { code: "cy", name: "Cyprus", dial: "+357" },
  { code: "cz", name: "Czech Republic", dial: "+420" },
  { code: "dk", name: "Denmark", dial: "+45" },
  { code: "dj", name: "Djibouti", dial: "+253" },
  { code: "dm", name: "Dominica", dial: "+1-767" },
  { code: "do", name: "Dominican Republic", dial: "+1-809" },
  { code: "ec", name: "Ecuador", dial: "+593" },
  { code: "eg", name: "Egypt", dial: "+20" },
  { code: "sv", name: "El Salvador", dial: "+503" },
  { code: "gq", name: "Equatorial Guinea", dial: "+240" },
  { code: "er", name: "Eritrea", dial: "+291" },
  { code: "ee", name: "Estonia", dial: "+372" },
  { code: "sz", name: "Eswatini", dial: "+268" },
  { code: "et", name: "Ethiopia", dial: "+251" },
  { code: "fj", name: "Fiji", dial: "+679" },
  { code: "fi", name: "Finland", dial: "+358" },
  { code: "fr", name: "France", dial: "+33" },
  { code: "ga", name: "Gabon", dial: "+241" },
  { code: "gm", name: "Gambia", dial: "+220" },
  { code: "ge", name: "Georgia", dial: "+995" },
  { code: "de", name: "Germany", dial: "+49" },
  { code: "gh", name: "Ghana", dial: "+233" },
  { code: "gr", name: "Greece", dial: "+30" },
  { code: "gd", name: "Grenada", dial: "+1-473" },
  { code: "gt", name: "Guatemala", dial: "+502" },
  { code: "gn", name: "Guinea", dial: "+224" },
  { code: "gw", name: "Guinea-Bissau", dial: "+245" },
  { code: "gy", name: "Guyana", dial: "+592" },
  { code: "ht", name: "Haiti", dial: "+509" },
  { code: "hn", name: "Honduras", dial: "+504" },
  { code: "hk", name: "Hong Kong", dial: "+852" },
  { code: "hu", name: "Hungary", dial: "+36" },
  { code: "is", name: "Iceland", dial: "+354" },
  { code: "in", name: "India", dial: "+91" },
  { code: "id", name: "Indonesia", dial: "+62" },
  { code: "ir", name: "Iran", dial: "+98" },
  { code: "iq", name: "Iraq", dial: "+964" },
  { code: "ie", name: "Ireland", dial: "+353" },
  { code: "il", name: "Israel", dial: "+972" },
  { code: "it", name: "Italy", dial: "+39" },
  { code: "jm", name: "Jamaica", dial: "+1-876" },
  { code: "jp", name: "Japan", dial: "+81" },
  { code: "jo", name: "Jordan", dial: "+962" },
  { code: "kz", name: "Kazakhstan", dial: "+7" },
  { code: "ke", name: "Kenya", dial: "+254" },
  { code: "ki", name: "Kiribati", dial: "+686" },
  { code: "kw", name: "Kuwait", dial: "+965" },
  { code: "kg", name: "Kyrgyzstan", dial: "+996" },
  { code: "la", name: "Laos", dial: "+856" },
  { code: "lv", name: "Latvia", dial: "+371" },
  { code: "lb", name: "Lebanon", dial: "+961" },
  { code: "ls", name: "Lesotho", dial: "+266" },
  { code: "lr", name: "Liberia", dial: "+231" },
  { code: "ly", name: "Libya", dial: "+218" },
  { code: "li", name: "Liechtenstein", dial: "+423" },
  { code: "lt", name: "Lithuania", dial: "+370" },
  { code: "lu", name: "Luxembourg", dial: "+352" },
  { code: "mo", name: "Macau", dial: "+853" },
  { code: "mg", name: "Madagascar", dial: "+261" },
  { code: "mw", name: "Malawi", dial: "+265" },
  { code: "my", name: "Malaysia", dial: "+60" },
  { code: "mv", name: "Maldives", dial: "+960" },
  { code: "ml", name: "Mali", dial: "+223" },
  { code: "mt", name: "Malta", dial: "+356" },
  { code: "mh", name: "Marshall Islands", dial: "+692" },
  { code: "mr", name: "Mauritania", dial: "+222" },
  { code: "mu", name: "Mauritius", dial: "+230" },
  { code: "mx", name: "Mexico", dial: "+52" },
  { code: "fm", name: "Micronesia", dial: "+691" },
  { code: "md", name: "Moldova", dial: "+373" },
  { code: "mc", name: "Monaco", dial: "+377" },
  { code: "mn", name: "Mongolia", dial: "+976" },
  { code: "me", name: "Montenegro", dial: "+382" },
  { code: "ma", name: "Morocco", dial: "+212" },
  { code: "mz", name: "Mozambique", dial: "+258" },
  { code: "mm", name: "Myanmar", dial: "+95" },
  { code: "na", name: "Namibia", dial: "+264" },
  { code: "nr", name: "Nauru", dial: "+674" },
  { code: "np", name: "Nepal", dial: "+977" },
  { code: "nl", name: "Netherlands", dial: "+31" },
  { code: "nz", name: "New Zealand", dial: "+64" },
  { code: "ni", name: "Nicaragua", dial: "+505" },
  { code: "ne", name: "Niger", dial: "+227" },
  { code: "ng", name: "Nigeria", dial: "+234" },
  { code: "kp", name: "North Korea", dial: "+850" },
  { code: "mk", name: "North Macedonia", dial: "+389" },
  { code: "no", name: "Norway", dial: "+47" },
  { code: "om", name: "Oman", dial: "+968" },
  { code: "pk", name: "Pakistan", dial: "+92" },
  { code: "pw", name: "Palau", dial: "+680" },
  { code: "pa", name: "Panama", dial: "+507" },
  { code: "pg", name: "Papua New Guinea", dial: "+675" },
  { code: "py", name: "Paraguay", dial: "+595" },
  { code: "pe", name: "Peru", dial: "+51" },
  { code: "ph", name: "Philippines", dial: "+63" },
  { code: "pl", name: "Poland", dial: "+48" },
  { code: "pt", name: "Portugal", dial: "+351" },
  { code: "pr", name: "Puerto Rico", dial: "+1-787" },
  { code: "qa", name: "Qatar", dial: "+974" },
  { code: "ro", name: "Romania", dial: "+40" },
  { code: "ru", name: "Russia", dial: "+7" },
  { code: "rw", name: "Rwanda", dial: "+250" },
  { code: "kn", name: "Saint Kitts and Nevis", dial: "+1-869" },
  { code: "lc", name: "Saint Lucia", dial: "+1-758" },
  { code: "vc", name: "Saint Vincent and the Grenadines", dial: "+1-784" },
  { code: "ws", name: "Samoa", dial: "+685" },
  { code: "sm", name: "San Marino", dial: "+378" },
  { code: "st", name: "Sao Tome and Principe", dial: "+239" },
  { code: "sa", name: "Saudi Arabia", dial: "+966" },
  { code: "sn", name: "Senegal", dial: "+221" },
  { code: "rs", name: "Serbia", dial: "+381" },
  { code: "sc", name: "Seychelles", dial: "+248" },
  { code: "sl", name: "Sierra Leone", dial: "+232" },
  { code: "sg", name: "Singapore", dial: "+65" },
  { code: "sk", name: "Slovakia", dial: "+421" },
  { code: "si", name: "Slovenia", dial: "+386" },
  { code: "sb", name: "Solomon Islands", dial: "+677" },
  { code: "so", name: "Somalia", dial: "+252" },
  { code: "za", name: "South Africa", dial: "+27" },
  { code: "kr", name: "South Korea", dial: "+82" },
  { code: "ss", name: "South Sudan", dial: "+211" },
  { code: "es", name: "Spain", dial: "+34" },
  { code: "lk", name: "Sri Lanka", dial: "+94" },
  { code: "sd", name: "Sudan", dial: "+249" },
  { code: "sr", name: "Suriname", dial: "+597" },
  { code: "se", name: "Sweden", dial: "+46" },
  { code: "ch", name: "Switzerland", dial: "+41" },
  { code: "sy", name: "Syria", dial: "+963" },
  { code: "tw", name: "Taiwan", dial: "+886" },
  { code: "tj", name: "Tajikistan", dial: "+992" },
  { code: "tz", name: "Tanzania", dial: "+255" },
  { code: "th", name: "Thailand", dial: "+66" },
  { code: "tl", name: "Timor-Leste", dial: "+670" },
  { code: "tg", name: "Togo", dial: "+228" },
  { code: "to", name: "Tonga", dial: "+676" },
  { code: "tt", name: "Trinidad and Tobago", dial: "+1-868" },
  { code: "tn", name: "Tunisia", dial: "+216" },
  { code: "tr", name: "Turkey", dial: "+90" },
  { code: "tm", name: "Turkmenistan", dial: "+993" },
  { code: "tv", name: "Tuvalu", dial: "+688" },
  { code: "ug", name: "Uganda", dial: "+256" },
  { code: "ua", name: "Ukraine", dial: "+380" },
  { code: "ae", name: "United Arab Emirates", dial: "+971" },
  { code: "gb", name: "United Kingdom", dial: "+44" },
  { code: "us", name: "United States", dial: "+1" },
  { code: "uy", name: "Uruguay", dial: "+598" },
  { code: "uz", name: "Uzbekistan", dial: "+998" },
  { code: "vu", name: "Vanuatu", dial: "+678" },
  { code: "ve", name: "Venezuela", dial: "+58" },
  { code: "vn", name: "Vietnam", dial: "+84" },
  { code: "ye", name: "Yemen", dial: "+967" },
  { code: "zm", name: "Zambia", dial: "+260" },
  { code: "zw", name: "Zimbabwe", dial: "+263" },
];

/** Default country — United States */
export const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.code === "us")!;

/** Returns a flagcdn.com PNG URL for a given ISO2 country code */
export function getFlagUrl(code: string, size: 20 | 40 | 80 | 160 = 40) {
  return `https://flagcdn.com/w${size}/${code.toLowerCase()}.png`;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function CountryPicker({
  value,
  onChange,
  showDialCode = true,
  searchPlaceholder = "Search country or dial code…",
  className = "",
  disabled = false,
}: CountryPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search when opened
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
  }, [open]);

  return (
    <div ref={ref} className={`relative flex-shrink-0 ${className}`}>
      {/* ── Trigger ── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-3 2xl:px-5 2xl:py-5 border-r border-mist-300 bg-mist-50 hover:bg-mist-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 h-full select-none rounded-l-xl 2xl:rounded-l-2xl"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Selected country: ${value.name}`}
      >
        <img
          src={getFlagUrl(value.code)}
          alt={value.name}
          width={24}
          height={16}
          className="w-6 h-4 2xl:w-8 2xl:h-5 object-cover rounded-[3px] shadow-sm flex-shrink-0"
        />
        {showDialCode && (
          <span className="text-xs 2xl:text-sm text-mist-600 font-medium hidden sm:inline whitespace-nowrap">
            {value.dial}
          </span>
        )}
        <ChevronDown
          className={`w-3 h-3 2xl:w-4 2xl:h-4 text-mist-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-72 2xl:w-96 bg-white border border-mist-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search bar */}
          <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-mist-100 bg-mist-50 sticky top-0">
            <Search className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-mist-400 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 text-xs 2xl:text-sm text-mist-800 bg-transparent outline-none placeholder-mist-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-mist-400 hover:text-mist-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Country list */}
          <ul
            role="listbox"
            aria-label="Countries"
            className="max-h-64 2xl:max-h-80 overflow-y-auto divide-y divide-mist-50"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-5 text-xs text-mist-400 text-center">
                No countries found
              </li>
            ) : (
              filtered.map((c) => {
                const isSelected = c.code === value.code;
                return (
                  <li key={c.code} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(c);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 2xl:py-3 text-left transition-colors duration-100 ${
                        isSelected ? "bg-mist-100" : "hover:bg-mist-50"
                      }`}
                    >
                      <img
                        src={getFlagUrl(c.code)}
                        alt={c.name}
                        width={24}
                        height={16}
                        loading="lazy"
                        className="w-6 h-4 2xl:w-8 2xl:h-5 object-cover rounded-[3px] shadow-sm flex-shrink-0"
                      />
                      <span className="flex-1 text-xs 2xl:text-sm text-mist-700 truncate">
                        {c.name}
                      </span>
                      <span className="text-xs 2xl:text-sm text-mist-400 font-medium flex-shrink-0">
                        {c.dial}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-mist-600 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-mist-100 bg-mist-50 text-[10px] 2xl:text-xs text-mist-400 text-right">
            {filtered.length} of {COUNTRIES.length} countries
          </div>
        </div>
      )}
    </div>
  );
}