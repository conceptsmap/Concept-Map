"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import searchIcon from "@/assets/icons/search.svg";

const SUGGESTIONS = [
  "Coffee shop ads",
  "Thriller scripts",
  "Perfume ad",
];

export default function SearchWithSuggestions() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filtered = SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div ref={ref} className="relative inline-flex items-center gap-3">
      {/* INPUT PILL */}
      <div
        className="
          relative flex items-center
          bg-white rounded-full
          border border-gray-200
          w-[100%]
          sm:w-[520px]
          lg:w-[680px]
          xl:w-[760px]
        "
      >
        <Image
          src={searchIcon}
          alt=""
          className="absolute left-4 h-4 w-4 opacity-60"
        />

        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Coffee shop ads"
          className="
            w-full bg-transparent
            pl-11 pr-4 py-3
            text-sm outline-none
          "
        />
      </div>

      {/* BUTTON */}
      <Button className="rounded-full bg-green-700 px-8 hover:bg-green-800">
        Search
      </Button>

      {/* DROPDOWN */}
      {open && value && filtered.length > 0 && (
        <div
          className="
            absolute left-0 top-full mt-2
            w-full rounded-xl
            border border-gray-200
            bg-white shadow-sm
          "
        >
          {filtered.map((item) => (
            <button
              key={item}
              onClick={() => {
                setValue(item);
                setOpen(false);
              }}
              className="
                flex items-center gap-3
                w-full px-4 py-2.5
                text-sm text-left
                hover:bg-gray-100
              "
            >
              <Image src={searchIcon} alt="" className="h-4 w-4 opacity-60" />
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
