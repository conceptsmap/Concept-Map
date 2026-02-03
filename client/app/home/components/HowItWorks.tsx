import React from 'react'
import Image from 'next/image'
import img from '@/assets/images/sign up (4) 1.png'
import Steps from '@/assets/icons/steps.svg'

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Free Account",
      description: "Get started by creating your account in minutes",
      color: "bg-[#1DBF73]"
    },
    {
      number: "02",
      title: "Discover & Engage",
      description: "Explore content and connect with the community",
      color: "bg-white"
    },
    {
      number: "03",
      title: "Secure & Instant Access",
      description: "Enjoy seamless and secure access to all features",
      color: "bg-white"
    }
  ]

  return (
<section className="py-12 bg-linear-to-b from-white to-[#EEEEEE]">
<div className="max-w-7xl mx-auto px-6">

    <div className="grid lg:grid-cols-2 gap-12 items-center">

      <div className='lg:ps-28 text-center lg:text-left '>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
          How it Works
        </h2>

        <div className="space-y-6 ps-18">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4 justify-center lg:justify-start">
              
              <div
                className={`
                  ${step.color}
                  ${step.color === "bg-white" ? "border-2 border-gray-300" : ""}
                  rounded-full px-6 py-3 min-w-58 text-center
                `}
              >
                <span
                  className={`font-semibold ${
                    step.color === "bg-white" ? "text-[#1DBF73]" : "text-white"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      <section className="relative bg-white">
  <div className="relative mx-auto max-w-6xl  hidden lg:block">
    
      
          <Image
            src={Steps}
            alt="Key Features"
            className="absolute bottom-2 -right-10 z-20"
          />

  </div>
</section>
      </div>


      <div className="relative">
        <Image
          src={img}
          alt="Writers Conference Zambia 2025"
          className="rounded-lg shadow-lg w-full h-auto"
        />
      </div>

    </div>
  </div>
</section>

  )
}

export default HowItWorks