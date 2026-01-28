'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Blog {
  _id: string
  title: string
  content: string
  img: string
  authorName: string
  authorProfilePicture: string
  createdAt: string
}

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_IP}/blogs/getBlogs`)
        if (!response.ok) throw new Error('Failed to fetch blogs')
        const data = await response.json()
        setBlogs(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-red-50 rounded-lg p-6">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No blogs yet. Check back soon!</p>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="grid gap-8 grid-cols-3">
            {blogs.map((blog) => (
              <article key={blog._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Blog Image */}
                <div className="relative h-64 w-full bg-gray-100">
                  <Image
                    src={blog.img}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">{blog.title}</h2>
                  <p className="text-gray-600 mb-6 line-clamp-2">{blog.content}</p>

                  {/* Author Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={blog.authorProfilePicture}
                        alt={blog.authorName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{blog.authorName}</p>
                        <p className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Link href={`/blog/${blog._id}`} className="text-sm font-medium text-gray-900 hover:text-gray-600">
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}