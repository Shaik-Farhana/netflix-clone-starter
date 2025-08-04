"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MovieGrid } from "@/components/movies/movie-grid"
import { TrendingUp, Star, Heart } from "lucide-react"

interface RecommendationSectionProps {
  userId: string
}

export function RecommendationSection({ userId }: RecommendationSectionProps) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [userId])

  const fetchRecommendations = async () => {
    try {
      // Mock recommendations based on user ratings
      // In a real app, this would call your recommendation API
      const mockRecommendations = [
        {
          id: "rec1",
          title: "Inception",
          poster_url: "/placeholder.svg?height=600&width=400&text=Inception",
          overview:
            "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          rating: 0,
          genre: ["Action", "Sci-Fi", "Thriller"],
          year: 2010,
          imdb_rating: 8.8,
          streaming_platforms: ["Netflix", "Amazon Prime"],
        },
        {
          id: "rec2",
          title: "Interstellar",
          poster_url: "/placeholder.svg?height=600&width=400&text=Interstellar",
          overview:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          rating: 0,
          genre: ["Adventure", "Drama", "Sci-Fi"],
          year: 2014,
          imdb_rating: 8.6,
          streaming_platforms: ["HBO Max", "Amazon Prime"],
        },
      ]

      setRecommendations(mockRecommendations)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Your Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-gray-400 text-sm">Movies rated</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{recommendations.length}</div>
            <p className="text-gray-400 text-sm">Movies suggested</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-yellow-500" />
              Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-gray-400 text-sm">Movies saved</p>
          </CardContent>
        </Card>
      </div>

      {recommendations.length > 0 ? (
        <MovieGrid type="recommendations" movies={recommendations} />
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Start Rating Movies</h3>
            <p className="text-gray-400">Rate some movies to get personalized recommendations based on your taste!</p>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
