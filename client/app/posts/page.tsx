"use client";

import { useSearchParams } from "next/navigation";
import PostCreationScript from "./components/PostCreationScript";
import PostCreationStoryBoard from "./components/PostCreationStoryBoard";
import PostCreationSynopsis from "./components/PostCreationSynopsis";

export default function PostsPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const getOrderedComponents = () => {
    const components = {
      script: <PostCreationScript key="script" />,
      synopsis: <PostCreationSynopsis key="synopsis" />,
      storyboard: <PostCreationStoryBoard key="storyboard" />,
    };

    const order = ["script", "synopsis", "storyboard"] as const;
    
    // Move selected type to first position
    if (type && order.includes(type as typeof order[number])) {
      const selectedType = type as typeof order[number];
      const reordered = [selectedType, ...order.filter((t) => t !== selectedType)];
      return reordered.map((t) => components[t]);
    }

    // Default order
    return order.map((t) => components[t]);
  };

  return (
    <div className="flex gap-4 items-start">
      {/* LEFT */}
      <div className="flex-1 flex flex-col gap-8">
        {getOrderedComponents()}
      </div>
    </div>
  );
}
