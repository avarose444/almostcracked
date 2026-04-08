'use client'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NavBar({ user }: { user: any }) {
  const supabase = createClient()
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-sm border-b border-purple-100">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/captions" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          AlmostCrackd
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user.email}</span>
            <button onClick={logout} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-xl text-sm font-bold hover:opacity-90 transition">
              Log out
            </button>
          </div>
        ) : (
          <Link href="/login" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-xl text-sm font-bold hover:opacity-90 transition">
            Log in
          </Link>
        )}
      </div>
    </nav>
  )
}
