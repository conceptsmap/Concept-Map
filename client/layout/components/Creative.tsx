"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FilePenLine,
  MessagesSquareIcon,
  Plus,
  ScrollText,
  Table2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PostCreativeSelector() {
  const router = useRouter();
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role === "CREATOR") {
      setIsCreator(true);
    }
  }, []);

  if (!isCreator) return null;

  const handleScriptClick = () => {
    router.push("/posts?type=script");
  };

  const handleSynopsisClick = () => {
    router.push("/posts?type=synopsis");
  };

  const handleStoryboardClick = () => {
    router.push("/posts?type=storyboard");
  };

  return (
    <div className=" xl:max-w-75 lg:max-w-56 rounded-2xl bg-white p-5 shadow-md space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-bold flex items-center">
          <Table2 className="h-4 w-4 mr-1 inline" />
          Post a Creative
        </h3>
        <p className="text-sm text-gray-500">
          Choose a post type and share your creative work with buyers.
        </p>
      </div>

      <div className="space-y-3">
        <CreativeItem
          emoji={<MessagesSquareIcon className="h-5 w-5" />}
          bg="bg-green-600"
          title="Synopsis"
          desc="Post a new synopsis"
          onClick={handleSynopsisClick}
        />

        <CreativeItem
          emoji={<ScrollText className="h-5 w-5" />}
          bg="bg-purple-600"
          title="Story Board"
          desc="Post a new story board"
          onClick={handleStoryboardClick}
        />

        <CreativeItem
          emoji={<FilePenLine className="h-5 w-5" />}
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
  emoji: React.ReactNode;
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
        <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center text-white`}>
          {emoji}
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>

      <Button size="icon" variant="ghost">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
