"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import profileImage from "@/assets/images/profile-image.png"
import profileBg from "@/assets/images/profile-bg.jpg"
import board from "@/assets/icons/table_list.svg"
import smile from "@/assets/icons/smile.svg"
import settings from "@/assets/icons/settings.svg"
import support from "@/assets/icons/support.svg"
import question from "@/assets/icons/question.svg"
import arrow from "@/assets/icons/right-arrow.svg"
import Link from "next/link"

const Profile = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("auth_token")
                if (!token) {
                    setError("Please log in")
                    setLoading(false)
                    return
                }

                const apiUrl =
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

                const res = await fetch(`${apiUrl}/web/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })

                const data = await res.json()

                if (res.ok && data?.data) {
                    setUser(data.data)
                } else {
                    setError(data?.message || "Failed to fetch user")
                }
            } catch (err) {
                setError("Something went wrong")
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    if (loading) return <ProfileSkeleton />

    if (error) {
        return (
            <div className="p-6 text-center text-red-500 text-sm">{error}</div>
        )
    }

    return (
        <div className="mx-auto flex gap-3 flex-col">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                <div className="relative h-48 w-full">
                    <Image
                        src={profileBg}
                        alt="Profile background"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="relative px-6 pb-8 bg-white">
                    <div className="absolute -top-10 left-12 z-10">
                        <img
                            src={user.profile_url || profileImage.src}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-full object-cover"
                        />
                    </div>

                    <div className="flex justify-end pt-1 absolute -top-6 right-5">
                        <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-[#013913] font-medium hover:border-[#013913] transition-colors">
                            Edit profile
                        </button>
                    </div>
                    <div className="pt-10 flex gap-8 text-sm">

                        {
                            user.role === "CREATOR" && (
                                <>
                                    <Stat label="Posts" value="08" />
                                    <Stat label="Followers" value="1.2k" />
                                    <Stat label="Followings" value="898" />
                                </>
                            )
                        }
                    </div>



                    <div className="mt-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold">
                                {user?.username || "User Name"}
                            </h2>
                            <span className="rounded-sm bg-[#DBFFE7] px-2 py-0.5 text-sm text-[#013913]">
                                {user?.jobRole || (user?.role === "CREATOR" ? "ScriptWriter" : "Buyer")}
                            </span>
                        </div>

                        <p className="text-sm text-[#BEBEBE]">
                            @{user?.username || "username"}
                        </p>

                        <p className="mt-1 text-sm text-[#777777]">
                            {user?.bio ||
                                "Passionate storyteller | Crime & Thriller Enthusiast"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm">
                {
                    user.role === "CREATOR" ?
                        <MenuItem label="My Posts" icon={board} href="/my-posts" /> :
                        <MenuItem label="My Purchases" icon={board} href="/purchases" />

                }

                <MenuItem label="My Reviews" icon={smile} />
                <MenuItem label="Security & Privacy Settings" icon={settings} />
                <MenuItem label="Contact Support" icon={support} />
                <MenuItem label="FAQ & Help Center" icon={question} />

                <div className="flex justify-end p-4 border-t border-gray-100">
                    <button className="rounded-xl border hover:border-[#013913] px-4 py-2 text-sm font-medium text-[#013913]">
                        Delete Account
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Profile

const Stat = ({
    label,
    value,
}: {
    label: string
    value: string
}) => (
    <div className="flex items-center gap-1">
        <span className="font-bold text-gray-900 text-lg">{value}</span>
        <span className="text-gray-400">{label}</span>
    </div>
)

type MenuItemProps = {
    label: string
    icon: any
    href?: string
    onClick?: () => void
}
const MenuItem = ({ label, icon, href, onClick }: MenuItemProps) => {
    const content = (
        <div className="flex w-full items-center justify-between border-b border-gray-100 px-6 py-4 text-sm hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
                <Image src={icon} alt={label} width={20} height={20} />
                <span className="text-black">{label}</span>
            </div>

            <div className="border border-gray-100 p-1.5 rounded-md">
                <Image src={arrow} alt="" width={16} height={16} />
            </div>
        </div>
    )

    if (href) {
        return (
            <Link href={href} className="block">
                {content}
            </Link>
        )
    }

    return (
        <button onClick={onClick} className="w-full text-left">
            {content}
        </button>
    )
}

const ProfileSkeleton = () => (
    <div className="animate-pulse space-y-3">
        <div className="h-48 bg-gray-200 rounded-3xl" />
        <div className="bg-white rounded-3xl p-6 space-y-4">
            <div className="h-20 w-20 rounded-full bg-gray-200" />
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-60 bg-gray-200 rounded" />
            <div className="flex gap-6">
                <div className="h-5 w-16 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-gray-200 rounded" />
            </div>
        </div>
    </div>
)
