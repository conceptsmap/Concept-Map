"use client";


import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PostCreativeSelector() {
  const router = useRouter();
  // Handler for Script click
  const handleScriptClick = () => {
    router.push("/scripts");
  };
  // Handler for Synopsis click
  const handleSynopsisClick = () => {
    router.push("/synopsis");
  };
  // Handler for Story Board click
  const handleStoryboardClick = () => {
    router.push("/storyboard");
  };
  return (
    <div
      className="
        w-full
        max-w-95
        xl:max-w-60
        lg:max-w-85
        rounded-2xl
        bg-white
        p-5
        shadow-md
        space-y-4
      "
    >
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-base font-semibold">Post a Creative</h3>
        <p className="text-sm text-gray-500">
          Choose a post type and share your creative work with buyers.
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {/* Synopsis */}
        <CreativeItem
          emoji="🧾"
          bg="bg-green-600"
          title="Synopsis"
          desc="Post a new synopsis"
          onClick={handleSynopsisClick}
        />

        {/* Story Board */}
        <CreativeItem
          emoji="🔄"
          bg="bg-purple-600"
          title="Story Board"
          desc="Post a new story board"
          onClick={handleStoryboardClick}
        />

        {/* Script */}
        <CreativeItem
          emoji="✍️"
          bg="bg-green-700"
          title="Script"
          desc="Post a new script"
          onClick={handleScriptClick}
        />
      </div>
    </div>
  );
}

function CreativeItem({
  emoji,
  bg,
  title,
  desc,
  onClick,
}: {
  emoji: string;
  bg: string;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-xl border p-3 hover:bg-gray-50 transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center text-white`}
        >
          {emoji}
        </div>
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>

      <Button size="icon" variant="ghost">
        +
      </Button>
    </div>
  );
}
