'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UserPanelClient() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_IP}/blogs/addBlog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content, img }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to add blog')
      }

      setSuccess(true)
      setTitle('')
      setContent('')
      setImg('')

      setTimeout(() => router.push('/'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Blog</h1>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
              Blog added successfully! Redirecting…
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400"
              required
            />

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Content"
              rows={6}
              className="w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400"
              required
            />

            <input
              value={img}
              onChange={e => setImg(e.target.value)}
              placeholder="Image URL"
              className="w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400"
              required
            />

            <button
              disabled={loading}
              className="w-full px-6 py-2 bg-gray-900 text-white rounded-lg"
            >
              {loading ? 'Publishing…' : 'Publish Blog'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
