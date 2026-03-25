"use client";

import { Search } from "lucide-react";
import { ReactNode, FormEvent } from "react";

interface SearchBarConfig {
  placeholder?: string;
  buttonLabel?: string;
  onSearch?: (value: string) => void;
  renderCustom?: () => ReactNode;
}

interface BannerProps {
  heading: string;
  description?: string | false;
  image?: string;
  height?: string;
  overlay?: string;
  searchBar?: SearchBarConfig | false;
}

interface DefaultSearchBarProps {
  placeholder?: string;
  buttonLabel?: string;
  onSearch?: (value: string) => void;
}

function DefaultSearchBar({
  placeholder = "Search...",
  buttonLabel = "Search",
  onSearch,
}: DefaultSearchBarProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("search") as HTMLInputElement;
    onSearch?.(input.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white rounded-full shadow-lg overflow-hidden w-full max-w-lg mx-auto"
    >
      <div className="flex items-center gap-2 flex-1 px-4 py-2.5">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          name="search"
          placeholder={placeholder}
          className="flex-1 text-[13px] text-gray-800 outline-none placeholder-gray-400 bg-transparent"
        />
      </div>
      <button
        type="submit"
        className="bg-gray-900 text-white text-[13px] font-semibold px-5 py-2.5 hover:bg-gray-700 transition-colors duration-200 flex-shrink-0"
      >
        {buttonLabel}
      </button>
    </form>
  );
}

export default function Banner({
  heading,
  description = false,
  image = "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=80",
  height = "h-64",
  searchBar = false,
}: BannerProps) {
  return (
    <div className={`relative w-full ${height} flex items-center justify-center overflow-hidden`}>
      {/* Background image */}
      <img
        src={image}
        alt={heading}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-2xl mx-auto gap-3">
        <h1 className="text-3xl sm:text-5xl text-white tracking-tight drop-shadow-md font-medium">
          {heading}
        </h1>

        {description !== false && description && (
          <p className="text-sm text-white/70 leading-relaxed max-w-md">
            {description}
          </p>
        )}

        {searchBar !== false && (
          <div className="w-full mt-2">
            {searchBar.renderCustom ? (
              searchBar.renderCustom()
            ) : (
              <DefaultSearchBar
                placeholder={searchBar.placeholder}
                buttonLabel={searchBar.buttonLabel}
                onSearch={searchBar.onSearch}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}