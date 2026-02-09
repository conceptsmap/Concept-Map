import Layout from '@/layout/components/Layout'
import React from 'react'
import Post, { PostProps } from './components/Post'
import { posts } from './components/posts'
import Creative from '@/layout/components/Creative'
import Notifications from '@/layout/components/Notifications'


const DashboardPage = () => {
  return (
    <Layout>
      {/* <div className="p-3 space-y-3">
        {posts.map(post => (
          <Post
            key={post.id}
            {...post}
          />
        ))}
      </div> */}

            <div className="flex gap-4 items-start">
              {/* LEFT */}
              <div className="flex-1">
        {posts.map(post => (
          <Post
            key={post.id}
            {...post}
          />
        ))}
              </div>
              {/* RIGHT */}
              <div className="flex flex-col gap-4 shrink-0 w-[245px]">
                <Creative />
                <Notifications />
              </div>
            </div>
    </Layout>
  )
}

export default DashboardPage
