import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import heart from '@/assets/icons/heart.svg'
import comment from '@/assets/icons/comment.svg'
import lockWhite from '@/assets/icons/lock_white.svg'
import storyboardImg from '@/assets/images/storyboard.jpg'
import heart_filled from '@/assets/icons/heart_filled.svg'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Square, Volume2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export type PostType = 'synopsis' | 'story_board' | 'script'

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
  sale_type?: 'FIXED' | 'BIDDABLE'
  minimum_bid?: number
  currency?: string
  content?: ScriptBlock[]
}

interface SynopsisData {
  price?: number
  sale_type?: 'FIXED' | 'BIDDABLE'
  minimum_bid?: number
  currency?: string
  content?: string
}

interface StoryboardData {
  price?: number
  sale_type?: 'FIXED' | 'BIDDABLE'
  minimum_bid?: number
  currency?: string
  image?: string
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
  synopsis?: SynopsisData
  script?: ScriptData
  storyboard?: StoryboardData
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
  const [bidAmount, setBidAmount] = useState('')
  const [bidSubmitting, setBidSubmitting] = useState(false)
  const [bidMessage, setBidMessage] = useState('')
  const [bidError, setBidError] = useState('')
  const [acceptedBidId, setAcceptedBidId] = useState<string | null>(null)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    // Check if buyer has an accepted bid on this post
    const checkAcceptedBid = async () => {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const res = await fetch(`${apiUrl}/web/script/bids/placed`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        if (res.ok && data?.data) {
          // Find accepted bid for this post
          const acceptedBid = data.data.find(
            (bid: any) => bid.script_id?._id === id && bid.status === 'ACCEPTED'
          )
          if (acceptedBid) {
            setAcceptedBidId(acceptedBid._id)
          }
        }
      } catch (error) {
        console.error('Failed to check accepted bids:', error)
      }
    }

    checkAcceptedBid()
  }, [id])

  useEffect(() => {
    const supportsSpeech =
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      'SpeechSynthesisUtterance' in window

    setIsSpeechSupported(supportsSpeech)

    return () => {
      if (supportsSpeech) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (!isSpeechSupported) return

    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [id, type, locked, isSpeechSupported])

  console.log(storyboard, type)

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

  const handlePlaceBid = async () => {
    setBidMessage('')
    setBidError('')

    const token = localStorage.getItem('auth_token')
    if (!token) {
      setBidError('Please log in to place a bid.')
      return
    }

    const amount = Number(bidAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setBidError('Enter a valid bid amount.')
      return
    }

    if ((script?.minimum_bid || 0) > 0 && amount < (script?.minimum_bid || 0)) {
      setBidError(`Bid must be at least ₹${(script?.minimum_bid || 0).toLocaleString()}`)
      return
    }

    try {
      setBidSubmitting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const res = await fetch(`${apiUrl}/web/script/${id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to place bid')
      }

      setBidMessage('Bid submitted successfully.')
      setBidAmount('')
    } catch (error) {
      setBidError(error instanceof Error ? error.message : 'Failed to place bid')
    } finally {
      setBidSubmitting(false)
    }
  }

  const renderContent = () => {
    if (type === 'synopsis') {
      return (
        <p className="text-sm text-gray-700 min-h-60 leading-relaxed whitespace-pre-line">
          {typeof synopsis === 'string' ? synopsis : synopsis?.content}
        </p>
      )
    }

    if (type === 'script' && script?.content?.length) {
      return (
        <div className="space-y-6 min-h-60">
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

    if (type === 'story_board' && storyboard?.image) {
      return (
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-200">
          <Image
            src={storyboard?.image}
            alt={title}
            width={800}
            height={500}
            className="w-full h-auto object-contain opacity-20"
          />
        </div>
      )
    }

    return null
  }

  const getReadAloudText = () => {
    if (type === 'synopsis') {
      return (typeof synopsis === 'string' ? synopsis : synopsis?.content) || ''
    }

    if (type === 'script' && script?.content?.length) {
      return script.content
        .map((block) => {
          const sceneText = block.scenes
            .map((scene) => (locked ? scene.description.slice(0, 800) : scene.description))
            .join('\n\n')

          return [block.name, sceneText].filter(Boolean).join('\n')
        })
        .join('\n\n')
    }

    return ''
  }

  const handleReadAloud = () => {
    if (!isSpeechSupported) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const textToRead = getReadAloudText().trim()
    if (!textToRead) return

    const utterance = new SpeechSynthesisUtterance(textToRead)
    utterance.rate = 1
    utterance.pitch = 1
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  // Helper: get the pricing data for the current post type
  const getPricingData = () => {
    if (type === 'script') return script
    if (type === 'synopsis') return synopsis
    if (type === 'story_board') return storyboard
    return null
  }

  const pricingData = getPricingData()
  const canReadAloud = type === 'script' || type === 'synopsis'
  const hasReadAloudText = getReadAloudText().trim().length > 0

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
        className={`relative mt-4 rounded-xl ${type === 'story_board'
          ? 'bg-white p-0'
          : 'bg-[#F5F5F5] p-5'
          }`}
      >
        {canReadAloud && !locked && (
          <div className="mb-3 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReadAloud}
              disabled={!isSpeechSupported || !hasReadAloudText}
              className="gap-2"
            >
              {isSpeaking ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isSpeaking ? 'Stop Read Aloud' : 'Read Aloud'}
            </Button>
          </div>
        )}

        {renderContent()}

        {/* Lock Overlay Only When Locked */}
        {locked && (
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-end pb-4">
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
      {locked && pricingData?.sale_type !== 'BIDDABLE' && (
        <div className="mt-4 flex items-center justify-end gap-3">
          <span className="text-lg font-bold text-green-600">
            ₹{(pricingData?.price ?? price ?? 0).toLocaleString()}
          </span>
          <Link href={`/checkout?postId=${id}`}>
            <Button className="bg-green-500 hover:bg-green-600 px-6">
              Buy Now
            </Button>
          </Link>
        </div>
      )}

      {locked && pricingData?.sale_type === 'BIDDABLE' && acceptedBidId && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-green-900">🎉 Your bid has been accepted!</p>
            <p className="text-sm text-green-700">Ready to complete the payment</p>
          </div>

          <Link href={`/checkout?bidId=${acceptedBidId}`}>
            <Button className="w-full bg-green-600 hover:bg-green-700 px-6">
              Go to Payment
            </Button>
          </Link>
        </div>
      )}

      {locked && pricingData?.sale_type === 'BIDDABLE' && !acceptedBidId && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">This {type === 'script' ? 'script' : type === 'synopsis' ? 'synopsis' : 'storyboard'} is open for bidding</p>
            <p className="text-sm text-gray-600">
              Minimum Bid: ₹{(pricingData?.minimum_bid || 0).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={pricingData?.minimum_bid || 0}
              value={bidAmount}
              onChange={(event) => setBidAmount(event.target.value)}
              placeholder="Enter your bid"
            />
            <Button className="bg-green-500 hover:bg-green-600" onClick={handlePlaceBid} disabled={bidSubmitting}>
              {bidSubmitting ? 'Submitting...' : 'Place Bid'}
            </Button>
          </div>

          {bidMessage && <p className="text-sm text-green-700">{bidMessage}</p>}
          {bidError && <p className="text-sm text-red-600">{bidError}</p>}
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
