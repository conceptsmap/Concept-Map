import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import story from "@/assets/images/story.svg"

const Navbar = () => {
  return (
    <header className="w-full bg-[#013913] py-4">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          {/* <Image
            src={story}
            alt="Story logo"
            width={40}
            height={40}
            priority
          /> */}
          <p className="text-white  font-semibold text-xl">ConceptsMap</p>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/login" className="cursor-pointer text-sm font-medium text-white">
            Synopsis
          </Link>
          <Link href="/login" className="cursor-pointer text-sm font-medium text-white">
            Storyboard
          </Link>
          <Link href="/login" className="cursor-pointer text-sm font-medium text-white">
            Script
          </Link>
        </nav>

        <Link href="/login">
          <Button
            className="
              py-5 text-[16px] font-semibold text-white rounded-lg border-3 border-[#207D3E]
            bg-gradient-to-b from-[#73D091] to-[#08501F]
            shadow-[inset_0_0_0_1px_black,0_2px_4px_rgba(0,0,0,0.25)]
             transition-all
          "
          >
            Sign up for free
          </Button>
        </Link>
      </div>
    </header >
  )
}

export default Navbar
