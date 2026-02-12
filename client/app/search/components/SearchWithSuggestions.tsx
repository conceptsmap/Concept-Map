"use client";



import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import searchIcon from "@/assets/icons/search.svg";

type BackendSuggestion = { main_title?: string; title?: string };


export default function SearchWithSuggestions() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (!value) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/search?textSearch=${encodeURIComponent(value)}&take=5`, { signal: controller.signal });
        const data = await res.json();
        if (res.ok && data?.data?.scripts) {
          setSuggestions((data.data.scripts as BackendSuggestion[]).map((s) => s.main_title || s.title || ""));
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
    return () => controller.abort();
  }, [value]);

  const handleSearch = (searchValue: string) => {
    setOpen(false);
    if (searchValue) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

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
          placeholder="Search scripts, synopses, storyboards..."
          className="
            w-full bg-transparent
            pl-11 pr-4 py-3
            text-sm outline-none
          "
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(value);
            }
          }}
        />
      </div>

      {/* BUTTON */}
      <Button className="rounded-full bg-green-700 px-8 hover:bg-green-800" onClick={() => handleSearch(value)}>
        Search
      </Button>

      {/* DROPDOWN */}
      {open && value && (suggestions.length > 0 || loading) && (
        <div
          className="
            absolute left-0 top-full mt-2
            w-full rounded-xl
            border border-gray-200
            bg-white shadow-sm
            z-50
          "
        >
          {loading ? (
            <div className="px-4 py-2.5 text-sm text-gray-500">Loading...</div>
          ) : (
            suggestions.map((item, idx) => (
              <button
                key={item + "-" + idx}
                onClick={() => {
                  setValue(item);
                  handleSearch(item);
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
            ))
          )}
        </div>
      )}
    </div>
  );
}
