"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeaturedItem {
  id: string
  title: string
  poster_url: string
  rating: number
  genre: string[]
}

export function FeaturedContent() {
  const [featured, setFeatured] = useState<FeaturedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedContent()
  }, [])

  const fetchFeaturedContent = async () => {
    try {
      // Check if Supabase is configured
      const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      if (!isSupabaseConfigured) {
        console.log("Supabase not configured, using mock data")
        setFeatured(getMockFeaturedContent())
        setIsLoading(false)
        return
      }

      const supabase = createClientComponentClient()

      // Test connection first
      const { data: testData, error: testError } = await supabase.from("content").select("id").limit(1)

      if (testError) {
        console.log("Database not accessible, using mock data:", testError.message)
        setFeatured(getMockFeaturedContent())
        setIsLoading(false)
        return
      }

      // Fetch featured content
      const { data, error } = await supabase
        .from("content")
        .select("id, title, poster_url, rating, genre")
        .order("rating", { ascending: false })
        .limit(6)

      if (error) {
        console.error("Error fetching content:", error)
        setFeatured(getMockFeaturedContent())
      } else if (data && data.length > 0) {
        setFeatured(data)
      } else {
        console.log("No content found, using mock data")
        setFeatured(getMockFeaturedContent())
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setFeatured(getMockFeaturedContent())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockFeaturedContent = (): FeaturedItem[] => [
    {
      id: "1",
      title: "The Matrix",
      poster_url: "/placeholder.svg?height=600&width=400&text=The+Matrix",
      rating: 8.7,
      genre: ["Action", "Sci-Fi"],
    },
    {
      id: "2",
      title: "Inception",
      poster_url: "/placeholder.svg?height=600&width=400&text=Inception",
      rating: 8.8,
      genre: ["Action", "Sci-Fi"],
    },
    {
      id: "3",
      title: "Interstellar",
      poster_url: "/placeholder.svg?height=600&width=400&text=Interstellar",
      rating: 8.6,
      genre: ["Adventure", "Drama"],
    },
    {
      id: "4",
      title: "The Dark Knight",
      poster_url: "/placeholder.svg?height=600&width=400&text=The+Dark+Knight",
      rating: 9.0,
      genre: ["Action", "Crime"],
    },
    {
      id: "5",
      title: "Breaking Bad",
      poster_url: "/placeholder.svg?height=600&width=400&text=Breaking+Bad",
      rating: 9.5,
      genre: ["Crime", "Drama"],
    },
    {
      id: "6",
      title: "Stranger Things",
      poster_url: "/placeholder.svg?height=600&width=400&text=Stranger+Things",
      rating: 8.7,
      genre: ["Drama", "Fantasy"],
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-800 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Featured Content</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {featured.map((item) => (
          <Card key={item.id} className="bg-transparent border-none group cursor-pointer">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              <img
                src={item.poster_url || "/placeholder.svg?height=600&width=400"}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-2">
              <h3 className="font-medium text-white text-sm line-clamp-1 mb-1">{item.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-300 ml-1">{item.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
