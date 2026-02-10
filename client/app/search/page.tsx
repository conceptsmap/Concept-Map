"use client";

import Notifications from "@/layout/components/Notifications";
import Creative from "@/layout/components/Creative";
import Post from "../dashboard/components/Post";
import { posts } from "../dashboard/components/posts";

export default function ScriptsPage() {
  return (
    <div className="flex gap-4 items-start">
      {/* LEFT */}
      <div className="flex-1">
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
      {/* RIGHT */}
      <div className="flex flex-col gap-4 shrink-0 w-[245px]">
        <Creative />
        <Notifications />
      </div>
    </div>
  );
}
