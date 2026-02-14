import React from "react"
import Image from "next/image"
import add2 from "@/assets/images/ads2.svg"
import add1 from "@/assets/images/ads1.svg"

const Ads = () => {
  return (
    <div className="flex flex-col gap-4 ">

      <div className="overflow-hidden rounded-2xl  shadow-md">
        <Image
          src={add1}
          alt="Ad 1"
          width={182}
          height={324}
          priority
        />
      </div>

      <div className="overflow-hidden rounded-2xl  shadow-md">
        <Image
          src={add2}
          alt="Ad 2"
          width={182}
          height={324}
          priority
        />
      </div>

    </div>
  )
}

export default Ads
