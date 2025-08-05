"use client"

import * as React from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { MovieCard } from "@/components/movie-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sparkles } from "lucide-react"
import { marked } from "marked"

interface RecommendedContent {
  id: string
  title: string
  description: string | null
  release_year: number | null
  type: "movie" | "tv_show"
  poster_url: string | null
  language_id: string | null
  genre_ids: string[]
  languages?: { name: string } | null
  movie_ott_platforms?: { ott_platforms: { name: string; icon_url: string | null } }[]
  ott_platforms?: { name: string; icon_url: string | null }[] // flattened for fallback
}

interface RecommendationsProps {
  content: string | null | undefined
}

export function Recommendations({ content }: RecommendationsProps) {
  const { toast } = useToast()
  const [recommendations, setRecommendations] = React.useState<RecommendedContent[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [allGenres, setAllGenres] = React.useState<{ id: string; name: string }[]>([])
  const [allOttPlatforms, setAllOttPlatforms] = React.useState<
    { id: string; name: string; icon_url: string | null }[]
  >([])

  const supabase = getSupabaseBrowserClient()

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        toast({
          title: "Authentication Error",
          description: userError?.message || "User not logged in.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Fetch all genres and OTT platforms for lookup
      const { data: genresData, error: genresError } = await supabase.from("genres").select("id, name")
      if (genresError) {
        toast({ title: "Error fetching genres", description: genresError.message, variant: "destructive" })
        setIsLoading(false)
        return
      }
      setAllGenres(genresData ?? [])

      const { data: ottData, error: ottError } = await supabase.from("ott_platforms").select("id, name, icon_url")
      if (ottError) {
        toast({ title: "Error fetching OTT platforms", description: ottError.message, variant: "destructive" })
        setIsLoading(false)
        return
      }
      setAllOttPlatforms(ottData ?? [])

      // Fetch user's watched content and ratings
      const { data: watchedContent, error: watchedError } = await supabase
        .from("user_watched_content")
        .select(
          `
            rating,
            movies_tv_shows (
              title,
              type,
              language_id,
              genre_ids,
              languages (name)
            )
          `
        )
        .eq("user_id", user.id)

      if (watchedError) {
        toast({
          title: "Error fetching watched content for recommendations",
          description: watchedError.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Prepare summary for AI
      const watchedMoviesSummary =
        watchedContent
          ?.filter((item) => item.movies_tv_shows)
          .map((item) => {
            const content = item.movies_tv_shows
            const displayGenres =
              content?.genre_ids
                ?.map((genreId: string) => genresData?.find((g) => g.id === genreId)?.name)
                .filter(Boolean)
                .join(", ") || "N/A"
            return `${content?.title} (${content?.type}, ${content?.languages?.name || "N/A"}, ${displayGenres}) - Rated: ${item.rating || "N/A"}/5`
          })
          .join("\n") ?? ""

      // User's preferred languages and genres
      const { data: userProfile, error: profileError } = await supabase
        .from("user_profiles")
        .select("preferred_language_ids, preferred_genre_ids")
        .eq("user_id", user.id)
        .single()

      let preferredLanguages = "any"
      let preferredGenres = "any"
      if (userProfile) {
        if (Array.isArray(userProfile.preferred_language_ids) && userProfile.preferred_language_ids.length) {
          // NOTE: You may want to improve this to fetch names via languages table in parallel.
          preferredLanguages = userProfile.preferred_language_ids.join(", ")
        }
        if (Array.isArray(userProfile.preferred_genre_ids) && userProfile.preferred_genre_ids.length) {
          preferredGenres =
            userProfile.preferred_genre_ids
              .map((genreId: string) => genresData?.find((g) => g.id === genreId)?.name)
              .filter(Boolean)
              .join(", ") || "any"
        }
      }

      // Construct the AI prompt
      const prompt = `
        The user has watched and rated the following content:
        ${watchedMoviesSummary || "No content watched yet."}

        Their preferred languages are: ${preferredLanguages}
        Their preferred genres are: ${preferredGenres}

        Based on this information, recommend 5-10 movies or TV shows.
        For each recommendation, provide only the title, type (movie/tv_show), and a very brief one-sentence description.
        Format your response as a JSON array of objects, like this:
        [
          { "title": "Movie Title 1", "type": "movie", "description": "Brief description." },
          { "title": "TV Show Title 1", "type": "tv_show", "description": "Brief description." }
        ]
        Ensure the recommendations are distinct from the watched content and align with their preferences.
      `

      try {
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch recommendations from AI.")
        }

        const { recommendations: aiRecommendations } = await response.json()

        // Try to find these recommended titles in our DB to get full details
        const recommendedTitles = aiRecommendations.map((rec: any) => rec.title)
        if (recommendedTitles.length > 0) {
          const { data: dbContent, error: dbError } = await supabase
            .from("movies_tv_shows")
            .select(
              `
                id,
                title,
                description,
                release_year,
                type,
                poster_url,
                language_id,
                genre_ids,
                languages (name),
                movie_ott_platforms (
                  ott_platforms (name, icon_url)
                )
              `
            )
            .in("title", recommendedTitles)

          if (dbError) {
            toast({
              title: "Error fetching recommended content details",
              description: dbError.message,
              variant: "destructive",
            })
          } else {
            // Map AI recommendations to full database content and flatten OTT platforms if needed
            const finalRecommendations = aiRecommendations.map((aiRec: any) => {
              const foundInDb = dbContent?.find((dbItem) => dbItem.title === aiRec.title)
              if (foundInDb) {
                // Flatten OTT platforms
                let ott_platforms =
                  Array.isArray(foundInDb.movie_ott_platforms)
                    ? foundInDb.movie_ott_platforms.map((p: any) => ({
                        name: p.ott_platforms?.name || "",
                        icon_url: p.ott_platforms?.icon_url || null,
                      }))
                    : []
                return {
                  ...foundInDb,
                  ott_platforms,
                }
              }
              // If not found in DB, use only AI data
              return {
                id: `ai-rec-${aiRec.title.replace(/\s/g, "-")}`,
                title: aiRec.title,
                description: aiRec.description,
                type: aiRec.type,
                poster_url: `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(aiRec.title + " poster")}`,
                release_year: null,
                language_id: null,
                genre_ids: [],
                languages: null,
                ott_platforms: [],
              }
            })
            setRecommendations(finalRecommendations)
          }
        } else {
          setRecommendations([])
        }
      } catch (error: any) {
        toast({
          title: "Recommendation Error",
          description: error.message,
          variant: "destructive",
        })
        console.error("AI Recommendation Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, toast])

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4 bg-background text-foreground">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="ml-4 text-lg">Generating personalized recommendations...</p>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-7xl mx-auto bg-card text-card-foreground border-border p-6">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary flex items-center">
          <Sparkles className="h-7 w-7 mr-2" /> AI-Powered Recommendations
        </CardTitle>
        <Separator className="my-4 bg-border" />
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg">
            No recommendations available yet. Watch and rate more movies to get better suggestions!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {recommendations.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                readOnlyRating
                allGenres={allGenres}
                allOttPlatforms={allOttPlatforms}
              />
            ))}
          </div>
        )}
        <div className="prose prose-invert max-w-none mt-6">
          {/* SAFE: Never passes undefined to marked */}
          <div dangerouslySetInnerHTML={{ __html: marked(content ?? "") }} />
        </div>
      </CardContent>
    </Card>
  )
}
