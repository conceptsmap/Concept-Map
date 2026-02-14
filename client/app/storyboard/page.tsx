"use client";

import PostCreationStoryBoard from "./components/PostCreationStoryBoard";
import Notifications from "@/layout/components/Notifications";
import Creative from "@/layout/components/Creative";

export default function SynopsisPage() {
  return (
    <div className="flex gap-4 items-start space-y-3">
      {/* LEFT */}
      <div className="flex-1">
        <PostCreationStoryBoard />
      </div>
      {/* RIGHT */}
    </div>
  );
}
