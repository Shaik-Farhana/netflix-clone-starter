import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Check if Supabase is configured
    const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase credentials not configured",
        },
        { status: 400 },
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Test connection first
    try {
      const { data: testData, error: testError } = await supabase.from("content").select("id").limit(1)

      if (testError && testError.code === "42P01") {
        // Table doesn't exist - this is expected for new setups
        console.log("Content table doesn't exist yet, will be created by Supabase")
      } else if (testError) {
        console.error("Database connection error:", testError)
        return NextResponse.json(
          {
            success: false,
            message: `Database connection failed: ${testError.message}`,
          },
          { status: 500 },
        )
      }
    } catch (connectionError) {
      console.error("Connection test failed:", connectionError)
      return NextResponse.json(
        {
          success: false,
          message: "Unable to connect to database. Please check your Supabase configuration.",
        },
        { status: 500 },
      )
    }

    // Sample content to insert
    const sampleContent = [
      {
        title: "The Matrix",
        description:
          "A computer programmer discovers reality is a simulation and joins a rebellion against the machines.",
        type: "movie",
        genre: ["Action", "Sci-Fi"],
        release_year: 1999,
        duration_minutes: 136,
        rating: 8.7,
        poster_url: "/placeholder.svg?height=600&width=400&text=The+Matrix",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=The+Matrix+Backdrop",
      },
      {
        title: "Stranger Things",
        description: "A group of kids in a small town uncover supernatural mysteries and government conspiracies.",
        type: "tv_show",
        genre: ["Drama", "Fantasy", "Horror"],
        release_year: 2016,
        duration_minutes: 50,
        rating: 8.7,
        poster_url: "/placeholder.svg?height=600&width=400&text=Stranger+Things",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=Stranger+Things+Backdrop",
      },
      {
        title: "Inception",
        description: "A thief who steals corporate secrets through dream-sharing technology.",
        type: "movie",
        genre: ["Action", "Sci-Fi", "Thriller"],
        release_year: 2010,
        duration_minutes: 148,
        rating: 8.8,
        poster_url: "/placeholder.svg?height=600&width=400&text=Inception",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=Inception+Backdrop",
      },
      {
        title: "Breaking Bad",
        description: "A high school chemistry teacher turned methamphetamine manufacturer.",
        type: "tv_show",
        genre: ["Crime", "Drama", "Thriller"],
        release_year: 2008,
        duration_minutes: 47,
        rating: 9.5,
        poster_url: "/placeholder.svg?height=600&width=400&text=Breaking+Bad",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=Breaking+Bad+Backdrop",
      },
      {
        title: "The Dark Knight",
        description: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.",
        type: "movie",
        genre: ["Action", "Crime", "Drama"],
        release_year: 2008,
        duration_minutes: 152,
        rating: 9.0,
        poster_url: "/placeholder.svg?height=600&width=400&text=The+Dark+Knight",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=The+Dark+Knight+Backdrop",
      },
    ]

    // Try to insert sample content
    try {
      const { data, error } = await supabase.from("content").upsert(sampleContent, {
        onConflict: "title",
        ignoreDuplicates: false,
      })

      if (error) {
        console.error("Insert error:", error)

        // Handle specific error cases
        if (error.code === "42P01") {
          return NextResponse.json(
            {
              success: false,
              message:
                "Database tables not found. Please ensure your Supabase project has the required schema. Check the README for setup instructions.",
            },
            { status: 500 },
          )
        }

        if (error.code === "42501") {
          return NextResponse.json(
            {
              success: false,
              message: "Insufficient permissions. Please check your Supabase RLS policies and service role key.",
            },
            { status: 500 },
          )
        }

        return NextResponse.json(
          {
            success: false,
            message: `Database setup failed: ${error.message}`,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: `Successfully set up database with ${sampleContent.length} content items`,
        contentCount: sampleContent.length,
      })
    } catch (insertError) {
      console.error("Insert operation failed:", insertError)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to insert content into database. Please check your database configuration.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Setup failed due to an unexpected error. Please try again or check your configuration.",
      },
      { status: 500 },
    )
  }
}
