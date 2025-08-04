"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface Movie {
  id: string
  title: string
  overview: string
  poster_url: string
  year: number
  genre: string[]
  imdb_rating: number
  streaming_platforms: string[]
}

interface MovieRatingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rating: number, review?: string) => void
  movie: Movie
  currentRating: number
}

export function MovieRatingModal({ isOpen, onClose, onSubmit, movie, currentRating }: MovieRatingModalProps) {
  const [rating, setRating] = useState(currentRating || 0)
  const [review, setReview] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating > 0) {
      setIsSubmitting(true)
      try {
        await onSubmit(rating, review.trim() || undefined)
        onClose()
        setReview("")
      } catch (error) {
        console.error("Error submitting rating:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const displayRating = hoveredRating || rating

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Rate Movie</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Movie Info */}
          <div className="flex gap-4">
            <img
              src={movie.poster_url || "/placeholder.svg?height=96&width=64"}
              alt={movie.title}
              className="w-16 h-24 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold text-lg">{movie.title}</h3>
              <p className="text-gray-400 text-sm">{movie.year}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-300">{movie.imdb_rating} IMDb</span>
              </div>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="text-center">
            <p className="text-gray-300 mb-4">How would you rate this movie?</p>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="transition-transform hover:scale-110"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= displayRating ? "text-yellow-500 fill-current" : "text-gray-600 hover:text-yellow-400"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-yellow-500 font-semibold">
                {rating} star{rating !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Review (optional)</label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this movie..."
              className="bg-gray-800 border-gray-600 text-white resize-none"
              rows={3}
              maxLength={500}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-400 mt-1">{review.length}/500 characters</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : currentRating > 0 ? "Update Rating" : "Submit Rating"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
