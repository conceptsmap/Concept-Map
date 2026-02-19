"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import PostCreationScript from "./components/PostCreationScript";
import PostCreationStoryBoard from "./components/PostCreationStoryBoard";
import PostCreationSynopsis from "./components/PostCreationSynopsis";
import { useRouter } from "next/navigation";

type PostType = "script" | "synopsis" | "storyboard";

export default function PostsPage() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type") as PostType | null;
  const primaryType: PostType = ["script", "synopsis", "storyboard"].includes(rawType ?? "")
    ? (rawType as PostType)
    : "script";

  // Track which secondary forms are visible (everything except the primary)
  const [visible, setVisible] = useState<Set<PostType>>(new Set());
  const [loading, setLoading] = useState(false);

  const scriptRef = useRef<(() => void) | null>(null);
  const synopsisRef = useRef<(() => void) | null>(null);
  const storyboardRef = useRef<(() => void) | null>(null);

  const refMap: Record<PostType, React.MutableRefObject<(() => void) | null>> = {
    script: scriptRef,
    synopsis: synopsisRef,
    storyboard: storyboardRef,
  };

  const toggle = (type: PostType) => {
    setVisible((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const handleCreate = async () => {
    // Always submit primary first, then any visible secondaries
    const order: PostType[] = [primaryType, ...Array.from(visible)];
    for (const t of order) {
      const fn = refMap[t].current;
      if (fn) await fn();
    }
    router.push("/my-posts");
  };

  // The two "other" types that can be added as secondary
  const others = (["script", "synopsis", "storyboard"] as PostType[]).filter(
    (t) => t !== primaryType
  );

  const componentProps = (type: PostType) => ({
    submitRef: refMap[type],
    setLoading,
    // Which "add" buttons to show inside this component
    others: others.filter((t) => t !== type),
    visible,
    onToggle: toggle,
  });

  // Render order: primary first, then visible secondaries in the order they were added
  const renderOrder: PostType[] = [primaryType, ...Array.from(visible)];

  return (
    <div className="flex flex-col gap-6">
      {renderOrder.map((type) => {
        if (type === "script") return <PostCreationScript key="script" {...componentProps("script")} />;
        if (type === "synopsis") return <PostCreationSynopsis key="synopsis" {...componentProps("synopsis")} />;
        if (type === "storyboard") return <PostCreationStoryBoard key="storyboard" {...componentProps("storyboard")} />;
      })}

      {/* Single shared Create Post button */}
      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreate} disabled={loading}>
          {loading ? "Submitting..." : "Create Post"}
        </Button>
      </div>
    </div>
  );
}