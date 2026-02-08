import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import heart from '@/assets/icons/heart.svg'
import comment from '@/assets/icons/comment.svg'
import lock from '@/assets/icons/lock.svg'
import lockWhite from '@/assets/icons/lock_white.svg'
import storyboardImg from '@/assets/images/storyboard.jpg'
import heart_filled from '@/assets/icons/heart_filled.svg'
import profile from '@/assets/images/dummy_profile.svg'

import { Button } from '@/components/ui/button'

export type PostType = 'synopsis' | 'storyboard' | 'script'

interface Author {
  name: string
  role?: string
  avatar?: string
}

interface ScriptScene {
  name: string
  description: string
}

interface ScriptBlock {
  name: string
  scenes: ScriptScene[]
}

interface ScriptData {
  price?: number
  currency?: string
  content?: ScriptBlock[]
}

interface PostDetailProps {
  author: Author
  title: string
  description?: string
  hashtags?: string[]
  type: PostType
  likes: number
  comments: number
  rightsLabel?: string
  publishedAt?: string
  locked?: boolean

  synopsis?: string
  script?: ScriptData
  storyboard?: {
    image: string
  }
  price?: number
}

const PostDetail: React.FC<PostDetailProps> = ({
  author,
  title,
  description,
  hashtags = [],
  type,
  likes,
  comments,
  rightsLabel = 'Exclusive Licence',
  publishedAt,
  locked = true,
  synopsis,
  script,
  storyboard,
  price,
}) => {
  const [liked, setLiked] = useState(false)
  const renderContent = () => {
    /* SYNOPSIS */
    if (type === 'synopsis') {
      return (
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {synopsis}
        </p>
      )
    }

    /* SCRIPT */
    if (type === 'script' && script?.content?.length) {
      return (
        <div className="space-y-6">
          {script.content.map((block, blockIdx) => (
            <div key={blockIdx}>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {block.name}
              </h3>

              <div className="space-y-4">
                {block.scenes.map((scene, sceneIdx) => (
                  <div key={sceneIdx}>
                    <p className="font-medium text-gray-800 mb-1">
                      🎬 {scene.name}
                    </p>
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                      {scene.description}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    /* STORYBOARD */
    if (type === 'storyboard' && storyboard?.image) {
      return (
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-200">
          <Image
            src={storyboardImg}
            alt={title}
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
          />
        </div>
      )
    }

    return null
  }

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between">
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
              <span className="text-gray-600 font-semibold">
                {author.name.charAt(0)}
              </span>
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-900">{author.name}</p>
            {author.role && (
              <p className="text-sm text-gray-500">{author.role}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1" onClick={() => {
            setLiked(prev => !prev)
          }}>
            <Image src={liked ? heart_filled : heart} alt="likes" className="w-5 h-5" />
            <span className="font-medium">{likes.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <Image src={comment} alt="comments" className="w-5 h-5" />
            <span className="font-medium">{comments}</span>
          </div>

          <span className="text-xl leading-none">⋮</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        {title}
      </h1>

      {/* Description */}
      {description && (
        <p className="mt-2 text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      )}

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
          {hashtags.map(tag => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}

      {/* Content */}
      <div
        className={`relative mt-4 rounded-xl ${
          type === 'storyboard'
            ? 'bg-white p-0'
            : 'bg-[#F5F5F5] p-5'
        }`}
      >
        {renderContent()}

        {/* Locked overlay (SCRIPT ONLY) */}
        {(
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-end pb-4">
            <div className="rounded-md bg-[#013913] text-white px-4 py-2 text-sm font-semibold flex items-center gap-2">
              <Image src={lockWhite} alt="lock" className="w-4 h-4" />
              Locked
            </div>

            <p className="mt-2 text-sm text-gray-600 text-center max-w-sm">
              Unlock the full script and bring your vision to life.
              Purchase now to access the complete dialogue and scene details.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#013913] border border-green-100">
          <Image src={lock} alt="rights" width={14} height={14} />
          {rightsLabel}
        </span>

        {publishedAt && (
          <span className="text-xs text-gray-400">
            Published on {publishedAt}
          </span>
        )}
      </div>

      {/* Purchase */}
      {( script?.price ||price) && (
        <div className="mt-4 flex items-center justify-end gap-3">
          <span className="text-lg font-bold text-green-600">
          ₹{(script?.price ?? price ?? 0).toLocaleString()}
          </span>
          <Link href="/checkout">
            <Button className="bg-green-500 hover:bg-green-600 px-6">
              Buy Now
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default PostDetail
