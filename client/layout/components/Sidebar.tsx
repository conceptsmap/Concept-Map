"use client"

import React, { useState, useEffect } from "react"
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
import offer from "@/assets/icons/offer.svg"

import { Button } from "@/components/ui/button"

const Sidebar = () => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Mark component as mounted for hydration - this is intentional for SSR
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Read user role only when mounted to avoid hydration mismatch
  const userRole = mounted ? localStorage.getItem("user_role") : null

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_role")
    router.push("/login")
  }

  // Buyer tabs
  const buyerTabs = [
    { icon: home, label: "Home", href: "/dashboard", active: pathname === "/dashboard" },
    { icon: search, label: "Search", href: "/search", active: pathname.startsWith("/search") },
    { icon: bookmark, label: "Saved", href: "/saved", active: pathname.startsWith("/saved") },
    { icon: table_list, label: "My Purchases", href: "/purchases", active: pathname.startsWith("/purchases") },
    // { icon: task, label: "Request Gigs", href: "/request-gigs", active: pathname.startsWith("/request-gigs"), highlight: true },
    { icon: community, label: "Community", href: "/community", active: pathname.startsWith("/community"), highlight: true },
  ]

  // Seller tabs (CREATOR role)
  const sellerTabs = [
    { icon: home, label: "Home", href: "/dashboard", active: pathname === "/dashboard" },
    { icon: search, label: "Search", href: "/search", active: pathname.startsWith("/search") },
    { icon: bookmark, label: "Saved", href: "/saved", active: pathname.startsWith("/saved") },
    { icon: task, label: "Profile", href: "/profile", active: pathname.startsWith("/profile") },
    { icon: table_list, label: "My Posts", href: "/my-posts", active: pathname.startsWith("/my-posts") },
    // { icon: offer, label: "Earnings", href: "/earnings", active: pathname.startsWith("/earnings") },
    { icon: offer, label: "My Purchases", href: "/purchases", active: pathname.startsWith("/purchases") },
    { icon: community, label: "Community", href: "/community", active: pathname.startsWith("/community") },
    // { icon: task, label: "Gig Marketplace", href: "/gig-marketplace", active: pathname.startsWith("/gig-marketplace"), highlight: true },
  ]

  const tabs = userRole === "CREATOR" ? sellerTabs : buyerTabs

  // Prevent hydration mismatch by not rendering tabs until mounted
  if (!mounted) {
    return (
      <aside
        className={`
        h-screen bg-white shadow-sm transition-all duration-300
        ${collapsed ? "w-[88px]" : "w-[200px]"}
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
        <nav className="space-y-1 flex-1"></nav>
      </aside>
    )
  }

  return (
    <aside
      className={`
      h-screen bg-white shadow-sm transition-all duration-300
      ${collapsed ? "w-[88px]" : "w-[200px]"}
      rounded-3xl py-4 px-2
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

      <nav className="space-y-1 flex-1">
        {tabs.map((tab) => (
          <SidebarItem
            key={tab.href}
            icon={tab.icon}
            label={tab.label}
            href={tab.href}
            active={tab.active}
            collapsed={collapsed}
            highlight={tab.highlight}
          />
        ))}
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


export default Sidebar
