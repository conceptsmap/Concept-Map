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
import { Input } from '@/components/ui/input'
import { Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export type PostType = 'synopsis' | 'storyboard' | 'script'

interface Author {
  name: string
  role?: string
  avatar?: string
  jobRole?: string
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

interface Comment {
  id: string
  author: Author
  text: string
  timestamp: string
  likes: number
}

interface PostDetailProps {
  id: string
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
  id,
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
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 10000))
  const [commentCount, setCommentCount] = useState(Math.floor(Math.random() * 5000))
  const [showCommentsModal, setShowCommentsModal] = useState(false)

  const mockComments: Comment[] = [
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        role: 'Producer',
        avatar: 'SJ'
      },
      text: 'This is absolutely amazing! Love the direction and the visual storytelling. Would love to collaborate on this project.',
      timestamp: '2 hours ago',
      likes: 42
    },
    {
      id: '2',
      author: {
        name: 'Mike Chen',
        role: 'Director',
        avatar: 'MC'
      },
      text: 'Great concept! The pacing is really well done. Have you thought about the soundtrack yet?',
      timestamp: '1 hour ago',
      likes: 28
    },
    {
      id: '3',
      author: {
        name: 'Emma Wilson',
        role: 'Screenwriter',
        avatar: 'EW'
      },
      text: 'Love this! The character development is so strong. Looking forward to seeing more.',
      timestamp: '45 minutes ago',
      likes: 15
    },
    {
      id: '4',
      author: {
        name: 'Alex Rodriguez',
        role: 'Cinematographer',
        avatar: 'AR'
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
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed opacity-30">
                      {scene.description.slice(0, locked ? 800 : undefined) /* Show only first 100 chars if locked */}
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
            <img
              src={author.avatar}
              alt={author.name}
              width={48}
              height={48}
              className="rounded-full object-cover w-10 h-10"
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
            {author.jobRole && (
              <p className="text-sm text-gray-500">{author.jobRole}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Image src={liked ? heart_filled : heart} alt="likes" className="w-5 h-5" />
            <span className="font-medium">{likeCount.toLocaleString()}</span>
          </button>

          <button
            onClick={() => setShowCommentsModal(true)}
            className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer"
          >
            <Image src={comment} alt="comments" className="w-5 h-5" />
            <span className="font-medium">{commentCount.toLocaleString()}</span>
          </button>

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
        className={`relative mt-4 rounded-xl ${type === 'storyboard'
          ? 'bg-white p-0'
          : 'bg-[#F5F5F5] p-5'
          }`}
      >
        {renderContent()}

        {/* Locked overlay (SCRIPT ONLY) */}
        {(
          <div className="absolute inset-x-0 bottom-0  bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-end pb-4">
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
        <span className="inline-flex items-center gap-1.5  rounded-lg bg-[#DBFFE7] px-3 py-1 text-sm  text-[#013913] border border-green-100">
          <Lock className="w-3 h-3 text-[#013913]" />
          {rightsLabel}
        </span>

        {publishedAt && (
          <span className="text-xs text-gray-400">
            Published on {publishedAt}
          </span>
        )}
      </div>

      {/* Purchase */}
      {(script?.price || price) && (
        <div className="mt-4 flex items-center justify-end gap-3">
          <span className="text-lg font-bold text-green-600">
            ₹{(script?.price ?? price ?? 0).toLocaleString()}
          </span>
          <Link href={`/checkout?postId=${id}`}>
            <Button className="bg-green-500 hover:bg-green-600 px-6">
              Buy Now
            </Button>
          </Link>
        </div>
      )}
      {/* </div> */}

      {/* Comments Modal */}
      <Dialog open={showCommentsModal} onOpenChange={setShowCommentsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          {/* Comments List */}
          <div className="space-y-4 mt-4">
            {mockComments.map((commentItem) => (
              <div key={commentItem.id} className="flex gap-3 pb-4 border-b border-gray-200 last:border-b-0">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-700">
                      {commentItem.author.avatar}
                    </span>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-gray-900 text-sm">
                      {commentItem.author.name}
                      {commentItem.author.role && (
                        <span className="text-gray-500 font-normal text-xs ml-1">
                          · {commentItem.author.role}
                        </span>
                      )}
                    </p>
                    <p className="text-gray-700 text-sm mt-1">
                      {commentItem.text}
                    </p>
                  </div>

                  {/* Comment Meta */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{commentItem.timestamp}</span>
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Image
                        src={heart}
                        alt="Like"
                        className="w-3 h-3"
                      />
                      <span>{commentItem.likes}</span>
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

export default PostDetail
