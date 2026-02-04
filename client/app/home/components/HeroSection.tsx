"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import dashboard from "@/assets/images/buyers after login (2) 1.png"
import payment from "@/assets/images/Frame 30 (1) 1.png"
import earnings from "@/assets/images/Frame 74 (1) 1.png"
import post from "@/assets/images/Frame 1 (4) 2.png"
import comment from "@/assets/images/Frame 19 (1) 1.png"
import board from "@/assets/icons/board.svg"
import coins from "@/assets/icons/coins.svg"
import discover from "@/assets/icons/discover.svg"
import shield from "@/assets/icons/shield.svg"
import stats from "@/assets/icons/stats.svg"
import unlock from "@/assets/icons/unlock.svg"
import connector from "@/assets/icons/connector.svg"
import KeyFeatures from "./KeyFeatures"

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
      <section className="relative overflow-visible bg-[#013913]">
        <div className="mx-auto max-w-5xl px-6 pt-12 pb-40 text-center">
          <h1 className="text-4xl font-normal leading-tight text-white md:text-6xl">
            Find &amp; Sell High-Quality Ad
            <br />
            Scripts Effortlessly!
          </h1>

          <p className="mt-6 text-base text-white/90 md:text-lg mb-2">
            Join a marketplace where scriptwriters and agencies connect seamlessly.
          </p>
        </div>

        <div className="relative mx-auto -mt-32 h-[300px] max-w-6xl ">
          {/* CENTER DASHBOARD */}
          <Image
            src={dashboard}
            alt="Dashboard"
            priority
            className={`
      absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-xl
      transition-all duration-700 ease-out
      animate-[fadeInUp_0.8s_ease-out_forwards]
    `}
          />

          {/* LEFT COMMENT */}
          <Image
            src={comment}
            alt="Comment"
            width={400}
            height={300}
            className={`
      absolute left-10 -top-5 z-30 rounded-xl
      transition-all duration-700 delay-200 ease-out
      animate-[slideInLeft_0.8s_ease-out_forwards,levitate_6s_ease-in-out_infinite_0.8s]
    `}
          />

          {/* RIGHT PAYMENT */}
          <Image
            src={payment}
            alt="Payment"
            width={200}
            height={250}
            className={`
      absolute right-14 -top-5 z-30 rounded-xl
      transition-all duration-700 delay-300 ease-out
      animate-[slideInRight_0.8s_ease-out_forwards,levitate_6s_ease-in-out_infinite_0.8s]
    `}
          />

          {/* RIGHT POST */}
          <Image
            src={post}
            alt="Post"
            width={200}
            height={300}
            className={`
      absolute top-85 right-23 z-30 rounded-xl
      transition-all duration-700 delay-400 ease-out
      animate-[slideInRight_0.8s_ease-out_forwards,levitate_6s_ease-in-out_infinite_0.8s]
    `}
          />

          {/* LEFT EARNINGS */}
          <Image
            src={earnings}
            alt="Earnings"
            width={400}
            height={300}
            className={`
      absolute top-40 left-35 z-30 rounded-xl
      transition-all duration-700 delay-500 ease-out
      animate-[slideInLeft_0.8s_ease-out_forwards,levitate_6s_ease-in-out_infinite_0.8s]
    `}
          />
        </div>


        <section className="relative bg-white">
          <div className="relative mx-auto max-w-6xl">
            <Image
              src={connector}
              alt="Key Features"
              className="absolute -top-20 z-20"
            />
          </div>
        </section>
      </section>

      <KeyFeatures />

      <section className="bg-white pt-20 pb-16 mt-10 lg:mt-0">
        <div className={"mx-auto max-w-5xl px-6"}>
          <div
            ref={cardsRef}
            className="flex flex-col md:flex-row justify-between overflow-hidden"
          >
            {/* LEFT CARD */}
            <div
              className={`
                rounded-2xl w-82.2 p-6 text-sm
                shadow-xl shadow-green-500/50
                bg-gradient-to-br from-emerald-400 to-green-600 text-white
                transition-all duration-700 ease-out
                ${showCards ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}
              `}
            >
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Image src={board} alt="" className="w-5 h-5" />
                  <span className="font-medium">
                    Browse Scripts, Storyboards & Synopses
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image src={shield} alt="" className="w-5 h-5" />
                  <span className="font-medium">
                    Secure Payment & Instant Download
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
                bg-gradient-to-br from-emerald-900 to-green-950 text-white
                transition-all duration-700 delay-200 ease-out
                ${showCards ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}
              `}
            >
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Image src={coins} alt="" className="w-5 h-5" />
                  <span className="font-medium">
                    Showcase your work & earn
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image src={unlock} alt="" className="w-5 h-5" />
                  <span className="font-medium">
                    Set your own pricing & licensing
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Image src={stats} alt="" className="w-5 h-5" />
                  <span className="font-medium">
                    Get detailed sales analytics
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
