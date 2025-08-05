import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const supabase = await getSupabaseServerClient()

  try {
    // Fetch all genres and languages for mapping IDs to names
    const { data: allGenres, error: genresError } = await supabase.from("genres").select("id, name")
    const { data: allLanguages, error: languagesError } = await supabase.from("languages").select("id, name")

    if (genresError) throw genresError
    if (languagesError) throw languagesError

    const genreMap = new Map(allGenres?.map((g) => [g.id, g.name]))
    const languageMap = new Map(allLanguages?.map((l) => [l.id, l.name]))

    // Fetch user's watched movies, genres, and languages
    const { data: watchedContent, error: watchedError } = await supabase
      .from("user_watched_content")
      .select(
        `
        movie_id,
        movies_tv_shows (
          title,
          release_year,
          genre_ids,
          language_ids
        ),
        ratings (rating_value)
      `,
      )
      .eq("user_id", userId)
      .limit(10) // Limit to recent watched content for prompt brevity

    if (watchedError) throw watchedError

    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("preferred_genres, preferred_languages")
      .eq("user_id", userId)
      .single()

    if (profileError) throw profileError

    const watchedMovies = watchedContent
      .map((wc) => {
        const movie = wc.movies_tv_shows
        const genres =
          movie?.genre_ids
            ?.map((id: number) => genreMap.get(id))
            .filter(Boolean)
            .join(", ") || "N/A"
        const languages =
          movie?.language_ids
            ?.map((id: number) => languageMap.get(id))
            .filter(Boolean)
            .join(", ") || "N/A"
        const rating = wc.ratings?.[0]?.rating_value || "Not Rated"
        return `- ${movie?.title} (${movie?.release_year}), Genres: ${genres}, Languages: ${languages}, Your Rating: ${rating}`
      })
      .join("\n")

    const preferredGenres =
      userProfile?.preferred_genres
        ?.map((id: number) => genreMap.get(id))
        .filter(Boolean)
        .join(", ") || "None specified"
    const preferredLanguages =
      userProfile?.preferred_languages
        ?.map((id: number) => languageMap.get(id))
        .filter(Boolean)
        .join(", ") || "None specified"

    const prompt = `
      You are a movie and TV show recommendation AI. Based on the user's preferences and watched content, suggest 5-7 new movies or TV shows they might enjoy.
      Provide a brief reason for each recommendation.

      User's Preferred Genres: ${preferredGenres}
      User's Preferred Languages: ${preferredLanguages}

      User's Recently Watched Content:
      ${watchedMovies || "No content watched yet."}

      Please provide recommendations in the following format:
      1. [Title] ([Year]) - [Brief reason, e.g., "Similar to X, with Y genre elements." or "Matches your preferred genres."].
      2. ...
    `

    const { text } = await generateText({
      model: openai("gpt-4o"), // Using OpenAI model via AI SDK
      prompt: prompt,
    })

    return NextResponse.json({ recommendations: text })
  } catch (error: any) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json({ error: error.message || "Failed to generate recommendations" }, { status: 500 })
  }
}
