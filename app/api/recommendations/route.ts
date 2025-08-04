import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      // Return popular movies if user not authenticated
      const { data: popularMovies, error } = await supabase
        .from("content")
        .select("*")
        .order("rating", { ascending: false })
        .limit(20)

      if (error) {
        console.error("Error fetching popular movies:", error)
        return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
      }

      const transformedMovies =
        popularMovies?.map((movie) => ({
          id: movie.id,
          title: movie.title,
          overview: movie.description,
          poster_url: movie.poster_url,
          backdrop_url: movie.backdrop_url,
          year: movie.release_year,
          genre: movie.genre || [],
          imdb_rating: movie.rating,
          type: movie.type,
          duration: movie.duration_minutes,
          streaming_platforms: movie.streaming_platforms || [],
        })) || []

      return NextResponse.json({ recommendations: transformedMovies })
    }

    // Get user's ratings to understand preferences
    const { data: userRatings, error: ratingsError } = await supabase
      .from("user_ratings")
      .select(`
        rating,
        content:content_id (
          id,
          title,
          description,
          poster_url,
          backdrop_url,
          release_year,
          genre,
          rating,
          type,
          duration_minutes,
          streaming_platforms
        )
      `)
      .eq("user_id", user.id)
      .gte("rating", 4) // Only consider highly rated movies

    if (ratingsError) {
      console.error("Error fetching user ratings:", ratingsError)
      return NextResponse.json({ error: "Failed to fetch user preferences" }, { status: 500 })
    }

    // Extract preferred genres from highly rated content
    const preferredGenres = new Set<string>()
    const ratedContentIds = new Set<string>()

    userRatings?.forEach((rating) => {
      if (rating.content && Array.isArray(rating.content.genre)) {
        rating.content.genre.forEach((genre: string) => preferredGenres.add(genre))
        ratedContentIds.add(rating.content.id)
      }
    })

    // If user has no preferences, return popular content
    if (preferredGenres.size === 0) {
      const { data: popularMovies, error } = await supabase
        .from("content")
        .select("*")
        .order("rating", { ascending: false })
        .limit(20)

      if (error) {
        console.error("Error fetching popular movies:", error)
        return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
      }

      const transformedMovies =
        popularMovies?.map((movie) => ({
          id: movie.id,
          title: movie.title,
          overview: movie.description,
          poster_url: movie.poster_url,
          backdrop_url: movie.backdrop_url,
          year: movie.release_year,
          genre: movie.genre || [],
          imdb_rating: movie.rating,
          type: movie.type,
          duration: movie.duration_minutes,
          streaming_platforms: movie.streaming_platforms || [],
        })) || []

      return NextResponse.json({ recommendations: transformedMovies })
    }

    // Get recommendations based on preferred genres
    const genreArray = Array.from(preferredGenres)
    const { data: recommendations, error: recError } = await supabase
      .from("content")
      .select("*")
      .overlaps("genre", genreArray)
      .not("id", "in", `(${Array.from(ratedContentIds).join(",")})`)
      .gte("rating", 7.0) // Only recommend well-rated content
      .order("rating", { ascending: false })
      .limit(20)

    if (recError) {
      console.error("Error fetching recommendations:", recError)
      return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
    }

    const transformedRecommendations =
      recommendations?.map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.description,
        poster_url: movie.poster_url,
        backdrop_url: movie.backdrop_url,
        year: movie.release_year,
        genre: movie.genre || [],
        imdb_rating: movie.rating,
        type: movie.type,
        duration: movie.duration_minutes,
        streaming_platforms: movie.streaming_platforms || [],
      })) || []

    return NextResponse.json({ recommendations: transformedRecommendations })
  } catch (error) {
    console.error("Recommendations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
