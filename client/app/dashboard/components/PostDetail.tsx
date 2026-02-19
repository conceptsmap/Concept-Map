import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import heart from '@/assets/icons/heart.svg'
import comment from '@/assets/icons/comment.svg'
import lockWhite from '@/assets/icons/lock_white.svg'
import storyboardImg from '@/assets/images/storyboard.jpg'
import heart_filled from '@/assets/icons/heart_filled.svg'

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
  const [likeCount, setLikeCount] = useState(likes)
  const [commentCount, setCommentCount] = useState(comments)
  const [showCommentsModal, setShowCommentsModal] = useState(false)

  const mockComments: Comment[] = [
    {
      id: '1',
      author: { name: 'Sarah Johnson', role: 'Producer', avatar: 'SJ' },
      text: 'This is absolutely amazing! Love the direction and the visual storytelling.',
      timestamp: '2 hours ago',
      likes: 42
    },
    {
      id: '2',
      author: { name: 'Mike Chen', role: 'Director', avatar: 'MC' },
      text: 'Great concept! The pacing is really well done.',
      timestamp: '1 hour ago',
      likes: 28
    }
  ]

  const handleLike = () => {
    setLiked(prev => !prev)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  const renderContent = () => {
    if (type === 'synopsis') {
      return (
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {synopsis}
        </p>
      )
    }

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
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                      {locked
                        ? scene.description.slice(0, 800)
                        : scene.description}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

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
              className="rounded-full object-cover w-10 h-10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
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
            className="flex items-center gap-1 hover:text-red-500"
          >
            <Image src={liked ? heart_filled : heart} alt="likes" className="w-5 h-5" />
            <span>{likeCount.toLocaleString()}</span>
          </button>

          <button
            onClick={() => setShowCommentsModal(true)}
            className="flex items-center gap-1 hover:text-blue-500"
          >
            <Image src={comment} alt="comments" className="w-5 h-5" />
            <span>{commentCount.toLocaleString()}</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        {title}
      </h1>

      {description && (
        <p className="mt-2 text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      )}

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

        {/* Lock Overlay Only When Locked */}
        {locked && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-end pb-4">
            <div className="rounded-md bg-[#013913] text-white px-4 py-2 text-sm font-semibold flex items-center gap-2">
              <Image src={lockWhite} alt="lock" className="w-4 h-4" />
              Locked
            </div>

            <p className="mt-2 text-sm text-gray-600 text-center max-w-sm">
              Unlock the full script and bring your vision to life.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#DBFFE7] px-3 py-1 text-sm text-[#013913] border border-green-100">
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
      {locked && (script?.price || price) && (
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

      {/* Comments Modal */}
      <Dialog open={showCommentsModal} onOpenChange={setShowCommentsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {mockComments.map((commentItem) => (
              <div key={commentItem.id} className="flex gap-3 pb-4 border-b border-gray-200 last:border-b-0">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-700">
                    {commentItem.author.avatar}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-gray-900 text-sm">
                      {commentItem.author.name}
                      {commentItem.author.role && (
                        <span className="text-gray-500 text-xs ml-1">
                          · {commentItem.author.role}
                        </span>
                      )}
                    </p>
                    <p className="text-gray-700 text-sm mt-1">
                      {commentItem.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4 flex gap-2">
            <Input placeholder="Add a comment..." className="flex-1" />
            <Button className="bg-green-500 hover:bg-green-600">
              Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostDetail
