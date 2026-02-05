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

export type PostType = 'synopsis' | 'storyboard' | 'script'

interface Author {
  name: string
  role?: string
  avatar?: string
}

export interface PostProps {
  id: string
  author: Author
  title: string
  genres?: string[]
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
}) => {
  const [liked, setLiked] = useState(false)
  const commentInputRef = useRef<HTMLInputElement>(null)

  const getDisplayContent = () => {
    if (type === 'synopsis') return synopsis

    if (type === 'script' && script?.content?.length) {
      return script.content[0].scenes
        .map((scene: { name: string; description: string }) => `🎬 ${scene.name}\n${scene.description}`)
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
            <Image
              src={profile}
              alt={author.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
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
            {author.role && (
              <p className="text-sm text-gray-500">{author.role}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
        <button
  onClick={() => {
    setLiked(prev => !prev)
  }}
  className="flex items-center gap-1.5 transition-colors"
>
  <Image
    src={liked ? heart_filled : heart}
    alt="Like"
    className="w-5 h-5"
  />
   <span className="text-sm font-medium">{likes.toLocaleString()}</span>
</button>

<button
  onClick={() => {
    commentInputRef.current?.focus()
  }}
  className="flex items-center gap-1.5 transition-colors"
>
  <Image src={comment} alt="Comment" className="w-5 h-5" />
  <span className="text-sm font-medium">{comments}</span>
</button>

          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
              <circle cx="8" cy="2.5" r="1.5"/>
              <circle cx="8" cy="8" r="1.5"/>
              <circle cx="8" cy="13.5" r="1.5"/>
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
          {genres?.join(' | ')}
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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 border border-green-100">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1a3 3 0 0 0-3 3v1H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1V4a3 3 0 0 0-3-3zm2 4V4a2 2 0 1 0-4 0v1h4z"/>
          </svg>
          {rightsLabel}
        </span>
      </div>

      {/* Comment Input + See More Button */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        <Input  ref={commentInputRef} placeholder="Add a comment..." />
          <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 rounded-lg border p-2 border-gray-200 bg-white  hover:bg-gray-50 transition-colors shadow-sm">
            <Image src={bookmark} alt="Bookmark" className="w-5 h-5" />
          </button>
        <Link href={`/dashboard/${id}`}>
        <Button className='bg-green-500 hover:bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-colors shadow-sm'>
          See More
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Post


