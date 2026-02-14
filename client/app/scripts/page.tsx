"use client";

import PostCreationScript from "./components/PostCreationScript";
import Notifications from "@/layout/components/Notifications";
import Creative from "@/layout/components/Creative";

export default function ScriptsPage() {
  return (
    <div className="flex gap-4 items-start">
      {/* LEFT */}
      <div className="flex-1">
        <PostCreationScript />
      </div>
      {/* RIGHT */}
    </div>
  );
}
