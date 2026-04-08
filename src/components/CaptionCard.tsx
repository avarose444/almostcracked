'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import Image from 'next/image'

export default function CaptionCard({ caption, user, profileId }: {
  caption: any,
  user: any,
  profileId: string | null
}) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [existingVote, setExistingVote] = useState<number | null>(null)
  const [bounce, setBounce] = useState<1 | -1 | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !profileId) return
    const checkVote = async () => {
      const { data } = await supabase
        .from('caption_votes')
        .select('vote_value')
        .eq('caption_id', caption.id)
        .eq('profile_id', profileId)
        .single()
      if (data) setExistingVote(data.vote_value)
    }
    checkVote()
  }, [caption.id, profileId])

  useEffect(() => {
    if (!caption.image_id) return
    const fetchImage = async () => {
      const { data } = await supabase
        .from('images')
        .select('url')
        .eq('id', caption.image_id)
        .single()
      if (data?.url) setImageUrl(data.url)
    }
    fetchImage()
  }, [caption.image_id])

  const vote = async (voteValue: 1 | -1) => {
    if (!user || !profileId) { router.push('/login'); return }
    if (existingVote !== null) return
    setBounce(voteValue)
    setTimeout(() => setBounce(null), 400)
    setLoading(true)

    if (voteValue === 1) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a855f7', '#ec4899', '#f97316'],
      })
    }

    await supabase.from('caption_votes').insert({
      caption_id: caption.id,
      vote_value: voteValue,
      profile_id: profileId,
      is_from_study: false,
      created_by_user_id: profileId,
      modified_by_user_id: profileId,
    })
    setExistingVote(voteValue)
    router.refresh()
    setLoading(false)
  }

  const voteCount = caption.caption_votes?.[0]?.count ?? 0

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition">
      {imageUrl && (
        <div className="w-full h-48 relative bg-gray-100">
          <img
            src={imageUrl}
            alt="caption image"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5 flex flex-col gap-3">
        <p className="text-gray-800 font-semibold text-lg">{caption.content}</p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">votes: {voteCount}</span>
          {user && profileId ? (
            existingVote !== null ? (
              <span className="text-sm text-purple-500 font-medium">
                {existingVote === 1 ? '✓ Upvoted' : '✓ Downvoted'}
              </span>
            ) : (
              <>
                <button
                  onClick={() => vote(1)}
                  disabled={loading}
                  style={{
                    transform: bounce === 1 ? 'scale(1.3)' : 'scale(1)',
                    transition: 'transform 0.2s cubic-bezier(.36,.07,.19,.97)',
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50"
                >
                  Upvote
                </button>
                <button
                  onClick={() => vote(-1)}
                  disabled={loading}
                  style={{
                    transform: bounce === -1 ? 'scale(1.3)' : 'scale(1)',
                    transition: 'transform 0.2s cubic-bezier(.36,.07,.19,.97)',
                  }}
                  className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-gray-200 disabled:opacity-50"
                >
                  Downvote
                </button>
              </>
            )
          ) : (
            <span className="text-sm text-pink-400 font-medium">Log in to vote</span>
          )}
        </div>
      </div>
    </div>
  )
}