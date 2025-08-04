"use client"

import { Star, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Rating {
  id: string
  user_name: string
  rating: number
  review_text?: string
  created_at: string
  helpful_count: number
}

interface RatingDisplayProps {
  ratings: Rating[]
  averageRating: number
  totalRatings: number
  userRating?: number
  onHelpfulClick?: (ratingId: string) => void
}

export function RatingDisplay({
  ratings,
  averageRating,
  totalRatings,
  userRating,
  onHelpfulClick,
}: RatingDisplayProps) {
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    ratings.forEach((rating) => {
      distribution[rating.rating as keyof typeof distribution]++
    })
    return distribution
  }

  const distribution = getRatingDistribution()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-start gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-1">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating) ? "text-yellow-500 fill-current" : "text-gray-400"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400">
            {totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-300 w-8">{stars}★</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width:
                      totalRatings > 0
                        ? `${(distribution[stars as keyof typeof distribution] / totalRatings) * 100}%`
                        : "0%",
                  }}
                />
              </div>
              <span className="text-sm text-gray-400 w-8">{distribution[stars as keyof typeof distribution]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User's Rating */}
      {userRating && (
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-600 text-white">
                Your Rating
              </Badge>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= userRating ? "text-yellow-500 fill-current" : "text-gray-400"}`}
                  />
                ))}
              </div>
              <span className="text-white font-medium">{userRating}/5</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Reviews</h3>

        {ratings.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <Card key={rating.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {rating.user_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{rating.user_name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= rating.rating ? "text-yellow-500 fill-current" : "text-gray-400"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">{formatDate(rating.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {rating.review_text && <p className="text-gray-300 mb-3 leading-relaxed">{rating.review_text}</p>}

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onHelpfulClick?.(rating.id)}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful ({rating.helpful_count})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
