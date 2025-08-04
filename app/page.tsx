"use client"

import { useState, useEffect } from "react"
import { MovieGrid } from "@/components/movies/movie-grid"
import { Button } from "@/components/ui/button"
import { Film, Tv, Star, TrendingUp } from "lucide-react"

interface Movie {
  id: string
  title: string
  overview: string
  poster_url: string
  backdrop_url: string
  year: number
  genre: string[]
  imdb_rating: number
  type: string
  duration: number
  streaming_platforms: string[]
}

export default function HomePage() {
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true)
      const response = await fetch("/api/recommendations")
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Your Next Favorite Movie</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Rate movies, get personalized recommendations, and find where to watch them. Your taste in movies, perfectly
            curated.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black">
              <Star className="w-5 h-5 mr-2" />
              Start Rating Movies
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View Recommendations
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Film className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">10,000+</h3>
              <p className="text-gray-400">Movies & TV Shows</p>
            </div>
            <div>
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Smart Ratings</h3>
              <p className="text-gray-400">AI-Powered Recommendations</p>
            </div>
            <div>
              <Tv className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Multiple Platforms</h3>
              <p className="text-gray-400">Find Where to Watch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {!loadingRecommendations && recommendations.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-yellow-500" />
            Recommended For You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recommendations.slice(0, 10).map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform"
              >
                <img
                  src={movie.poster_url || "/placeholder.svg?height=300&width=200"}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{movie.imdb_rating}</span>
                    <span>•</span>
                    <span>{movie.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">All Movies & TV Shows</h2>
        <MovieGrid />
      </div>
    </div>
  )
}
