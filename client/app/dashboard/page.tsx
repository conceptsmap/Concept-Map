import React from 'react'
import Post, { PostProps } from './components/Post'
import { posts } from './components/posts'
import Creative from '@/layout/components/Creative'
import Notifications from '@/layout/components/Notifications'



const DashboardPage = () => {
  return (
    <>
      <div className="flex gap-4 items-start">
        {/* LEFT */}
        <div className="flex-1">
          {posts.map((post: PostProps) => (
            <Post
              key={post.id}
              {...post}
            />
          ))}
        </div>
        {/* RIGHT */}
        <div className="flex flex-col gap-4 shrink-0 w-61.25">
          <Creative />
          <Notifications />
        </div>
      </div>
    </>
  );
}

export default DashboardPage
