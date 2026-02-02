"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import bell from "@/assets/icons/bell.svg"
import lock from "@/assets/icons/lock.svg"
import announcement from "@/assets/icons/announcement.svg"
import offer from "@/assets/icons/offer.svg"
import Link from "next/link"

const Notifications = () => {

  return (
    <div className="w-[460px] rounded-3xl bg-white p-5 shadow-lg">
      
      <div className="mb-4 flex items-center gap-3">
      <Image src={bell} alt="Bell" className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-start gap-3">
          <Image src={lock} alt="Lock" className="h-5 w-5" />
          <div className="text-sm text-gray-600">
            <div className="font-medium text-gray-900">
              Log in to see your notifications!
            </div>{" "}
           <div> Stay updated on your purchases, new script releases, and seller interactions.</div>
          </div>
        </div>

        <div className="flex gap-3 pl-8">
          <Link href="/login">
          <Button className="rounded-xl bg-[#1DBF73] px-6 text-white hover:bg-[#1DBF73]/90 cursor-pointer">
            Login
          </Button>
          </Link>

          <Button
            variant="outline"
            className="rounded-xl px-6 text-[#1DBF73] border-[#E5E7EB]"
          >
            Sign up
          </Button>
        </div>
      </div>


      <div className="space-y-5">
        <NotificationItem
          icon={<Image src={announcement} alt="Announcement" className="h-5 w-5" />}
          title="New scripts are live!"
          description="Discover trending Ad Scripts, Storyboards, and Synopses."
        />

        <NotificationItem
          icon={<Image src={offer} alt="Offer" className="h-5 w-5" />}
          title="Exclusive Offer!"
          description="Get 20% off on your first script purchase."
        />
      </div>
    </div>
  )
}

export default Notifications

const NotificationItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-900">{title}</span>{" "}
        {description}
      </p>
    </div>
  )
}