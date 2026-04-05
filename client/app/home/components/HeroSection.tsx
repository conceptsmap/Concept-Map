"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import board from "@/assets/icons/board.svg"
import coins from "@/assets/icons/coins.svg"
import discover from "@/assets/icons/discover.svg"
import shield from "@/assets/icons/shield.svg"
import stats from "@/assets/icons/stats.svg"
import unlock from "@/assets/icons/unlock.svg"
import KeyFeatures from "./KeyFeatures"
import HeroCarousel from "./HeroCarousel"

const HeroSection = () => {
  const cardsRef = useRef(null)
  const [showCards, setShowCards] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowCards(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    if (cardsRef.current) observer.observe(cardsRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <HeroCarousel />

      <KeyFeatures />

      <section className="bg-white  md:pb-16 ">
        <div className={"mx-auto max-w-5xl px-6"}>
          <div
            ref={cardsRef}
            className="flex flex-col gap-5 md:gap-3 md:flex-row justify-between overflow-hidden"
          >
            {/* LEFT CARD */}
            <div
              className={`
                rounded-2xl w-82.2 p-6 text-sm
                shadow-xl shadow-green-500/50
                bg-linear-to-br from-emerald-400 to-green-600 text-white
                transition-all duration-700 ease-out
                ${showCards ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}
              `}
            >
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Image src={board} alt="" className="w-5 h-5" />
                  <span className="font-medium">
                    Browse Scripts, Storyboards &amp; Synopsis
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image src={shield} alt="" className="w-5 h-5" />
                  <span className="font-medium">
                    Secure Payment &amp; Instant Download
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image src={discover} alt="" className="w-5 h-5" />
                  <span className="font-medium">
                    Personalized Recommendations
                  </span>
                </li>
              </ul>
            </div>

            {/* RIGHT CARD */}
            <div
              className={`
                rounded-2xl w-82 p-6 text-sm
                shadow-xl shadow-emerald-400/50
                bg-linear-to-br from-emerald-900 to-green-950 text-white
                transition-all duration-700 delay-200 ease-out
                ${showCards ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}
              `}
            >
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Image src={coins} alt="" className="w-5 h-5" />
                  <span className="font-medium">
                    Showcase Your Work &amp; Earn
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image src={unlock} alt="" className="w-5 h-5" />
                  <span className="font-medium">
                    Set Your Own Pricing &amp; Licensing
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image src={stats} alt="" className="w-5 h-5" />
                  <span className="font-medium">
                    Get Detailed Sales Analytics
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection
