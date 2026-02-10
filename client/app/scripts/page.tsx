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
      <div className="flex flex-col gap-4 shrink-0 w-[245px]">
        <Creative />
        <Notifications />
      </div>
    </div>
  );
}
