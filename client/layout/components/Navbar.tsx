"use client"

import React, { useState } from "react"

const categories = [
  "ALL",
  "CRIME",
  "ROMANCE",
  "HORROR",
  "ACTION",
  "COMEDY",
  "DRAMA",
  "SCIFI",
  "FANTASY",
  "HISTORICAL",
  "DOCUMENTARY",
  "OTHERS"
];

const Navbar = () => {
  const [active, setActive] = useState("ALL")

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
          const isActive = active === item

          return (
            <button
              key={item}
              onClick={() => setActive(item)}
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
              {item}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Navbar
