import { Button } from "@/components/ui/button";
import Image from "next/image";
import img1 from "@/assets/images/Frame 16 (9) 1.png";
import img2 from "@/assets/images/Frame 16 (8) 1.png";
import img3 from "@/assets/images/Frame 1 (5) 1.png";
import img4 from "@/assets/images/Frame 16 (7) 1.png";
import img5 from "@/assets/images/Frame 12 (2) 1.png";

const Content = () => {
  return (
    <div>
      <section className="flex flex-col items-center justify-center text-center py-20  bg-white">
        <h1
          className="
          max-w-4xl text-3xl md:text-5xl leading-tight
          bg-linear-to-b from-[#1DBF73] to-[#013913]
          bg-clip-text text-transparent
        "
        >
          Discover high-quality scripts, storyboards, and synopsis from top
          creators. Monetize your creativity or find your next big idea!
        </h1>

        <p
          className="
          mt-6 max-w-2xl text-sm md:text-base
          bg-gradient-to-b from-[#1DBF73] to-[#013913]
          bg-clip-text text-transparent
        "
        >
          Join a marketplace where scriptwriters and agencies connect seamlessly.
        </p>

        <div className="mt-10 flex flex-wrap gap-5 justify-center">
          <Button
            className="
            px-4 py-5 text-lg font-semibold text-white rounded-lg border-3 border-[#1DBF73]
            bg-gradient-to-b from-[#98F3C8] to-[#1DBF73]
            shadow-[inset_0_0_0_1px_#1DBF73,0_2px_4px_rgba(0,0,0,0.25)]
             transition-all
          "
          >
            Browse Marketplace
          </Button>
          <Button
            className="
            px-6 py-5 text-lg font-semibold text-white rounded-lg border-3 border-[#207D3E]
            bg-gradient-to-b from-[#73D091] to-[#08501F]
            shadow-[inset_0_0_0_1px_black,0_2px_4px_rgba(0,0,0,0.25)]
             transition-all
          "
          >
            Start Selling
          </Button>
        </div>
      </section>
      <section>
        <div
          className="
      relative mx-auto
      rounded-t-[60px]
      bg-gray-100
      p-10 md:p-16
      overflow-hidden
    "
        >
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[1200px]">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-48 items-center px-6 md:px-12">

                <div className="text-left">
                  <h2 className="text-3xl md:text-5xl text-[#013913] font-medium">
                    Unlock Original <br /> Scripts & Stories
                  </h2>

                  <p className="mt-5 max-w-md text-sm md:text-base text-[#013913]">
                    Browse through professionally written scripts across multiple
                    genres. Get inspired, adapt, or produce your next big project!
                  </p>

                  <Button
                    className="
                mt-8 px-5 py-5 text-lg font-semibold text-white rounded-lg
                bg-gradient-to-b from-[#73D091] to-[#08501F]
                shadow-[inset_0_0_0_1px_black,0_2px_4px_rgba(0,0,0,0.25)]
              "
                  >
                    Explore Scripts
                  </Button>
                </div>

                <div className="relative h-[460px] w-full">
                  <div className="absolute -left-45 top-18 z-10 rounded-xl">
                    <Image width={400} src={img3} alt="Script card" className="rounded-xl" />
                  </div>

                  <div className="absolute -right-35 top-0 z-10 rounded-xl">
                    <Image width={400} src={img2} alt="Script card" className="rounded-xl" />
                  </div>

                  <div className="absolute right-25 -top-10 z-0 rounded-xl">
                    <Image width={400} height={300} src={img1} alt="Script card" className="rounded-xl" />
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      <section>
        <div
          className="
      relative mx-auto
      rounded-3xl
      bg-gradient-to-r from-[#ECFBF3] to-[#E6F7EE]
      p-10 md:p-16 md:py-24 md:pb-36
      overflow-hidden
    "
        >
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[1200px]">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-48 items-center">

                <div className="relative h-[380px] w-full flex items-center justify-center">
                  <div className="absolute -right-25 top-18 z-20 rounded-xl">
                    <Image
                      src={img5}
                      width={400}
                      height={300}
                      alt="Synopsis preview"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="absolute z-10 rounded-xl">
                    <Image
                      width={400}
                      height={300}
                      src={img4}
                      alt="Synopsis preview"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="text-left">
                  <h2 className="text-3xl md:text-5xl text-[#013913] font-medium">
                    Engaging Summaries <br /> at a Glance
                  </h2>

                  <p className="mt-5 max-w-md text-sm md:text-base text-[#013913]">
                    Not ready for a full script? Discover well-crafted synopses to get a
                    quick overview of compelling stories before diving deeper.
                  </p>

                  <Button
                    className="
                mt-8 px-5 py-5 text-lg font-bold text-white rounded-lg
                bg-gradient-to-b from-[#73D091] to-[#08501F]
                shadow-[inset_0_0_0_1px_black,0_2px_4px_rgba(0,0,0,0.25)]
              "
                  >
                    Browse Synopsis
                  </Button>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Content;
