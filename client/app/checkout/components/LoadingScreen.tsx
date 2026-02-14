import React from 'react'
import Image from "next/image"
import loading from "@/assets/icons/loading.svg"

const LoadingScreen = () => {
  return (
    <div className="w-[399px] min-h-[520px] rounded-3xl bg-[#1DBF73] p-6 text-white flex flex-col items-center justify-center">
      <Image src={loading} alt="Loading" className="h-12 w-12 animate-spin animation-duration-[2.5s]" />
      <h2 className="mt-6 text-xl font-bold">
        Waiting for confirmation
      </h2>
      <p className="mt-2 text-center text-sm text-white/90">
        Don’t skip, we are waiting for confirmation from bank
      </p>
    </div>
  )
}

export default LoadingScreen