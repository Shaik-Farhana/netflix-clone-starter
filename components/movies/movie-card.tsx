"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { MovieRatingModal } from "./movie-rating-modal"
import { StreamingPlatforms } from "./streaming-platforms"

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

interface MovieCardProps {
  movie: Movie
  userRating?: number
  onRatingSubmit?: (movieId: string, rating: number, review?: string) => void
}

export function MovieCard({ movie, userRating, onRatingSubmit }: MovieCardProps) {
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingSubmit = async (rating: number, review?: string) => {
    if (!onRatingSubmit) return

    setIsSubmitting(true)
    try {
      await onRatingSubmit(movie.id, rating, review)
    } catch (error) {
      console.error("Error submitting rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors group">
        <CardContent className="p-0">
          {/* Movie Poster */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
            <img
              src={movie.poster_url || "/placeholder.svg?height=450&width=300"}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* User Rating Badge */}
            {userRating && (
              <div className="absolute top-2 right-2 bg-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {userRating}
              </div>
            )}

            {/* Type Badge */}
            <Badge variant="secondary" className="absolute top-2 left-2 bg-black/70 text-white border-none">
              {movie.type === "tv_show" ? "TV" : "Movie"}
            </Badge>
          </div>

          {/* Movie Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-white text-sm line-clamp-2 flex-1">{movie.title}</h3>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-300">{movie.imdb_rating}</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-400">{movie.year}</span>
              {movie.duration && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-400">{movie.duration}min</span>
                </>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genre.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs border-gray-600 text-gray-300">
                  {genre}
                </Badge>
              ))}
              {movie.genre.length > 2 && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                  +{movie.genre.length - 2}
                </Badge>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-400 text-xs line-clamp-3 mb-4">{movie.overview}</p>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-3">
              <Button
                onClick={() => setShowRatingModal(true)}
                variant="outline"
                size="sm"
                className="flex-1 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-black"
                disabled={isSubmitting}
              >
                <Star className="w-4 h-4 mr-1" />
                {userRating ? "Update" : "Rate"}
              </Button>
            </div>

            {/* Streaming Platforms */}
            <StreamingPlatforms platforms={movie.streaming_platforms} movieTitle={movie.title} />
          </div>
        </CardContent>
      </Card>

      {/* Rating Modal */}
      {showRatingModal && (
        <MovieRatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
          movie={movie}
          currentRating={userRating || 0}
        />
      )}
    </>
  )
}
