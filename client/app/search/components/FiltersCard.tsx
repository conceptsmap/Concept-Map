"use client";

import { useEffect, useState } from "react";
import {
  X,
  SlidersHorizontal,
} from "lucide-react";

const genres = [
  { label: "Romance", value: "ROMANCE" },
  { label: "Crime", value: "CRIME" },
  { label: "Horror", value: "HORROR" },
  { label: "Action", value: "ACTION" },
  { label: "Comedy", value: "COMEDY" },
  { label: "Drama", value: "DRAMA" },
  { label: "Sci-fi", value: "SCI-FI" },
  { label: "Documentary", value: "DOCUMENTARY" },
  { label: "Fantasy", value: "FANTASY" },
  { label: "Historical", value: "HISTORICAL" },
];

const contentTypes = [
  { label: "Script", value: "SCRIPT" },
  { label: "Synopsis", value: "SYNOPSIS" },
  { label: "Storyboard", value: "STORY_BOARD" },
];

const categories = [
  { label: "TVC", value: "TVC" },
  { label: "OTT Series", value: "OTT_SERIES" },
  { label: "Short Form Video", value: "SHORT_FORM_VIDEO" },
];

const countries = [
  { label: "India", value: "India" },
  { label: "United States", value: "United States" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Canada", value: "Canada" },
  { label: "Australia", value: "Australia" },
  { label: "Germany", value: "Germany" },
  { label: "France", value: "France" },
  { label: "Singapore", value: "Singapore" },
  { label: "UAE", value: "UAE" },
];

const STATES_BY_COUNTRY: Record<string, string[]> = {
  India: ["Kerala", "Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Gujarat", "Rajasthan", "West Bengal", "Telangana", "Andhra Pradesh"],
  "United States": ["California", "New York", "Texas", "Florida", "Illinois", "Washington", "Georgia", "Colorado"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
  Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"],
};

export interface FilterValues {
  genres: string[];
  contentTypes: string[];
  categories: string[];
  country: string;
  state: string;
  minPrice: number;
  maxPrice: number;
}

interface FiltersCardProps {
  onFilterChange?: (filters: FilterValues) => void;
  onClearFilters?: () => void;
}

export default function FiltersCard({
  onFilterChange,
  onClearFilters,
}: FiltersCardProps) {
  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);

  // Emit filter changes
  useEffect(() => {
    onFilterChange?.({
      genres: selectedGenre,
      contentTypes: selectedContentType,
      categories: selectedCategory,
      country,
      state,
      minPrice,
      maxPrice,
    });
  }, [
    selectedGenre,
    selectedContentType,
    selectedCategory,
    country,
    state,
    minPrice,
    maxPrice,
    onFilterChange,
  ]);

  const clearAllFilters = () => {
    setSelectedGenre([]);
    setSelectedContentType([]);
    setSelectedCategory([]);
    setCountry("");
    setState("");
    setMinPrice(0);
    setMaxPrice(50000);
    onClearFilters?.();
  };

  const availableStates = country ? STATES_BY_COUNTRY[country] || [] : [];

  const toggleItem = (
    value: string,
    state: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (state.includes(value)) {
      setter(state.filter((v) => v !== value));
    } else {
      setter([...state, value]);
    }
  };

  const Chip = ({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-md border transition ${selected
        ? "bg-green-600 text-white border-green-600"
        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full xl:max-w-75 lg:max-w-56 rounded-2xl bg-white p-5 shadow-md space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 flex items-center">
          <SlidersHorizontal className="h-5 w-5 mr-2" /> Filters
        </h2>
        <button onClick={clearAllFilters}>
          <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {/* Genre */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Genre</p>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <Chip
              key={g.value}
              label={g.label}
              selected={selectedGenre.includes(g.value)}
              onClick={() =>
                toggleItem(g.value, selectedGenre, setSelectedGenre)
              }
            />
          ))}
        </div>
      </div>

      {/* Content Type */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">
          Content Type
        </p>
        <div className="flex flex-wrap gap-2">
          {contentTypes.map((t) => (
            <Chip
              key={t.value}
              label={t.label}
              selected={selectedContentType.includes(t.value)}
              onClick={() =>
                toggleItem(
                  t.value,
                  selectedContentType,
                  setSelectedContentType
                )
              }
            />
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Chip
              key={c.value}
              label={c.label}
              selected={selectedCategory.includes(c.value)}
              onClick={() =>
                toggleItem(c.value, selectedCategory, setSelectedCategory)
              }
            />
          ))}
        </div>
      </div>

      {/* Country */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Country</p>
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setState("");
          }}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-600 bg-white"
        >
          <option value="">All countries</option>
          {countries.map((loc) => (
            <option key={loc.value} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">State</p>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          disabled={!country || availableStates.length === 0}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-600 bg-white disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="">All states</option>
          {availableStates.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Slider */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">
          Price Range
        </p>

        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>₹{minPrice}</span>
          <span>₹{maxPrice}</span>
        </div>

        {/* Min Slider */}
        <input
          type="range"
          min={0}
          max={50000}
          step={1000}
          value={minPrice}
          onChange={(e) =>
            setMinPrice(Math.min(Number(e.target.value), maxPrice - 1000))
          }
          className="w-full accent-green-600 mb-2"
        />

        {/* Max Slider */}
        <input
          type="range"
          min={0}
          max={50000}
          step={1000}
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(Math.max(Number(e.target.value), minPrice + 1000))
          }
          className="w-full accent-green-600"
        />
      </div>
    </div>
  );
}
