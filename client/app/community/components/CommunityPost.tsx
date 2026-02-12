import React from 'react'
import Image from 'next/image'
import heart from '@/assets/icons/heart.svg'
import comment from '@/assets/icons/comment.svg'
import postImg from '@/assets/images/community_post.svg'
import profileImg from '@/assets/images/dummy_profile.svg'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Comment {
  id: string
  author: {
    name: string
    username: string
    avatar?: string
  }
  text: string
  replies: {
    id: string
    author: { name: string; username: string; avatar?: string }
    text: string
    createdAt: string
  }[]
  createdAt: string
}

interface Props {
  post: {
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
}

const CommunityPost: React.FC<Props> = ({ post }) => {
  return (
    <div className="w-full rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden p-5">
      {/* Main Post Content */}
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
            <div className='flex gap-5'>
          <div className="flex items-center gap-2 bg-[#DBFFE7] p-1 rounded-lg px-2 text-sm">
            <span className=" text-[#013913]">Started by</span>
            <span className="font-medium text-[#013913]">
              @{post.author.username}
            </span>
          </div>
<div className='text-[#1DBF73] border border-[#1DBF73] p-1 text-center rounded-lg px-2 text-sm'>
    <span>#Trending</span>
</div>
            </div>
<Link href="/community/id">
          <Button className="text-sm bg-[#1DBF73] hover:bg-green-600 text-white px-4 py-1.5 rounded-md font-bold transition-colors">
            Join
          </Button>
        </Link>
        </div>
        {/* Title */}
        <h2 className="font-bold text-xl mb-2">{post.title}</h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3">{post.description}</p>

        {/* File Preview */}
        {post.files?.[0] && (
          <div className="relative w-full h-72 mb-3 rounded-lg overflow-hidden">
            <Image
              src={postImg}
              alt="attachment"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {/* {post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-teal-50 text-teal-600 font-medium border border-teal-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )} */}
      </div>

      {/* Comments Section */}
      {post.comments && post.comments.length > 0 && (
        <div className="flex flex-col gap-3">
          {post.comments.map((comment, index) => (
            <div
              key={comment.id}
              className={`p-4 bg-[#F5F5F5] border-t border-gray-100 rounded-2xl ${
                index !== post.comments.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
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
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-[#484848]">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({comment.createdAt})
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    {comment.text}
                  </p>

                  <div className="flex items-center gap-4 text-xs">
                    <button className="text-gray-500 hover:text-gray-700">
                      View {comment?.replies?.length} replies
                    </button>
                    <button className="text-green-600 hover:text-green-700 font-medium">
                      Replay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommunityPost