import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)

    const movieId = searchParams.get("movieId")
    const userId = searchParams.get("userId")

    if (!movieId || !userId) {
      return NextResponse.json({ error: "Missing movieId or userId" }, { status: 400 })
    }

    const { data: rating, error } = await supabase
      .from("user_ratings")
      .select("*")
      .eq("content_id", movieId)
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching rating:", error)
      return NextResponse.json({ error: "Failed to fetch rating" }, { status: 500 })
    }

    return NextResponse.json({ rating })
  } catch (error) {
    console.error("Ratings GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Auth error:", userError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { movieId, rating, review } = body

    console.log("Rating submission:", { movieId, rating, review, userId: user.id })

    if (!movieId || !rating) {
      return NextResponse.json({ error: "Missing movieId or rating" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // First check if the content exists
    const { data: contentExists, error: contentError } = await supabase
      .from("content")
      .select("id")
      .eq("id", movieId)
      .single()

    if (contentError || !contentExists) {
      console.error("Content not found:", contentError)
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    // Upsert the rating (without updated_at column)
    const { data, error } = await supabase
      .from("user_ratings")
      .upsert({
        user_id: user.id,
        content_id: movieId,
        rating: Number.parseInt(rating),
        review_text: review || null,
      })
      .select()

    if (error) {
      console.error("Error saving rating:", error)
      return NextResponse.json({ error: "Failed to save rating: " + error.message }, { status: 500 })
    }

    console.log("Rating saved successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Ratings POST error:", error)
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}
