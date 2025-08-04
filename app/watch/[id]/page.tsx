"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { VideoPlayer } from "@/components/video/video-player"
import { RatingDisplay } from "@/components/video/rating-display"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share, Plus, Check } from "lucide-react"
import { useAuth } from "@/components/providers"
import { useToast } from "@/hooks/use-toast"

interface Content {
  id: string
  title: string
  description: string
  type: string
  genre: string[]
  rating: number
  video_url?: string
  poster_url: string
  backdrop_url: string
}

interface UserRating {
  id: string
  user_id: string
  content_id: string
  rating: number
  review_text?: string
  created_at: string
}

interface Rating extends UserRating {
  user_name: string
  helpful_count: number
}

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const contentId = params.id as string

  const [content, setContent] = useState<Content | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [userRating, setUserRating] = useState<UserRating | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    if (contentId) {
      fetchContent()
      fetchRatings()
      if (user) {
        fetchUserRating()
        checkWatchlist()
      }
    }
  }, [contentId, user])

  const fetchContent = async () => {
    try {
      // Mock content for demo - in real app, fetch from Supabase
      const mockContent: Content = {
        id: contentId,
        title: "The Matrix",
        description:
          "A computer programmer discovers reality is a simulation and joins a rebellion against the machines.",
        type: "movie",
        genre: ["Action", "Sci-Fi"],
        rating: 8.7,
        video_url: "/sample-video.mp4", // You would have actual video URLs
        poster_url: "/placeholder.svg?height=600&width=400&text=The+Matrix",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=The+Matrix+Backdrop",
      }
      setContent(mockContent)
    } catch (error) {
      console.error("Error fetching content:", error)
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRatings = async () => {
    try {
      // Mock ratings for demo
      const mockRatings: Rating[] = [
        {
          id: "1",
          user_id: "user1",
          content_id: contentId,
          rating: 5,
          review_text:
            "Absolutely mind-blowing! The special effects and storyline are incredible. A true masterpiece of cinema.",
          created_at: "2024-01-15T10:30:00Z",
          user_name: "John Doe",
          helpful_count: 12,
        },
        {
          id: "2",
          user_id: "user2",
          content_id: contentId,
          rating: 4,
          review_text:
            "Great movie with amazing action sequences. The philosophy behind it is deep and thought-provoking.",
          created_at: "2024-01-10T15:45:00Z",
          user_name: "Jane Smith",
          helpful_count: 8,
        },
        {
          id: "3",
          user_id: "user3",
          content_id: contentId,
          rating: 5,
          review_text: "Revolutionary film that changed cinema forever. Still holds up today!",
          created_at: "2024-01-08T09:20:00Z",
          user_name: "Mike Johnson",
          helpful_count: 15,
        },
      ]
      setRatings(mockRatings)
    } catch (error) {
      console.error("Error fetching ratings:", error)
    }
  }

  const fetchUserRating = async () => {
    if (!user) return

    try {
      // In real app, fetch from Supabase
      // const { data } = await supabase
      //   .from('user_ratings')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .eq('content_id', contentId)
      //   .single()

      // Mock user rating
      const mockUserRating: UserRating | null = null // User hasn't rated yet
      setUserRating(mockUserRating)
    } catch (error) {
      console.error("Error fetching user rating:", error)
    }
  }

  const checkWatchlist = async () => {
    // Mock watchlist check
    setIsInWatchlist(false)
  }

  const handleRatingSubmit = async (rating: number, review?: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to rate content",
        variant: "destructive",
      })
      return
    }

    try {
      // In real app, save to Supabase
      const newRating: UserRating = {
        id: Date.now().toString(),
        user_id: user.id,
        content_id: contentId,
        rating,
        review_text: review,
        created_at: new Date().toISOString(),
      }

      setUserRating(newRating)

      // Add to ratings list if there's a review
      if (review) {
        const newPublicRating: Rating = {
          ...newRating,
          user_name: user.user_metadata?.full_name || user.email || "Anonymous",
          helpful_count: 0,
        }
        setRatings((prev) => [newPublicRating, ...prev])
      }

      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      })
    }
  }

  const handleWatchlistToggle = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add to watchlist",
        variant: "destructive",
      })
      return
    }

    try {
      setIsInWatchlist(!isInWatchlist)
      toast({
        title: isInWatchlist ? "Removed from watchlist" : "Added to watchlist",
        description: isInWatchlist ? "Content removed from your watchlist" : "Content added to your watchlist",
      })
    } catch (error) {
      console.error("Error updating watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to update watchlist",
        variant: "destructive",
      })
    }
  }

  const handleHelpfulClick = async (ratingId: string) => {
    try {
      // Update helpful count
      setRatings((prev) =>
        prev.map((rating) =>
          rating.id === ratingId ? { ...rating, helpful_count: rating.helpful_count + 1 } : rating,
        ),
      )

      toast({
        title: "Thank you!",
        description: "Your feedback helps others find helpful reviews",
      })
    } catch (error) {
      console.error("Error updating helpful count:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Content not found</div>
      </div>
    )
  }

  const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Video Player */}
      <div className="relative h-screen">
        <VideoPlayer
          contentId={contentId}
          title={content.title}
          videoUrl={content.video_url}
          onRatingSubmit={handleRatingSubmit}
          currentUserRating={userRating?.rating}
        />

        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 left-6 z-50 bg-black/50 hover:bg-black/70 text-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Content Details and Ratings */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{content.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleWatchlistToggle}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                {isInWatchlist ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Watchlist
                  </>
                )}
              </Button>

              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Ratings Section */}
            <RatingDisplay
              ratings={ratings}
              averageRating={averageRating}
              totalRatings={ratings.length}
              userRating={userRating?.rating}
              onHelpfulClick={handleHelpfulClick}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="ml-2 capitalize">{content.type}</span>
                </div>
                <div>
                  <span className="text-gray-400">Genres:</span>
                  <span className="ml-2">{content.genre.join(", ")}</span>
                </div>
                <div>
                  <span className="text-gray-400">Rating:</span>
                  <span className="ml-2">{content.rating}/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
