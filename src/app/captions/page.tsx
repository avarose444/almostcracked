import { createClient } from '@/utils/supabase/server'
import CaptionCard from '@/components/CaptionCard'
import NavBar from '@/components/NavBar'

export default async function CaptionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profileId: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single()
    profileId = profile?.id ?? null
  }

  const { data: captions } = await supabase
    .from('captions')
    .select('*, caption_votes(count)')
    .eq('is_public', true)
    .order('created_datetime_utc', { ascending: false })
    .limit(50)

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <NavBar user={user} />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
          Rate Captions
        </h1>
        <p className="text-gray-500 mb-8">
          {user ? 'Tap to vote on your favorites!' : 'Log in to vote!'}
        </p>
        <div className="flex flex-col gap-4">
          {captions?.map((caption) => (
            <CaptionCard key={caption.id} caption={caption} user={user} profileId={profileId} />
          ))}
        </div>
      </div>
    </main>
  )
}
