"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { MovieCard } from "@/components/movie-card"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardWatchedMoviesProps {
  userId: string
}

interface WatchedMovie {
  id: string
  title: string
  release_year: number
  poster_url: string | null
  overview: string | null
  // You can add genres/languages/ott_platforms fields as your schema supports
}

export function DashboardWatchedMovies({ userId }: DashboardWatchedMoviesProps) {
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  const fetchWatchedMovies = async () => {
    setLoading(true)
    // --- SIMPLE SAFE QUERY ---
    const { data, error } = await supabase
      .from("user_watched_content")
      .select(
        `
          movie_id,
          movies_tv_shows (
            id,
            title,
            release_year,
            poster_url,
            overview
          )
        `
      )
      .eq("user_id", userId)
      .order("watched_at", { ascending: false })
      .limit(6)
    //-------------------------

    if (error) {
      console.error("Error fetching watched movies:", error)
      toast({
        title: "Error",
        description: "Failed to load watched movies.",
        variant: "destructive",
      })
      setWatchedMovies([])
    } else {
      const formatted: WatchedMovie[] =
        Array.isArray(data)
          ? data.map((item: any) => ({
              id: item.movies_tv_shows?.id || "",
              title: item.movies_tv_shows?.title || "N/A",
              release_year: item.movies_tv_shows?.release_year || 0,
              poster_url: item.movies_tv_shows?.poster_url || null,
              overview: item.movies_tv_shows?.overview || null,
            }))
          : []
      setWatchedMovies(formatted)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWatchedMovies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // You can rerun this after review/unwatch, etc
  const handleReviewSubmitted = () => fetchWatchedMovies()
  const handleWatchedStatusChange = () => fetchWatchedMovies()

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!watchedMovies.length) {
    return <p className="text-muted-foreground">You haven't watched any movies yet. Start discovering!</p>
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {watchedMovies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onReviewSubmitted={handleReviewSubmitted}
          onWatchedStatusChange={handleWatchedStatusChange}
        />
      ))}
    </div>
  )
}
