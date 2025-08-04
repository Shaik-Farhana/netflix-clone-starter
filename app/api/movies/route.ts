import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)

    const type = searchParams.get("type") || "all"
    const genre = searchParams.get("genre")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "rating"

    let query = supabase.from("content").select("*")

    // Filter by type (movie/tv_show)
    if (type !== "all") {
      query = query.eq("type", type)
    }

    // Filter by genre
    if (genre && genre !== "all") {
      query = query.contains("genre", [genre])
    }

    // Search by title
    if (search) {
      query = query.ilike("title", `%${search}%`)
    }

    // Sort results
    switch (sort) {
      case "rating":
        query = query.order("rating", { ascending: false })
        break
      case "year":
        query = query.order("release_year", { ascending: false })
        break
      case "title":
        query = query.order("title", { ascending: true })
        break
      default:
        query = query.order("rating", { ascending: false })
    }

    const { data: movies, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
    }

    // Transform data to match frontend expectations
    const transformedMovies =
      movies?.map((movie) => ({
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

    return NextResponse.json({ movies: transformedMovies })
  } catch (error) {
    console.error("Movies API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
