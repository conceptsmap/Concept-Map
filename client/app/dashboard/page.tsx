import Layout from '@/layout/components/Layout'
import React from 'react'
import Post, { PostProps } from './components/Post'
import { posts } from './components/posts'


const DashboardPage = () => {
  return (
    <Layout>
      <div className="p-3 space-y-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {posts.map(post => (
          <Post
            key={post.id}
            {...post}
          />
        ))}
      </div>
    </Layout>
  )
}

export default DashboardPage
