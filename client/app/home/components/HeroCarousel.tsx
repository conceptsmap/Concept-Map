"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"

const INTERVAL = 6000
const TOTAL = 4

export default function HeroCarousel() {
    const router = useRouter()
    const [active, setActive] = useState(0)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setActive((p) => (p + 1) % TOTAL)
        }, INTERVAL)
    }, [])

    useEffect(() => {
        resetTimer()
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [resetTimer])

    const goTo = (i: number) => {
        setActive((i + TOTAL) % TOTAL)
        resetTimer()
    }

    const slides = [
        {
            title: ["Find The Perfect", "Freelancer For", "Your Business"],
            description:
                "Connect with top freelancers across design, development, and marketing. Get high-quality work done faster.",
            primaryCta: "Find Talent",
            secondaryCta: "Hire Experts",
            image: "https://images.pexels.com/photos/8036328/pexels-photo-8036328.jpeg",
        },
        {
            title: ["Get Work Done", "In Minutes,", "Not Days"],
            description:
                "Post your needs, connect with professionals, and start your project instantly.",
            primaryCta: "Get Started",
            secondaryCta: "How It Works",
            image: "https://images.pexels.com/photos/8085940/pexels-photo-8085940.jpeg",
        },
        {
            title: ["Hire Skilled", "Professionals", "On Demand"],
            description:
                "Browse talent, compare profiles, and hire the right expert quickly.",
            primaryCta: "Browse Talent",
            secondaryCta: "View Categories",
            image: "https://images.pexels.com/photos/13812367/pexels-photo-13812367.jpeg",
        },
        {
            title: ["Turn Your Skills", "Into Income", "Globally"],
            description:
                "Showcase your expertise and connect with clients worldwide.",
            primaryCta: "Start Selling",
            secondaryCta: "Become a Freelancer",
            image: "https://images.pexels.com/photos/4107226/pexels-photo-4107226.jpeg",
        },
    ]
    return (
        <div className="relative w-[90%] my-3 mx-auto rounded-3xl h-[95vh] overflow-hidden">

            {/* Slides */}
            <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${active * 100}%)` }}
            >
                {slides.map((slide, i) => (
                    <div key={i} className="relative w-full flex-shrink-0 h-full">

                        {/* Background Image */}
                        <img
                            src={slide.image}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0  from-black/80 via-black/60 to-black/70" />

                        {/* Content */}
                        <div className="relative z-10 h-full flex items-center justify-center px-6">

                            <div className="text-center text-white  p-8 md:px-12 ">

                                {/* Title */}
                                <h1 className="text-4xl md:text-8xl font-semibold leading-tight">
                                    {slide.title.map((line, idx) => (
                                        <span key={idx} className="block">
                                            {idx === slide.title.length - 1 ? (
                                                <span className="text-white">{line}</span>
                                            ) : line}
                                        </span>
                                    ))}
                                </h1>

                                {/* Description */}
                                <p className="mt-6 text-lg md:text-xl  leading-relaxed">
                                    {slide.description}
                                </p>

                                {/* CTA */}
                                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => router.push("/login")}
                                        className="bg-green-900 px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                                    >
                                        {slide.primaryCta} <ArrowUpRight size={18} />
                                    </button>

                                    <button
                                        onClick={() => router.push("/login")}
                                        className="border border-white text-white px-8 py-3 rounded-xl  transition"
                                    >
                                        {slide.secondaryCta}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Arrows */}
            <button
                onClick={() => goTo(active - 1)}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur"
            >
                <ChevronLeft />
            </button>

            <button
                onClick={() => goTo(active + 1)}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur"
            >
                <ChevronRight />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {slides.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-green-400" : "w-3 bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}