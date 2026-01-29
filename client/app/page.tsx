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
    <div className="min-h-screen bg-gradient-to-r from-indigo-700 to-purple-800">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 text-white text-lg font-semibold">Loading blogs...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-red-50 rounded-lg p-6">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white text-lg font-medium">No blogs yet. Check back soon!</p>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {blogs.map((blog) => (
              <article key={blog._id} className="group border-2 border-transparent rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white transform hover:scale-105 hover:shadow-lg">
                {/* Blog Image */}
                <div className="relative h-84 w-full bg-gray-100">
                  <Image
                    src={blog.img}
                    alt={blog.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-all duration-500"
                  />
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-3">{blog.title}</h2>
                  <p className="text-gray-600 mb-6 line-clamp-3">{blog.content}</p>

                  {/* Author Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={blog.authorProfilePicture}
                        alt={blog.authorName}
                        width={40}
                        height={50}
                        className="w-12 h-12 rounded-full border-2 border-indigo-500 transition-all duration-300 group-hover:border-indigo-700"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{blog.authorName}</p>
                        <p className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Link href={`/blog/${blog._id}`} passHref>
                      <button className="text-sm cursor-pointer font-medium text-indigo-600 hover:text-indigo-800 transition-all duration-200">
                        Read more
                      </button>
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
