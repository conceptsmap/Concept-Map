import { Button } from "@/components/ui/button"
import Image from "next/image"
import story from "@/assets/images/story.svg"

const Navbar = () => {
  return (
    <header className="w-full bg-[#013913] py-4">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Image
            src={story}
            alt="Story logo"
            width={40}
            height={40}
            priority
          />
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <span className="cursor-pointer text-sm font-medium text-white/80 hover:text-white">
            Synopsis
          </span>
          <span className="cursor-pointer text-sm font-medium text-white/80 hover:text-white">
            Storyboard
          </span>
          <span className="cursor-pointer text-sm font-medium text-white/80 hover:text-white">
            Script
          </span>
        </nav>

        <Button
          className="
              py-5 text-lg font-bold text-white rounded-lg border-3 border-[#207D3E]
            bg-gradient-to-b from-[#73D091] to-[#08501F]
            shadow-[inset_0_0_0_1px_black,0_2px_4px_rgba(0,0,0,0.25)]
             transition-all
          "
        >
        Sign up for free
        </Button>
      </div>
    </header>
  )
}

export default Navbar
