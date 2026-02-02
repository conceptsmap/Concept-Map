"use client"

import React, { useState } from "react"

const categories = [
  "All",
  "Feature Film",
  "Short Film",
  "TV Series / Web Series",
  "Advertisement Script",
]

const Navbar = () => {
  const [active, setActive] = useState("All")

  return (
    <div className="w-full overflow-x-auto">
      <div
        className="
          flex w-max gap-3
          rounded-2xl bg-[#F5F7F6]
          p-3
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
                ${
                  isActive
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
