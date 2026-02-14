import Image from "next/image"

import profileImage from "@/assets/images/profile-image.png"
import profileBg from "@/assets/images/profile-bg.jpg"
import board from "@/assets/icons/table_list.svg"
import smile from "@/assets/icons/smile.svg"
import settings from "@/assets/icons/settings.svg"
import support from "@/assets/icons/support.svg"
import question from "@/assets/icons/question.svg"
import arrow from "@/assets/icons/right-arrow.svg"

const Profile = () => {
    return (
        <div className="mx-auto  flex gap-3 flex-col">

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

                <div className="relative">
                    <div className="relative h-48 w-full">
                        <Image
                            src={profileBg}
                            alt="Profile background"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="relative px-6 pb-8 bg-white">

                    <div className="absolute -top-22 left-12 z-10">
                        <Image
                            src={profileImage}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-full object-cover "
                        />
                    </div>

                    <svg
                        className="absolute left-0 w-full pointer-events-none"
                        style={{ top: '-44px', height: '48px' }}
                        viewBox="0 0 1200 48"
                        preserveAspectRatio="xMinYMin slice"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M 0,48 L 0,0 L 28,0 Q 36,0 40,4 Q 44,8 48,16 Q 56,28 64,34 Q 72,40 88,40 Q 104,40 112,34 Q 120,28 128,16 Q 132,8 136,4 Q 140,0 148,0 L 1200,0 L 1200,48 Z"
                            fill="white"
                        />
                    </svg>
                    <div className="flex justify-end pt-1 absolute -top-7 right-5">
                        <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-[#013913] font-medium hover:border-[#013913] cursor-pointer transition-colors">
                            Edit profile
                        </button>
                    </div>


                    <div className="pt-5 flex gap-8 text-sm">
                        <Stat label="Posts" value="08" />
                        <Stat label="Followers" value="1.2k" />
                        <Stat label="Followings" value="898" />
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold">Arjun Das</h2>
                            <span className="rounded-sm bg-[#DBFFE7] px-2 py-0.5 text-sm text-[#013913]">
                                Writer
                            </span>
                        </div>

                        <p className="text-sm text-[#BEBEBE]">@alphonse_writer</p>

                        <p className="mt-1 text-sm text-[#777777]">
                            Award-winning screenwriter | Passion for storytelling | Sci-Fi & Thriller Enthusiast
                        </p>
                    </div>
                </div>
            </div>
            <div className=" bg-white rounded-3xl shadow-sm">
                <div className="">
                    <MenuItem label="My Posts" icon={board} />
                    <MenuItem label="My Reviews" icon={smile} />
                    <MenuItem label="Security & Privacy Settings" icon={settings} />
                    <MenuItem label="Contact Support" icon={support} />
                    <MenuItem label="FAQ & Help Center" icon={question} />
                </div>

                <div className="flex justify-end p-4 bg-white border-t border-gray-100">
                    <button className="rounded-xl border hover:border-[#013913] px-4 py-2 text-sm font-medium text-[#013913] cursor-pointer">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Profile


const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center gap-1">
        <span className="font-bold text-gray-900 text-lg">{value}</span>{" "}
        <span className="text-gray-400">{label}</span>
    </div>
)

type MenuItemProps = {
    label: string
    icon: string
}

const MenuItem = ({ label, icon }: MenuItemProps) => (
    <button
        className="
      flex w-full items-center justify-between cursor-pointer border-b  border-gray-100
      px-6 py-4 text-sm
      hover:bg-gray-50
      transition-colors
    "
    >
        <div className="flex items-center gap-3">
            <Image src={icon} alt={label} className="h-5 w-5" />
            <span className="text-black">{label}</span>
        </div>

        <div className="border border-gray-100 p-1.5 rounded-md">
            <Image src={arrow} alt="" className="h-4 w-4" />
        </div>
    </button>
)