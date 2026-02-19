"use client";

import { useEffect, useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  Search,
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

export interface FilterValues {
  genres: string[];
  contentTypes: string[];
  categories: string[];
  location: string;
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
  const [location, setLocation] = useState("");

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);

  // Emit filter changes
  useEffect(() => {
    onFilterChange?.({
      genres: selectedGenre,
      contentTypes: selectedContentType,
      categories: selectedCategory,
      location,
      minPrice,
      maxPrice,
    });
  }, [
    selectedGenre,
    selectedContentType,
    selectedCategory,
    location,
    minPrice,
    maxPrice,
    onFilterChange,
  ]);

  const clearAllFilters = () => {
    setSelectedGenre([]);
    setSelectedContentType([]);
    setSelectedCategory([]);
    setLocation("");
    setMinPrice(0);
    setMaxPrice(50000);
    onClearFilters?.();
  };

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

      {/* Location */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Location</p>
        <div className="relative">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search based on location"
            className="w-full rounded-md border border-gray-200 px-3 py-2 pr-10 text-sm outline-none focus:border-green-600"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>
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
