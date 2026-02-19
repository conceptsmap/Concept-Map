'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import { posts } from '../components/posts'
import PostDetail from '../components/PostDetail'
import PostDetailSkeleton from '../components/PostDetailSkeleton'

interface PostData {
  id: string
  author: {
    name: string
    role?: string
    avatar?: string
    jobRole?: string
  }
  title: string
  description?: string
  hashtags?: string[]
  type: 'synopsis' | 'storyboard' | 'script'
  likes: number
  comments: number
  rightsLabel?: string
  publishedAt?: string
  locked?: boolean
  synopsis?: string
  script?: {
    price?: number
    currency?: string
    content?: {
      name: string
      scenes: {
        name: string
        description: string
      }[]
    }[]
  }
  storyboard?: {
    image: string
  }
  price?: number
}

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.postId as string

  const [post, setPost] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // First check static posts
    const staticPost = posts.find(p => p.id === postId)
    if (staticPost) {
      setPost(staticPost as PostData)
      setLoading(false)
      return
    }

    // If not found in static posts, fetch from API
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/script/${postId}`)
        const data = await res.json()
        if (res.ok && data?.data) {
          const script = data.data
          // Map API response to PostData format
          const mappedPost: PostData = {
            id: script._id || script.id,
            author: script.userId && typeof script.userId === 'object'
              ? {
                name: script.userId.username || 'Unknown',
                role: script.userId.role || '',
                jobRole: script.userId.jobRole || '',
                avatar: script.userId.profile_url || '',
              }
              : { name: 'Unknown', role: '', avatar: '' },
            title: script.main_title || script.title || 'Untitled',
            description: script.description || '',
            type: Array.isArray(script.type) && script.type.length > 0
              ? script.type[0].toLowerCase()
              : 'script',
            likes: typeof script.likes === 'number' ? script.likes : 0,
            comments: typeof script.comments === 'number' ? script.comments : 0,
            rightsLabel: script.rightsLabel || 'Basic / Exclusive Rights',
            synopsis: script.synopsis?.content,
            script: script.script,
            storyboard: script.story_borad?.content?.[0]?.cloud_url
              ? { image: script.story_borad.content[0].cloud_url }
              : undefined,
            price: script.script?.price || script.synopsis?.price || script.story_borad?.price,
          }
          setPost(mappedPost)
        } else {
          setError(true)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    })()
  }, [postId])

  if (loading) {
    return (
      <div className="flex justify-center p-3">
        <PostDetailSkeleton />
      </div>
    )
  }

  if (error || !post) {
    notFound()
  }

  return (
    <div className="flex justify-center p-3">
      <PostDetail {...post} />
    </div>
  )
}
