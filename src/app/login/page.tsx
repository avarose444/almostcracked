'use client'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full">
        <div className="text-5xl">😂</div>
        <h1 className="text-3xl font-black text-gray-800">AlmostCrackd</h1>
        <p className="text-gray-500 text-center">Sign in to rate captions and join the fun!</p>
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-2xl hover:opacity-90 transition text-lg"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  )
}
