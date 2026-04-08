import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <NavBar user={user} />
      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            AlmostCrackd
          </h1>
          <p className="text-xl text-gray-500 max-w-md">
            Rate funny captions, generate new ones with AI, and compete with friends.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-4">
          <Link href="/captions" className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 border border-purple-100 hover:shadow-lg transition text-left">
            <div className="text-3xl">🔥</div>
            <h2 className="text-xl font-black text-gray-800">Rate Captions</h2>
            <p className="text-gray-500 text-sm">Upvote or downvote the funniest captions from the community.</p>
            <span className="text-purple-500 font-bold text-sm">Go vote →</span>
          </Link>

          <Link href="/upload" className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 border border-purple-100 hover:shadow-lg transition text-left">
            <div className="text-3xl">🤖</div>
            <h2 className="text-xl font-black text-gray-800">Generate Captions</h2>
            <p className="text-gray-500 text-sm">Upload an image and let AI generate hilarious captions for it.</p>
            <span className="text-purple-500 font-bold text-sm">Try it →</span>
          </Link>
        </div>
      </div>
    </main>
  )
}