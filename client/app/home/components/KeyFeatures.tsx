"use client"
import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import seller from "@/assets/icons/seller.svg"
import buyer from "@/assets/icons/buyer.svg"

const KeyFeatures = () => {
    const featureRef = useRef(null)
    const [showFeatures, setShowFeatures] = useState(false)
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShowFeatures(true)
            observer.disconnect()
          }
        },
        { threshold: 0.6 }
      )
  
      if (featureRef.current) observer.observe(featureRef.current)
  
      return () => observer.disconnect()
    }, [])
  return (
    <section className="relative bg-white">
    <div
      ref={featureRef}
      className="relative mx-auto max-w-6xl h-[290px]"
    >
      <Image
        src={seller}
        alt="Sellers"
        className={`
    absolute top-34 right-[276px] z-10
    transition-all duration-700 ease-out
    ${showFeatures
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-6"}
  `}
      />

      <Image
        src={buyer}
        alt="Buyers"
        className={`
    absolute top-34 left-[252px]
    transition-all duration-700 delay-400 ease-out
    ${showFeatures
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-6"}
  `}
      />
    </div>
  </section>
  )
}

export default KeyFeatures