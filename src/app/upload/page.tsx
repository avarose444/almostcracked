import { createClient } from '@/utils/supabase/server'
import UploadClient from '@/components/UploadClient'
import NavBar from '@/components/NavBar'

export default async function UploadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <NavBar user={user} />
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
          Generate Captions
        </h1>
        <UploadClient />
      </div>
    </main>
  )
}