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
    <main className="min-h-screen bg-pink-50 flex items-center justify-center"
      style={{
        backgroundImage: 'radial-gradient(circle, #f9a8d4 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}>
      <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center gap-4 max-w-sm w-full border-2 border-pink-200">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
          AlmostCrackd
        </h1>
        <p className="text-pink-400 italic text-sm">Only true fans may enter...</p>
        <button
          onClick={handleLogin}
          className="w-full mt-4 flex items-center justify-center gap-3 border border-gray-200 rounded-2xl py-3 px-6 text-gray-700 font-semibold hover:bg-gray-50 transition shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </main>
  )
}