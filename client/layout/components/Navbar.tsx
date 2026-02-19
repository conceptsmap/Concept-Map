"use client"

import React from "react"

const categories = [
  "ALL",
  "CRIME",
  "ROMANCE",
  "HORROR",
  "ACTION",
  "COMEDY",
  "DRAMA",
  "SCI-FI",
  "FANTASY",
  "HISTORICAL",
  "DOCUMENTARY",
  "OTHERS"
];

interface NavbarProps {
  activeCategory?: string
  onCategoryChange?: (category: string) => void
}

const Navbar = ({ activeCategory = "ALL", onCategoryChange }: NavbarProps) => {
  const handleCategoryClick = (category: string) => {
    onCategoryChange?.(category)
  }

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <div
        className="
          flex overflow-x-auto gap-3 scrollbar-hide
          rounded-2xl bg-[#F5F7F6]
          py-2
           [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        "
      >
        {categories.map((item) => {
          const isActive = activeCategory === item

          return (
            <button
              key={item}
              onClick={() => handleCategoryClick(item)}
              className={`
                whitespace-nowrap
                rounded-xl px-6 py-2 text-sm font-medium
                transition-all duration-200 
               capitalize
                ${isActive
                  ? "bg-[#013913] text-white shadow-sm"
                  : "bg-white text-gray-800 hover:bg-gray-100"
                }
              `}
            >
              {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Navbar
