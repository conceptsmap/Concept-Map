"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import PostCreationScript from "./components/PostCreationScript";
import PostCreationStoryBoard from "./components/PostCreationStoryBoard";
import PostCreationSynopsis from "./components/PostCreationSynopsis";
import { useRouter } from "next/navigation";

type PostType = "script" | "synopsis" | "storyboard";
type SubmitMode = "publish" | "draft";

// ✅ Inner component that uses useSearchParams
const PostsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type") as PostType | null;
  const primaryType: PostType = ["script", "synopsis", "storyboard"].includes(rawType ?? "")
    ? (rawType as PostType)
    : "script";

  const [visible, setVisible] = useState<Set<PostType>>(new Set());
  const [loading, setLoading] = useState(false);

  const scriptRef = useRef<((mode?: SubmitMode) => Promise<any> | any) | null>(null);
  const synopsisRef = useRef<((mode?: SubmitMode) => Promise<any> | any) | null>(null);
  const storyboardRef = useRef<((mode?: SubmitMode) => Promise<any> | any) | null>(null);

  const refMap: Record<PostType, React.MutableRefObject<((mode?: SubmitMode) => Promise<any> | any) | null>> = {
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

  const handleSubmitAll = async (mode: SubmitMode) => {
    try {
      setLoading(true);
      const order: PostType[] = [primaryType, ...Array.from(visible)];

      for (const t of order) {
        const fn = refMap[t].current;
        if (fn) {
          const result: any = await fn(mode);
          if (result === false || !result) {
            setLoading(false);
            return;
          }
        }
      }

      router.push("/my-posts");
    } catch (error) {
      console.error("Submission failed:", error);
      setLoading(false);
    }
  };

  const others = (["script", "synopsis", "storyboard"] as PostType[]).filter(
    (t) => t !== primaryType
  );

  const componentProps = (type: PostType) => ({
    submitRef: refMap[type],
    setLoading,
    others: others.filter((t) => t !== type),
    visible,
    onToggle: toggle,
  });

  const renderOrder: PostType[] = [primaryType, ...Array.from(visible)];

  return (
    <div className="flex flex-col gap-6">
      {renderOrder.map((type) => {
        if (type === "script") return <PostCreationScript key="script" {...componentProps("script")} />;
        if (type === "synopsis") return <PostCreationSynopsis key="synopsis" {...componentProps("synopsis")} />;
        if (type === "storyboard") return <PostCreationStoryBoard key="storyboard" {...componentProps("storyboard")} />;
      })}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => handleSubmitAll("draft")} disabled={loading}>
          {loading ? "Submitting..." : "Save as Draft"}
        </Button>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleSubmitAll("publish")} disabled={loading}>
          {loading ? "Submitting..." : "Create Post"}
        </Button>
      </div>
    </div>
  );
};

// ✅ Default export wraps with Suspense
export default function PostsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
      <PostsContent />
    </Suspense>
  );
}