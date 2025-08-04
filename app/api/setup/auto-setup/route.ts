import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

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
      {
        title: "The Office",
        description: "A mockumentary sitcom about the everyday lives of office employees working at a paper company.",
        type: "tv_show",
        genre: ["Comedy"],
        release_year: 2005,
        duration_minutes: 22,
        rating: 8.9,
        poster_url: "/placeholder.svg?height=600&width=400&text=The+Office",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=The+Office+Backdrop",
      },
      {
        title: "Pulp Fiction",
        description:
          "The lives of two mob hitmen, a boxer, and others intertwine in four tales of violence and redemption.",
        type: "movie",
        genre: ["Crime", "Drama"],
        release_year: 1994,
        duration_minutes: 154,
        rating: 8.9,
        poster_url: "/placeholder.svg?height=600&width=400&text=Pulp+Fiction",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=Pulp+Fiction+Backdrop",
      },
      {
        title: "Game of Thrones",
        description: "Nine noble families fight for control over the lands of Westeros while an ancient enemy returns.",
        type: "tv_show",
        genre: ["Action", "Adventure", "Drama"],
        release_year: 2011,
        duration_minutes: 57,
        rating: 9.3,
        poster_url: "/placeholder.svg?height=600&width=400&text=Game+of+Thrones",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=Game+of+Thrones+Backdrop",
      },
      {
        title: "Interstellar",
        description:
          "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        type: "movie",
        genre: ["Adventure", "Drama", "Sci-Fi"],
        release_year: 2014,
        duration_minutes: 169,
        rating: 8.6,
        poster_url: "/placeholder.svg?height=600&width=400&text=Interstellar",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=Interstellar+Backdrop",
      },
      {
        title: "Friends",
        description:
          "Follows the personal and professional lives of six twenty to thirty-something friends living in Manhattan.",
        type: "tv_show",
        genre: ["Comedy", "Romance"],
        release_year: 1994,
        duration_minutes: 22,
        rating: 8.9,
        poster_url: "/placeholder.svg?height=600&width=400&text=Friends",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=Friends+Backdrop",
      },
      {
        title: "Avengers: Endgame",
        description: "The Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
        type: "movie",
        genre: ["Action", "Adventure", "Drama"],
        release_year: 2019,
        duration_minutes: 181,
        rating: 8.4,
        poster_url: "/placeholder.svg?height=600&width=400&text=Avengers+Endgame",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=Avengers+Endgame+Backdrop",
      },
      {
        title: "The Crown",
        description:
          "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
        type: "tv_show",
        genre: ["Biography", "Drama", "History"],
        release_year: 2016,
        duration_minutes: 58,
        rating: 8.7,
        poster_url: "/placeholder.svg?height=600&width=400&text=The+Crown",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=The+Crown+Backdrop",
      },
      {
        title: "Wednesday",
        description: "Follows Wednesday Addams' years as a student at Nevermore Academy.",
        type: "tv_show",
        genre: ["Comedy", "Crime", "Family"],
        release_year: 2022,
        duration_minutes: 51,
        rating: 8.1,
        poster_url: "/placeholder.svg?height=600&width=400&text=Wednesday",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=Wednesday+Backdrop",
      },
      {
        title: "Ozark",
        description:
          "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.",
        type: "tv_show",
        genre: ["Crime", "Drama", "Thriller"],
        release_year: 2017,
        duration_minutes: 60,
        rating: 8.4,
        poster_url: "/placeholder.svg?height=600&width=400&text=Ozark",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=Ozark+Backdrop",
      },
      {
        title: "Black Mirror",
        description:
          "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
        type: "tv_show",
        genre: ["Drama", "Sci-Fi", "Thriller"],
        release_year: 2011,
        duration_minutes: 60,
        rating: 8.8,
        poster_url: "/placeholder.svg?height=600&width=400&text=Black+Mirror",
        backdrop_url: "/placeholder.svg?height=1080&width=1920&text=Black+Mirror+Backdrop",
      },
    ]

    // Insert sample content
    const { data, error } = await supabase.from("content").upsert(sampleContent, {
      onConflict: "title",
      ignoreDuplicates: false,
    })

    if (error) {
      console.error("Auto-setup error:", error)
      return NextResponse.json(
        {
          success: false,
          message: `Auto-setup failed: ${error.message}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully set up database with ${sampleContent.length} content items`,
      contentCount: sampleContent.length,
    })
  } catch (error) {
    console.error("Auto-setup error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Auto-setup failed due to an unexpected error",
      },
      { status: 500 },
    )
  }
}
