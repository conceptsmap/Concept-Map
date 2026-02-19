"use client";
import React, { useRef, useState } from 'react'
import Image from 'next/image'

import heart from '@/assets/icons/heart.svg'
import comment from '@/assets/icons/comment.svg'
import bookmark from '@/assets/icons/bookmark.svg'
import expand from '@/assets/icons/expand.svg'
import storyboardImg from '@/assets/images/storyboard.jpg'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import heart_filled from '@/assets/icons/heart_filled.svg'
import Link from 'next/link'
import profile from '@/assets/images/dummy_profile.svg'
import { Bookmark, Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type PostType = 'synopsis' | 'storyboard' | 'script'

interface Author {
  name: string
  jobRole?: string
  avatar?: string
  profile?: string
}

export interface PostProps {
  id: string
  author: Author
  title: string
  genres?: string[]
  description?: string
  content?: string
  type: PostType
  likes: number
  comments: number
  rightsLabel?: string
  onExpand?: () => void

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
}

interface Comment {
  id: string
  author: Author
  text: string
  timestamp: string
  likes: number
}


const Post: React.FC<PostProps> = ({
  id,
  author,
  title,
  genres,
  type,
  likes,
  comments,
  rightsLabel = 'Basic / Exclusive Rights',
  synopsis,
  script,
  storyboard,
  onExpand,
  description
}) => {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 10000))
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const commentInputRef = useRef<HTMLInputElement>(null)

  // Mock comments data
  const mockComments: Comment[] = [
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        jobRole: 'Producer',
        avatar: 'SJ',
        profile: profile
      },
      text: 'This is absolutely amazing! Love the direction and the visual storytelling. Would love to collaborate on this project.',
      timestamp: '2 hours ago',
      likes: 42
    },
    {
      id: '2',
      author: {
        name: 'Mike Chen',
        jobRole: 'Director',
        avatar: 'MC',
        profile: profile
      },
      text: 'Great concept! The pacing is really well done. Have you thought about the soundtrack yet?',
      timestamp: '1 hour ago',
      likes: 28
    },
    {
      id: '3',
      author: {
        name: 'Emma Wilson',
        jobRole: 'Screenwriter',
        avatar: 'EW',
        profile: profile
      },
      text: 'Love this! The character development is so strong. Looking forward to seeing more.',
      timestamp: '45 minutes ago',
      likes: 15
    },
    {
      id: '4',
      author: {
        name: 'Alex Rodriguez',
        jobRole: 'Cinematographer',
        avatar: 'AR',
        profile: profile
      },
      text: 'The visual composition is stunning. Would be perfect for a feature length production.',
      timestamp: '30 minutes ago',
      likes: 21
    }
  ]

  const handleLike = () => {
    setLiked(prev => !prev)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  const handleSave = () => {
    setSaved(prev => !prev)
  }

  const getDisplayContent = () => {
    if (type === 'synopsis') return synopsis

    if (type === 'script' && script?.content?.length) {
      return script.content[0].scenes
        .map((scene: { name: string; description: string }) => `${scene.description}`)
        .join('\n\n')
    }

    return ''
  }
  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {author.avatar ? (
            <img
              src={author.profile || profile}
              alt={author.name}
              width={48}
              height={48}
              className="rounded-full object-cover w-10 h-10"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-lg font-semibold">
                {author.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="text-base font-semibold text-gray-900">{author.name}</p>
            {author.jobRole && (
              <p className="text-sm text-gray-500">{author.jobRole}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 transition-colors hover:text-red-500"
          >
            <Image
              src={liked ? heart_filled : heart}
              alt="Like"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">{likeCount.toLocaleString()}</span>
          </button>

          <button
            onClick={() => setShowCommentsModal(true)}
            className="flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Image src={comment} alt="Comment" className="w-5 h-5" />
            <span className="text-sm font-medium">{Math.floor(Math.random() * 10000)}</span>
          </button>

          <button className="text-black hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
              <circle cx="8" cy="2.5" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13.5" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title & Genres */}
      <div className="mb-3">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {title}
        </h2>
        <p className="text-sm text-gray-500 font-medium">
          {description}
        </p>
      </div>

      {/* Content Box */}
      {/* Content */}
      {type === 'storyboard' && storyboard?.image ? (
        <div className="relative mb-4 overflow-hidden rounded-lg border border-gray-200">
          {/* Cropped storyboard image */}
          <div className="relative h-64 w-full">
            <Image
              src={storyboardImg}
              alt={title}
              fill
              className="object-cover object-top"
            />
          </div>

          {/* Overlay: badge + expand */}
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="inline-block rounded-md bg-white px-3 p-1 text-sm font-medium text-[#013913] shadow-sm border">
              storyboard
            </span>

            <button
              onClick={onExpand}
              className="rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
            >
              <Image src={expand} alt="Expand" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg bg-[#F5F5F5] p-4 mb-4">
          <div className="flex gap-3">
            {/* Text */}
            <div className="flex-1 pr-14">
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 whitespace-pre-line">
                {getDisplayContent()}
              </p>
            </div>

            {/* Type + expand */}
            <div className="flex flex-row items-start gap-2 flex-shrink-0 min-w-[60px]">
              <span className="inline-block rounded-md bg-white px-3 p-1 text-sm font-medium text-[#013913] shadow-sm border">
                {type}
              </span>

              <button
                onClick={onExpand}
                className="rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
              >
                <Link href={`/dashboard/${id}`}>
                  <Image src={expand} alt="Expand" />
                </Link>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Footer: Rights Badge */}
      <div className="flex items-center justify-start mb-4">
        <span className="inline-flex items-center gap-1.5  rounded-lg bg-[#DBFFE7] px-3 py-1 text-sm  text-[#013913] border border-green-100">
          <Lock className="w-3 h-3 text-[#013913]" />

          {rightsLabel}
        </span>
      </div>

      {/* Comment Input + See More Button */}
      <div className="flex items-center gap-3  0">
        <Input ref={commentInputRef} placeholder="Add a comment..." />
        <button
          onClick={handleSave}
          className={`flex-shrink-0 rounded-lg border p-2 transition-colors shadow-sm ${false
            ? 'border-yellow-400 bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
            : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
          title={saved ? 'Remove from saves' : 'Save post'}
        >
          {/* <Image src={bookmark} alt="Bookmark" className="w-5 h-5 text-green-800" /> */}
          <Bookmark
            className={`w-6 h-6 ${saved
              ? "text-green-500 fill-green-500"
              : "text-black/70 fill-none"
              }`}
          />
        </button>
        <Link href={`/dashboard/${id}`}>
          <Button className='bg-green-500 hover:bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-colors shadow-sm'>
            See More
          </Button>
        </Link>
      </div>

      {/* Comments Modal */}
      <Dialog open={showCommentsModal} onOpenChange={setShowCommentsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-scroll   
            [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          {/* Comments List */}
          <div className="space-y-4 mt-4">
            {mockComments.map((comment) => (
              <div key={comment.id} className="flex gap-3 pb-4 border-b border-gray-200 last:border-b-0">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-700">
                      {comment.author.avatar}
                    </span>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-gray-900 text-sm">
                      {comment.author.name}
                      {comment.author.jobRole && (
                        <span className="text-gray-500 font-normal text-xs ml-1">
                          · {comment.author.jobRole}
                        </span>
                      )}
                    </p>
                    <p className="text-gray-700 text-sm mt-1">
                      {comment.text}
                    </p>
                  </div>

                  {/* Comment Meta */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{comment.timestamp}</span>
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Image
                        src={heart}
                        alt="Like"
                        className="w-3 h-3"
                      />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="hover:text-gray-700 transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Input */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                className="flex-1"
              />
              <Button className="bg-green-500 hover:bg-green-600">
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Post


