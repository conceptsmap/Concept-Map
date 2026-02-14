"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import bell from "@/assets/icons/bell.svg";
import lock from "@/assets/icons/lock.svg";
import announcement from "@/assets/icons/announcement.svg";
import offer from "@/assets/icons/offer.svg";

const Notifications = () => {
  return (
    <div
      className="
        w-full
            xl:max-w-75
        lg:max-w-56
        rounded-2xl
        bg-white
        p-5
        shadow-md
        space-y-5
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Image src={bell} alt="Bell" className="h-5 w-5" />
        <h2 className="text-base font-semibold">Notifications</h2>
      </div>

      {/* Login notice */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Image src={lock} alt="Lock" className="h-5 w-5 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">
              Log in to see your notifications!
            </p>
            <p>
              Stay updated on your purchases, new script releases, and seller
              interactions.
            </p>
          </div>
        </div>

        {/* <div className="flex gap-3 pl-8">
          <Link href="/login">
            <Button className="rounded-xl bg-[#1DBF73] px-5 text-white hover:bg-[#1DBF73]/90">
              Login
            </Button>
          </Link>

          <Button
            variant="outline"
            className="rounded-xl px-5 text-[#1DBF73] border-[#E5E7EB]"
          >
            Sign up
          </Button>
        </div> */}
      </div>

      {/* Notifications */}
      <div className="space-y-4">
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
  );
};

export default Notifications;

const NotificationItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-900">{title}</span>{" "}
        {description}
      </p>
    </div>
  );
};
