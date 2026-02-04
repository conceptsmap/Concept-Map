"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import bookmark from "@/assets/icons/bookmark.svg"
import community from "@/assets/icons/community.svg"
import home from "@/assets/icons/home.svg"
import task from "@/assets/icons/task.svg"
import search from "@/assets/icons/search.svg"
import toggle from "@/assets/icons/toggle.svg"
import table_list from "@/assets/icons/table_list.svg"
import signout from "@/assets/icons/signout.svg"

import { Button } from "@/components/ui/button"

const BuyerSidebar = () => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <aside
      className={`
      h-screen bg-white shadow-sm transition-all duration-300
      ${collapsed ? "w-[88px]" : "w-[320px]"}
      rounded-3xl p-4
      flex flex-col
    `}
    >

      <div className="mb-6 flex justify-start">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border"
        >
          <Image src={toggle} alt="Menu" className="h-6 w-6" />
        </button>
      </div>

      {/* {!collapsed && (
        <div className="mb-6 flex gap-3">
          <Link href="/login">
          <Button className="flex-1 rounded-xl bg-[#013913] py-5 text-white hover:bg-[#013913]/90 cursor-pointer">
            Login
          </Button>
          </Link>

          <Button
            variant="outline"
            className="flex-1 rounded-xl py-5 text-[#013913] border-[#E5E7EB]"
          >
            Sign up
          </Button>
        </div>
      )} */}

      <nav className="space-y-1 flex-1">

        <SidebarItem
          icon={home}
          label="Home"
          href="/"
          active={pathname === "/"}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={search}
          label="Search"
          href="/search"
          active={pathname.startsWith("/search")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={bookmark}
          label="Saved"
          href="/saved"
          active={pathname.startsWith("/saved")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={table_list}
          label="My Purchases"
          href="/purchases"
          active={pathname.startsWith("/purchases")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={task}
          label="Request Gigs"
          href="/request-gigs"
          active={pathname.startsWith("/request-gigs")}
          collapsed={collapsed}
          highlight
        />

        <SidebarItem
          icon={community}
          label="Community"
          href="/community"
          active={pathname.startsWith("/community")}
          collapsed={collapsed}
          highlight
        />
      </nav>
      <div className="pt-4 border-t">
        <Button
          onClick={handleLogout}
          variant={"outline"}
          className={`
      relative group
      flex items-center justify-start gap-3 w-full
      rounded-xl px-4 py-3
      transition-colors
      hover:bg-gray-100
      ${collapsed ? "justify-center px-0" : ""}
    `}
        >
          <Image src={signout} alt="Logout" className="h-5 w-5" />
          {!collapsed && <span className="font-medium">Logout</span>}

          {collapsed && (
            <div
              className="
          pointer-events-none
          absolute left-full top-1/2 z-50
          ml-3 -translate-y-1/2
          whitespace-nowrap
          rounded-lg bg-gray-900 px-3 py-1.5
          text-xs text-white
          opacity-0
          transition-opacity duration-200
          group-hover:opacity-100
        "
            >
              Logout
            </div>
          )}
        </Button>
      </div>

    </aside>

  )
}

type SidebarItemProps = {
  icon: string
  label: string
  href: string
  active: boolean
  collapsed: boolean
  highlight?: boolean
}

const SidebarItem = ({
  icon,
  label,
  href,
  active,
  collapsed,
  highlight,
}: SidebarItemProps) => {
  return (
    <Link href={href} className="relative group">
      <div
        className={`
          flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer
          transition-all duration-200
          ${active
            ? "bg-[#E6FFEF] text-[#013913] font-medium"
            : "text-gray-900 hover:bg-gray-100"}
          ${highlight && !active ? "text-[#013913]" : ""}
          ${collapsed ? "justify-center px-0" : ""}
        `}
      >
        <Image src={icon} alt={label} className="h-5 w-5" />
        {!collapsed && <span>{label}</span>}
      </div>

      {collapsed && (
        <div
          className="
            pointer-events-none
            absolute left-full top-1/2 z-50
            ml-3 -translate-y-1/2
            whitespace-nowrap
            rounded-lg bg-gray-900 px-3 py-1.5
            text-xs text-white
            opacity-0
            transition-opacity duration-200
            group-hover:opacity-100
          "
        >
          {label}
        </div>
      )}
    </Link>
  )
}


export default BuyerSidebar
