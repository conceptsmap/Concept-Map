"use client";

import PostCreationStoryBoard from "./components/PostCreationStoryBoard";
import Layout from "@/layout/components/Layout";
import Notifications from "@/layout/components/Notifications";
import Creative from "@/layout/components/Creative";

export default function SynopsisPage() {
  return (
    <Layout>
      <div className="flex gap-4 items-start p-3 space-y-3">
        {/* LEFT */}
        <div className="flex-1">
          <PostCreationStoryBoard />
        </div>
        {/* RIGHT */}
        <div className="flex flex-col gap-4 shrink-0 w-[245px]">
          <Creative />
          <Notifications />
        </div>
      </div>
    </Layout>
  );
}
