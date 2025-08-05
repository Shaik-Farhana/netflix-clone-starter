"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { ReviewDialog } from "@/components/review-dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, Check } from "lucide-react"

interface MovieCardProps {
  movie: {
    id: string
    title: string
    release_year: number
    poster_url: string | null
    overview: string | null
    genres?: { name: string }[]
    languages?: { name: string }[]
    ott_platforms?: { name: string }[]
    user_rating?: number | null
    user_review?: string | null
    is_watched?: boolean
  }
  onWatchedStatusChange?: (movieId: string, isWatched: boolean) => void
  onReviewSubmitted?: () => void
  readOnlyRating?: boolean
  allGenres?: { id: string, name: string }[]
  allOttPlatforms?: { id: string, name: string, icon_url: string | null }[]
}

export function MovieCard({
  movie,
  onWatchedStatusChange,
  onReviewSubmitted,
  readOnlyRating = false,
  allGenres = [],
  allOttPlatforms = [],
}: MovieCardProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isWatched, setIsWatched] = useState(movie.is_watched || false)
  const [loadingWatchStatus, setLoadingWatchStatus] = useState(false)
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  const handleToggleWatched = async () => {
    setLoadingWatchStatus(true)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      toast({
        title: "Error",
        description: userError?.message || "You must be logged in to mark content as watched.",
        variant: "destructive",
      })
      setLoadingWatchStatus(false)
      return
    }

    try {
      if (isWatched) {
        // Mark as unwatched
        const { error } = await supabase
          .from("user_watched_content")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movie.id)
        if (error) throw error
        setIsWatched(false)
        toast({ title: "Removed from Watched", description: `${movie.title} has been marked as unwatched.` })
      } else {
        // Mark as watched using upsert to avoid duplicate errors
        const { error } = await supabase.from("user_watched_content").upsert(
          {
            user_id: user.id,
            movie_id: movie.id,
            watched_at: new Date().toISOString(),
          },
          { onConflict: ["user_id", "movie_id"] }
        )
        if (error) throw error
        setIsWatched(true)
        toast({ title: "Added to Watched", description: `${movie.title} has been marked as watched.` })
      }
      onWatchedStatusChange?.(movie.id, !isWatched)
    } catch (error: any) {
      // Show meaningful info if present
      let message =
        error?.message ||
        error?.details ||
        error?.hint ||
        (typeof error === "object" ? JSON.stringify(error) : String(error)) ||
        "Failed to update watched status."
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      console.error("Error toggling watched status:", error, JSON.stringify(error))
    } finally {
      setLoadingWatchStatus(false)
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-card text-card-foreground border-netflix-dark-light">
      <div className="relative h-48 w-full">
        {movie.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={movie.poster_url || "/placeholder.svg"}
            alt={movie.title}
            className="h-full w-full object-cover"
            onError={e => {
              e.currentTarget.src = "/placeholder.svg?height=192&width=384"
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            No Poster Available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <CardTitle className="text-2xl font-bold text-primary-foreground">{movie.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{movie.release_year}</CardDescription>
        </div>
      </div>
      <CardContent className="flex-1 p-4">
        <p className="mb-4 text-sm text-muted-foreground line-clamp-3">{movie.overview}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {(movie.genres ?? []).map((genre) => (
            <Badge key={genre.name} variant="secondary" className="bg-secondary text-secondary-foreground">
              {genre.name}
            </Badge>
          ))}
          {(movie.languages ?? []).map((lang) => (
            <Badge key={lang.name} variant="outline" className="border-border text-muted-foreground">
              {lang.name}
            </Badge>
          ))}
        </div>
        {Array.isArray(movie.ott_platforms) && movie.ott_platforms.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground">Available on:</p>
            <div className="flex flex-wrap gap-1">
              {movie.ott_platforms.map((platform) => (
                <Badge key={platform.name} className="bg-primary/20 text-primary">
                  {platform.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {/* Show user's rating only if not in read-only/AI rec mode */}
        {movie.user_rating !== undefined && !readOnlyRating && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">Your Rating:</span>
            <StarRating initialRating={movie.user_rating || 0} readOnly size={18} />
            {movie.user_rating ? (
              <span className="text-sm text-foreground">({movie.user_rating}/5)</span>
            ) : (
              <span className="text-sm text-muted-foreground">Not rated</span>
            )}
          </div>
        )}
        {movie.user_review && !readOnlyRating && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-muted-foreground">Your Review:</p>
            <p className="text-sm text-foreground italic line-clamp-2">"{movie.user_review}"</p>
          </div>
        )}
      </CardContent>
      {!readOnlyRating && (
        <CardFooter className="flex justify-between p-4 pt-0">
          <Button
            variant={isWatched ? "secondary" : "default"}
            onClick={handleToggleWatched}
            disabled={loadingWatchStatus}
            className={
              isWatched
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                : "bg-primary text-primary-foreground hover:bg-netflix-red-dark"
            }
          >
            {loadingWatchStatus ? (
              "Loading..."
            ) : isWatched ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Watched
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Mark as Watched
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsReviewDialogOpen(true)}
            className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {movie.user_rating || movie.user_review ? "Edit Review" : "Add Review"}
          </Button>
        </CardFooter>
      )}
      {!readOnlyRating && (
        <ReviewDialog
          open={isReviewDialogOpen}
          onOpenChange={setIsReviewDialogOpen}
          movieId={movie.id}
          initialRating={movie.user_rating || 0}
          initialReview={movie.user_review || ""}
          onReviewSubmitted={() => onReviewSubmitted?.()}
        />
      )}
    </Card>
  )
}
