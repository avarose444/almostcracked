'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function CaptionCard({ caption, user, profileId }: {
  caption: any,
  user: any,
  profileId: string | null
}) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const vote = async (voteValue: 1 | -1) => {
    if (!user || !profileId) { router.push('/login'); return }
    setLoading(true)
    await supabase.from('caption_votes').insert({
      caption_id: caption.id,
      vote_value: voteValue,
      profile_id: profileId,
      is_from_study: false,
      created_by_user_id: profileId,
      modified_by_user_id: profileId,
    })
    router.refresh()
    setLoading(false)
  }

  const voteCount = caption.caption_votes?.[0]?.count ?? 0

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 border border-purple-100 hover:shadow-lg transition">
      <p className="text-gray-800 font-semibold text-lg">{caption.content}</p>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">votes: {voteCount}</span>
        {user && profileId ? (
          <>
            <button onClick={() => vote(1)} disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-50">
              Upvote
            </button>
            <button onClick={() => vote(-1)} disabled={loading} className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition disabled:opacity-50">
              Downvote
            </button>
          </>
        ) : (
          <span className="text-sm text-pink-400 font-medium">Log in to vote</span>
        )}
      </div>
    </div>
  )
}