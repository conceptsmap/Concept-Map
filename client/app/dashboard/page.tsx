import React from 'react'
import Post, { PostProps } from './components/Post'
import { posts } from './components/posts'
import Navbar from '@/layout/components/Navbar';

const DashboardPage = () => {
  return (
    <>
      <div className=" gap-4 items-start">
        <Navbar />
        {/* LEFT */}
        <div className="flex-1 gap-3 flex flex-col">
          {posts.map((post: PostProps) => (
            <Post
              key={post.id}
              {...post}
            />
          ))}
        </div>
        {/* RIGHT */}
      </div>
    </>
  );
}

export default DashboardPage
