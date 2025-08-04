"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Movie {
  id: string
  title: string
  poster_url: string
  rating: number
  genre: string[]
  type: string
}

interface RecommendationRow {
  title: string
  movies: Movie[]
}

export function RecommendationRows() {
  const [rows, setRows] = useState<RecommendationRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRecommendationRows()
  }, [])

  const fetchRecommendationRows = async () => {
    try {
      // Check if Supabase is configured
      const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      if (!isSupabaseConfigured) {
        console.log("Supabase not configured, using mock data")
        setRows(getMockRows())
        setIsLoading(false)
        return
      }

      const supabase = createClientComponentClient()

      // Test connection first
      const { data: testData, error: testError } = await supabase.from("content").select("id").limit(1)

      if (testError) {
        console.log("Database not accessible, using mock data:", testError.message)
        setRows(getMockRows())
        setIsLoading(false)
        return
      }

      // Fetch all content
      const { data: allContent, error } = await supabase
        .from("content")
        .select("id, title, poster_url, rating, genre, type")
        .order("rating", { ascending: false })

      if (error) {
        console.error("Error fetching content:", error)
        setRows(getMockRows())
      } else if (allContent && allContent.length > 0) {
        // Create different rows based on the data
        const movies = allContent.filter((item) => item.type === "movie")
        const tvShows = allContent.filter((item) => item.type === "tv_show")
        const trending = allContent.slice(0, 8)
        const popular = [...allContent].sort(() => 0.5 - Math.random()).slice(0, 8)

        setRows([
          { title: "Trending Now", movies: trending },
          { title: "Popular Movies", movies: movies.slice(0, 8) },
          { title: "TV Shows", movies: tvShows.slice(0, 8) },
          { title: "Because You Watched", movies: popular },
        ])
      } else {
        console.log("No content found, using mock data")
        setRows(getMockRows())
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setRows(getMockRows())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockRows = (): RecommendationRow[] => [
    {
      title: "Trending Now",
      movies: [
        {
          id: "1",
          title: "Wednesday",
          poster_url: "/placeholder.svg?height=600&width=400&text=Wednesday",
          rating: 8.1,
          genre: ["Comedy", "Horror"],
          type: "tv_show",
        },
        {
          id: "2",
          title: "The Crown",
          poster_url: "/placeholder.svg?height=600&width=400&text=The+Crown",
          rating: 8.7,
          genre: ["Drama", "History"],
          type: "tv_show",
        },
        {
          id: "3",
          title: "Ozark",
          poster_url: "/placeholder.svg?height=600&width=400&text=Ozark",
          rating: 8.4,
          genre: ["Crime", "Drama"],
          type: "tv_show",
        },
        {
          id: "4",
          title: "Money Heist",
          poster_url: "/placeholder.svg?height=600&width=400&text=Money+Heist",
          rating: 8.2,
          genre: ["Action", "Crime"],
          type: "tv_show",
        },
        {
          id: "5",
          title: "Stranger Things",
          poster_url: "/placeholder.svg?height=600&width=400&text=Stranger+Things",
          rating: 8.7,
          genre: ["Drama", "Fantasy"],
          type: "tv_show",
        },
        {
          id: "6",
          title: "Black Mirror",
          poster_url: "/placeholder.svg?height=600&width=400&text=Black+Mirror",
          rating: 8.8,
          genre: ["Drama", "Sci-Fi"],
          type: "tv_show",
        },
      ],
    },
    {
      title: "Popular Movies",
      movies: [
        {
          id: "7",
          title: "The Matrix",
          poster_url: "/placeholder.svg?height=600&width=400&text=The+Matrix",
          rating: 8.7,
          genre: ["Action", "Sci-Fi"],
          type: "movie",
        },
        {
          id: "8",
          title: "Inception",
          poster_url: "/placeholder.svg?height=600&width=400&text=Inception",
          rating: 8.8,
          genre: ["Action", "Sci-Fi"],
          type: "movie",
        },
        {
          id: "9",
          title: "The Dark Knight",
          poster_url: "/placeholder.svg?height=600&width=400&text=The+Dark+Knight",
          rating: 9.0,
          genre: ["Action", "Crime"],
          type: "movie",
        },
        {
          id: "10",
          title: "Interstellar",
          poster_url: "/placeholder.svg?height=600&width=400&text=Interstellar",
          rating: 8.6,
          genre: ["Adventure", "Drama"],
          type: "movie",
        },
        {
          id: "11",
          title: "Pulp Fiction",
          poster_url: "/placeholder.svg?height=600&width=400&text=Pulp+Fiction",
          rating: 8.9,
          genre: ["Crime", "Drama"],
          type: "movie",
        },
        {
          id: "12",
          title: "Avengers: Endgame",
          poster_url: "/placeholder.svg?height=600&width=400&text=Avengers+Endgame",
          rating: 8.4,
          genre: ["Action", "Adventure"],
          type: "movie",
        },
      ],
    },
    {
      title: "Comedy Specials",
      movies: [
        {
          id: "13",
          title: "The Office",
          poster_url: "/placeholder.svg?height=600&width=400&text=The+Office",
          rating: 8.9,
          genre: ["Comedy"],
          type: "tv_show",
        },
        {
          id: "14",
          title: "Friends",
          poster_url: "/placeholder.svg?height=600&width=400&text=Friends",
          rating: 8.9,
          genre: ["Comedy", "Romance"],
          type: "tv_show",
        },
        {
          id: "15",
          title: "Brooklyn Nine-Nine",
          poster_url: "/placeholder.svg?height=600&width=400&text=Brooklyn+Nine+Nine",
          rating: 8.4,
          genre: ["Comedy", "Crime"],
          type: "tv_show",
        },
        {
          id: "16",
          title: "Parks and Recreation",
          poster_url: "/placeholder.svg?height=600&width=400&text=Parks+and+Rec",
          rating: 8.6,
          genre: ["Comedy"],
          type: "tv_show",
        },
      ],
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 bg-gray-800 rounded w-48 animate-pulse" />
            <div className="flex gap-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="w-48 aspect-[2/3] bg-gray-800 rounded animate-pulse flex-shrink-0" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {rows.map((row, index) => (
        <div key={index} className="space-y-4">
          <h2 className="text-xl font-bold text-white">{row.title}</h2>

          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {row.movies.map((movie) => (
                <Card key={movie.id} className="w-48 flex-shrink-0 bg-transparent border-none group cursor-pointer">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                    <img
                      src={movie.poster_url || "/placeholder.svg?height=600&width=400"}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-2">
                    <h3 className="font-medium text-white text-sm line-clamp-1 mb-1">{movie.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-300 ml-1">{movie.rating}</span>
                      </div>
                      <div className="flex gap-1">
                        {movie.genre.slice(0, 1).map((g) => (
                          <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300 px-1 py-0">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ))}
    </div>
  )
}
