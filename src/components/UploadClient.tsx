'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function UploadClient() {
   const supabase = createClient()
  const router = useRouter()
  const [image, setImage] = useState<File | null>(null)
  const [captions, setCaptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!image) return
    setLoading(true)
    setError('')
    setCaptions([])

    try {
      // Get auth token
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) {
        setError('You must be logged in to generate captions.')
        setLoading(false)
        return
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }

      // Step 1: Get presigned URL
      setStatus('Getting upload URL...')
      const presignRes = await fetch('https://api.almostcrackd.ai/pipeline/generate-presigned-url', {
        method: 'POST',
        headers,
        body: JSON.stringify({ contentType: image.type }),
      })
      const { presignedUrl, cdnUrl } = await presignRes.json()

      // Step 2: Upload image to S3
      setStatus('Uploading image...')
      await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': image.type },
        body: image,
      })

      // Step 3: Register image
      setStatus('Registering image...')
      const registerRes = await fetch('https://api.almostcrackd.ai/pipeline/upload-image-from-url', {
        method: 'POST',
        headers,
        body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
      })
      const { imageId } = await registerRes.json()

      // Step 4: Generate captions
      setStatus('Generating captions...')
      const captionRes = await fetch('https://api.almostcrackd.ai/pipeline/generate-captions', {
        method: 'POST',
        headers,
        body: JSON.stringify({ imageId }),
      })
      const captionData = await captionRes.json()
      setCaptions(Array.isArray(captionData) ? captionData : [])
      setStatus('')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setStatus('')
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        className="text-gray-600"
      />
      <button
        onClick={handleSubmit}
        disabled={!image || loading}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-2xl hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? status || 'Working...' : 'Generate Captions'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {captions.length > 0 && (
        <ul className="flex flex-col gap-2 mt-2">
          {captions.map((c, i) => (
            <li key={i} className="bg-purple-50 rounded-xl p-3 text-gray-700 font-medium">
              {c.content ?? c.text ?? JSON.stringify(c)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}