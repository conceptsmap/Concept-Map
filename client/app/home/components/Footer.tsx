import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import img1 from "@/assets/images/Frame 16 (6) 1.png";
import img2 from "@/assets/images/Frame 11 (2) 1.png";
import fb from "@/assets/icons/fb.svg"
import x from "@/assets/icons/x.svg"
import yt from "@/assets/icons/yt.svg"
import instagram from "@/assets/icons/instagram.svg"

const Footer = () => {
  return (
<section>
  <div
  className="
    relative mx-auto
    rounded-t-[60px]
    bg-gradient-to-b from-[#013913] to-[#0B5A2A]
    p-10 md:p-16
    overflow-hidden
  "
>
    <div className="w-full flex justify-center">
    <div className="w-full max-w-[1200px]">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center px-6 md:px-12">

        <div className="text-white">
          <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
            Visualize the Story <br /> Before It Comes to Life
          </h2>

          <p className="mt-5 max-w-md text-sm md:text-base text-[#CFF3E1]">
            Storyboards help bring ideas to life with scene-by-scene
            visualizations.
          </p>

          <Button
            className="
              mt-8 px-4 py-5 text-lg font-bold text-white rounded-lg
              bg-gradient-to-b from-[#98F3C8] to-[#1DBF73]
              shadow-[inset_0_0_0_1px_#1DBF73,0_2px_4px_rgba(0,0,0,0.25)]
            "
          >
            View Storyboards
          </Button>
        </div>

        <div className="relative h-[360px]">
          <Image
            src={img2}
            width={400}
            height={300}
            alt="Storyboard preview"
            className="absolute -left-20 z-10 top-20 rounded-xl"
          />

          <Image
            src={img1}
            width={400}
            height={300}
            alt="Storyboard preview"
            className="absolute right-0 top-0 rounded-xl"
          />
        </div>

      </div>
    </div>
  </div>
 </div>
  <footer className="bg-white border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex gap-6 text-sm">
        {["Copyright Notice", "FAQ", "Privacy Policy", "Terms & Conditions"].map(
          (item) => (
            <a
              key={item}
              href="#"
              className="
                font-medium
                bg-gradient-to-r from-[#1DBF73] to-[#013913]
                bg-clip-text text-transparent
              "
            >
              {item}
            </a>
          )
        )}
      </div>

      <div className="flex gap-3">
        {[fb, instagram, x, yt].map((icon, i) => (
          <Image key={i} src={icon} alt="social" />
        ))}
      </div>
    </div>
  </footer>
</section>

  );
};

export default Footer;
