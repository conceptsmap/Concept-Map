"use client";

import { useEffect, useState } from "react";
import { X, ChevronDown, ChevronUp, Search } from "lucide-react";

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

const occasions = [
  { label: "Festival", value: "FESTIVAL" },
  { label: "Sale", value: "SALE" },
  { label: "Launch", value: "LAUNCH" },
  { label: "Back to School", value: "BACK_TO_SCHOOL" },
  { label: "National Days", value: "NATIONAL_DAYS" },
  { label: "Auspicious Date", value: "AUSPICIOUS_DATE" },
  { label: "Season", value: "SEASON" },
];

const licenceTypes = [
  { label: "Exclusive Licence", value: "EXCLUSIVE_LICENCE" },
  { label: "Basic / Exclusive Rights", value: "BASIC_EXCLUSIVE_RIGHTS" },
  { label: "Standard / Exclusive", value: "STANDARD_EXCLUSIVE" },
];

export interface FilterValues {
  genres: string[];
  occasions: string[];
  licenceTypes: string[];
  location: string;
}

interface FiltersCardProps {
  onFilterChange?: (filters: FilterValues) => void;
  onClearFilters?: () => void;
}

export default function FiltersCard({ onFilterChange, onClearFilters }: FiltersCardProps) {
  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]);
  const [selectedLicence, setSelectedLicence] = useState<string[]>([]);
  const [location, setLocation] = useState("");

  const [openOccasion, setOpenOccasion] = useState(true);
  const [openIndustry, setOpenIndustry] = useState(false);

  // Emit filter changes whenever any filter changes
  useEffect(() => {
    onFilterChange?.({
      genres: selectedGenre,
      occasions: selectedOccasion,
      licenceTypes: selectedLicence,
      location,
    });
  }, [selectedGenre, selectedOccasion, selectedLicence, location, onFilterChange]);

  const clearAllFilters = () => {
    setSelectedGenre([]);
    setSelectedOccasion([]);
    setSelectedLicence([]);
    setLocation("");
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
      className={`
        px-3 py-1.5 text-sm rounded-md border
        transition
        ${
          selected
            ? "bg-green-600 text-white border-green-600"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div
      className="
        w-full
        max-w-95
        xl:max-w-60
        lg:max-w-85
        rounded-2xl
        bg-white
        p-5
        shadow-md
        space-y-4
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Filters</h2>
        <button onClick={clearAllFilters} aria-label="Clear all filters">
          <X className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {/* Genre */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Genre</p>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <Chip
              key={g.value}
              label={g.label}
              selected={selectedGenre.includes(g.value)}
              onClick={() => toggleItem(g.value, selectedGenre, setSelectedGenre)}
            />
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div className="mb-6">
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => setOpenOccasion(!openOccasion)}
        >
          <p className="text-sm font-medium text-gray-700">Occasion</p>
          {openOccasion ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </div>

        {openOccasion && (
          <div className="flex flex-wrap gap-2">
            {occasions.map((o) => (
              <Chip
                key={o.value}
                label={o.label}
                selected={selectedOccasion.includes(o.value)}
                onClick={() =>
                  toggleItem(o.value, selectedOccasion, setSelectedOccasion)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Industry/Brand */}
      <div className="mb-6">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setOpenIndustry(!openIndustry)}
        >
          <p className="text-sm font-medium text-gray-700">
            Industry/Brand
          </p>
          {openIndustry ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Location</p>
        <div className="relative">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="
              w-full rounded-md border border-gray-200
              px-3 py-2 pr-10 text-sm
              outline-none focus:border-green-600
            "
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Licence Type */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">
          Licence Type
        </p>
        <div className="flex flex-wrap gap-2">
          {licenceTypes.map((l) => (
            <Chip
              key={l.value}
              label={l.label}
              selected={selectedLicence.includes(l.value)}
              onClick={() =>
                toggleItem(l.value, selectedLicence, setSelectedLicence)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
