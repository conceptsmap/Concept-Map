import React from 'react'
import Image from "next/image"
import success from "@/assets/icons/success.svg"

const SuccessScreen = () => {
  return (
    <div className="w-full max-w-md min-h-[520px] rounded-3xl bg-[#013913] p-6 text-white flex flex-col items-center justify-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full">
      <Image src={success} alt="Success" className="" />
    </div>

    <h2 className="mt-6 text-xl font-bold">
      Yay! Successful
    </h2>

    <p className="mt-2 text-center text-sm text-white/90">
      Your purchased item is now available for download
    </p>

    <button className="mt-6 w-full rounded-xl bg-[#1DBF73] py-3 font-bold cursor-pointer">
      View Purchases
    </button>
  </div>
  )
}

export default SuccessScreen