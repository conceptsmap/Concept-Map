"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MessageCircle, Send } from 'lucide-react'
import postImg from '@/assets/images/community_post.svg'
import profileImg from '@/assets/images/dummy_profile.svg'
import { communityPosts as posts } from '@/app/community/dummyData'

interface Reply {
  id: string
  author: {
    name: string
    username: string
    avatar?: string
  }
  text: string
  createdAt: string
}

interface Comment {
  id: string
  author: {
    name: string
    username: string
    avatar?: string
  }
  text: string
  replies: Reply[]
  createdAt: string
}

interface Post {
  id: string
  author: {
    name: string
    username: string
    avatar?: string
  }
  title: string
  description: string
  tags: string[]
  files?: { url: string; type: string }[]
  likes: number
  comments: Comment[]
  createdAt: string
}

interface Props {
  post: Post
}

const PostDetail: React.FC<Props> = () => {
    const post = posts[0]
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({})
  const [replyText, setReplyText] = useState('')
  const [commentReplyText, setCommentReplyText] = useState<{ [key: string]: string }>({})

  const toggleReplies = (commentId: string) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  const handleMainReply = () => {
    if (replyText.trim()) {
      // Handle main reply submission
      console.log('Main reply:', replyText)
      setReplyText('')
    }
  }

  const handleCommentReply = (commentId: string) => {
    const text = commentReplyText[commentId]
    if (text?.trim()) {
      // Handle comment reply submission
      console.log('Reply to comment:', commentId, text)
      setCommentReplyText(prev => ({
        ...prev,
        [commentId]: ''
      }))
    }
  }

  return (
    <div className=" mx-auto">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-[#DBFFE7] px-3 py-1.5 rounded-lg text-sm">
              <span className="text-[#013913]">Started by</span>
              <span className="font-medium text-[#013913]">
                @{post?.author?.username}
              </span>
            </div>
            <div className="text-[#1DBF73] border border-[#1DBF73] px-3 py-1.5 rounded-lg text-sm font-medium">
              #Trending
            </div>
          </div>

          {/* Title */}
          <h1 className="font-bold text-2xl md:text-3xl mb-3 text-gray-900">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-base text-gray-600 mb-4 leading-relaxed">
            {post.description}
          </p>

          {/* Featured Image */}
          {post.files?.[0] && (
            <div className="relative w-full h-64 md:h-88 rounded-xl overflow-hidden mb-6">
              <Image
                src={postImg}
                alt="Post attachment"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-100">
          {post.comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 last:border-b-0">
              {/* Main Comment */}
              <div className="p-5 md:p-6">
                <div className="flex gap-3">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={profileImg}
                        alt={comment.author.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900">
                        {comment.author.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({comment.createdAt})
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {comment.text}
                    </p>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 text-xs mb-3">
                      {comment.replies.length > 0 && (
                        <button
                          onClick={() => toggleReplies(comment.id)}
                          className="text-gray-500 hover:text-gray-700 font-medium"
                        >
                          {showReplies[comment.id] ? 'Hide' : 'View'}{' '}
                          {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </button>
                      )}
                      <button className="text-[#1DBF73] hover:text-green-700 font-medium">
                        Reply
                      </button>
                    </div>

                    {/* Nested Replies */}
                    {showReplies[comment.id] && comment.replies.length > 0 && (
                      <div className="space-y-4 mt-4 pl-4 border-l-2 border-gray-200">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            {/* Reply Profile Image */}
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                <Image
                                  src={profileImg}
                                  alt={reply.author.name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              </div>
                            </div>

                            {/* Reply Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-semibold text-sm text-gray-900">
                                  {reply.author.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({reply.createdAt})
                                </span>
                              </div>

                              <p className="text-sm text-gray-700 leading-relaxed">
                                {reply.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Input Section */}
        <div className="p-5 md:p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={profileImg}
                  alt="Your profile"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleMainReply()
                    }
                  }}
                />
                <button
                  onClick={handleMainReply}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#1DBF73] hover:bg-green-50 rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail