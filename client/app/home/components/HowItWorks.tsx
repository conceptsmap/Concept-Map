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
    <section className="pt-16 pb-24 bg-linear-to-b from-white to-[#EEEEEE]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className='[@media(min-width:1200px)]:ps-28 lg:ps-24 ps-0 text-center lg:text-left '>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
              How it Works
            </h2>

            <div className="space-y-6 ps-0 [@media(min-width:1200px)]:ps-18">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 justify-center lg:justify-start">

                  <div
                    className={`
                  ${step.color}
                  ${step.color === "bg-white" ? "" : ""}
                  rounded-2xl px-6 py-3 min-w-58 text-center shadow-lg
                `}
                  >
                    <span
                      className={`font-medium text-sm ${step.color === "bg-white" ? "text-[#1DBF73]" : "text-white"
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
                  className="absolute  bottom-[2px] -right-10 z-20"
                />

              </div>
            </section>
          </div>


          <div className="relative">
            <Image
              src={img}
              alt="Writers Conference Zambia 2025"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>

        </div>
      </div>
    </section>

  )
}

export default HowItWorks