"use client"

import { useRef, useEffect, useState } from "react"
import CMCertification from "./CMCertification"

const testimonials = [
    {
        name: "Arjun Mehta",
        role: "Ad Agency Director, Mumbai",
        initials: "AM",
        bg: "bg-emerald-600",
        quote:
            "Concept Map completely changed how we source scripts. Found three ad scripts in one afternoon that were ready to shoot — quality was outstanding.",
        rating: 5,
    },
    {
        name: "Priya Suresh",
        role: "Freelance Scriptwriter, Bangalore",
        initials: "PS",
        bg: "bg-green-700",
        quote:
            "I uploaded my first storyboard and sold it within a week. The platform is clean, payments are instant, and buyers really appreciate the work.",
        rating: 5,
    },
    {
        name: "Rahul Kapoor",
        role: "Creative Producer, Delhi",
        initials: "RK",
        bg: "bg-teal-600",
        quote:
            "The synopsis marketplace alone saved us weeks of development work. We found a gem for our OTT series and closed the deal in under 24 hours.",
        rating: 5,
    },
    {
        name: "Sneha Thomas",
        role: "Brand Strategist, Kochi",
        initials: "ST",
        bg: "bg-emerald-800",
        quote:
            "As someone who reviews dozens of scripts monthly, Concept Map's filtering and community reviews make shortlisting so much faster and smarter.",
        rating: 5,
    },
    {
        name: "Vikram Nair",
        role: "Independent Filmmaker, Chennai",
        initials: "VN",
        bg: "bg-green-600",
        quote:
            "Earning from my scripts while keeping rights was something I never thought possible. Concept Map's licensing setup is exactly what creators need.",
        rating: 5,
    },
    {
        name: "Divya Sharma",
        role: "Content Director, Hyderabad",
        initials: "DS",
        bg: "bg-emerald-700",
        quote:
            "The bid system let me negotiate directly with a talented scriptwriter. The whole process was transparent, secure, and genuinely enjoyable.",
        rating: 5,
    },
]

const StarRating = ({ count }: { count: number }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: count }).map((_, i) => (
            <svg key={i} className="h-4 w-4 text-[#1DBF73]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
)

const Testimonials = () => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        const container = scrollRef.current
        if (!container) return

        let animFrame: number

        const step = () => {
            if (!isPaused && container) {
                container.scrollLeft += 0.5
                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft = 0
                }
            }
            animFrame = requestAnimationFrame(step)
        }

        animFrame = requestAnimationFrame(step)
        return () => cancelAnimationFrame(animFrame)
    }, [isPaused])

    const doubled = [...testimonials, ...testimonials]

    return (
        <section className="bg-[#013913] py-20 overflow-hidden">
            {/* Heading */}
            <div className="mx-auto max-w-7xl px-6 text-center mb-14">
                <p className="text-sm font-semibold tracking-widest text-[#1DBF73] uppercase mb-3">
                    What People Say
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    Trusted By Creators &amp; Buyers
                </h2>
                <p className="mt-4 text-white/70 text-sm md:text-base max-w-xl mx-auto">
                    Thousands of scriptwriters and agencies are already building their next
                    big project on Concept Map.
                </p>
            </div>

            {/* Auto-scrolling card strip */}
            <div
                ref={scrollRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                className="flex gap-5 overflow-x-auto no-scrollbar px-6 cursor-default"
                style={{ scrollBehavior: "auto" }}
            >
                {doubled.map((t, i) => (
                    <div
                        key={i}
                        className="flex-none w-72 md:w-80 rounded-2xl bg-white/10 border border-white/15 p-6 space-y-4"
                    >
                        <StarRating count={t.rating} />
                        <p className="text-sm text-white/85 leading-relaxed">
                            &ldquo;{t.quote}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                            <div
                                className={`h-10 w-10 rounded-full ${t.bg} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                            >
                                {t.initials}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{t.name}</p>
                                <p className="text-xs text-white/60">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats strip */}
            <div className="mx-auto max-w-5xl px-6 mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                    { stat: "100+", label: "Scripts Listed" },
                    { stat: "35+", label: "Active Buyers" },
                    { stat: "120+", label: "Verified Creators" },
                    { stat: "98%", label: "Satisfaction Rate" },
                ].map(({ stat, label }) => (
                    <div key={label}>
                        <p className="text-3xl md:text-4xl font-bold text-[#1DBF73]">{stat}</p>
                        <p className="mt-1 text-sm text-white/65">{label}</p>
                    </div>
                ))}
            </div>
            {/* <CMCertification /> */}
        </section>
    )
}

export default Testimonials
