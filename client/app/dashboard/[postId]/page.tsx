'use client'
import Layout from '@/layout/components/Layout'

import { notFound, useParams } from 'next/navigation'
import { posts } from '../components/posts'
import PostDetail from '../components/PostDetail'


export default function PostDetailPage() {
  const params = useParams()
  const postId = params.postId as string

  const post = posts.find(p => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <Layout>
      <div className="flex justify-center p-3">
        <PostDetail {...post} />
      </div>
    </Layout>
  )
}
