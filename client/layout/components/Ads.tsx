import React from "react"
import Image from "next/image"
import add2 from "@/assets/images/ads2.svg"
import add1 from "@/assets/images/ads1.svg"

const Ads = () => {
  return (
    <div className="flex md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-visible no-scrollbar w-full md:w-auto">

      <div className="overflow-hidden rounded-2xl shadow-md min-w-40 md:min-w-0 shrink-0">
        <Image
          src={add1}
          alt="Ad 1"
          width={182}
          height={324}
          className="h-auto w-full md:w-auto"
          priority
        />
      </div>

      <div className="overflow-hidden rounded-2xl shadow-md min-w-40 md:min-w-0 shrink-0">
        <Image
          src={add2}
          alt="Ad 2"
          width={182}
          height={324}
          className="h-auto w-full md:w-auto"
          priority
        />
      </div>

    </div>
  )
}

export default Ads
