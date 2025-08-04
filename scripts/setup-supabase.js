import { createClient } from "@supabase/supabase-js"

// This script will run the database setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.log("⚠️ Supabase credentials not found. Using mock data instead.")
  process.exit(0)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log("🚀 Setting up Supabase database...")

  try {
    // Create tables
    const { error: schemaError } = await supabase.rpc("exec_sql", {
      sql: `
        -- Enable necessary extensions
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Users table (extends Supabase auth.users)
        CREATE TABLE IF NOT EXISTS public.user_profiles (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          full_name TEXT,
          avatar_url TEXT,
          subscription_tier TEXT DEFAULT 'basic',
          preferences JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Movies and TV Shows
        CREATE TABLE IF NOT EXISTS public.content (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          type TEXT NOT NULL CHECK (type IN ('movie', 'tv_show')),
          genre TEXT[] DEFAULT '{}',
          release_year INTEGER,
          duration_minutes INTEGER,
          rating DECIMAL(3,1),
          poster_url TEXT,
          backdrop_url TEXT,
          video_url TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable Row Level Security
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

        -- RLS Policies
        DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
        CREATE POLICY "Users can view own profile" ON public.user_profiles
          FOR SELECT USING (auth.uid() = id);

        DROP POLICY IF EXISTS "Anyone can view content" ON public.content;
        CREATE POLICY "Anyone can view content" ON public.content
          FOR SELECT USING (true);
      `,
    })

    if (schemaError) {
      console.error("Schema creation error:", schemaError)
      return
    }

    console.log("✅ Database schema created successfully")

    // Insert sample content
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
        poster_url: "/placeholder.svg?height=600&width=400",
        backdrop_url: "/placeholder.svg?height=1080&width=1920",
      },
      {
        title: "Stranger Things",
        description: "A group of kids in a small town uncover supernatural mysteries and government conspiracies.",
        type: "tv_show",
        genre: ["Drama", "Fantasy", "Horror"],
        release_year: 2016,
        duration_minutes: 50,
        rating: 8.7,
        poster_url: "/placeholder.svg?height=600&width=400",
        backdrop_url: "/placeholder.svg?height=1080&width=1920",
      },
      {
        title: "Inception",
        description:
          "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        type: "movie",
        genre: ["Action", "Sci-Fi", "Thriller"],
        release_year: 2010,
        duration_minutes: 148,
        rating: 8.8,
        poster_url: "/placeholder.svg?height=600&width=400",
        backdrop_url: "/placeholder.svg?height=1080&width=1920",
      },
      {
        title: "Breaking Bad",
        description:
          "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student.",
        type: "tv_show",
        genre: ["Crime", "Drama", "Thriller"],
        release_year: 2008,
        duration_minutes: 47,
        rating: 9.5,
        poster_url: "/placeholder.svg?height=600&width=400",
        backdrop_url: "/placeholder.svg?height=1080&width=1920",
      },
      {
        title: "The Dark Knight",
        description: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.",
        type: "movie",
        genre: ["Action", "Crime", "Drama"],
        release_year: 2008,
        duration_minutes: 152,
        rating: 9.0,
        poster_url: "/placeholder.svg?height=600&width=400",
        backdrop_url: "/placeholder.svg?height=1080&width=1920",
      },
      {
        title: "The Office",
        description: "A mockumentary sitcom about the everyday lives of office employees working at a paper company.",
        type: "tv_show",
        genre: ["Comedy"],
        release_year: 2005,
        duration_minutes: 22,
        rating: 8.9,
        poster_url: "/placeholder.svg?height=600&width=400",
        backdrop_url: "/placeholder.svg?height=1080&width=1920",
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
        poster_url: "/placeholder.svg?height=600&width=400",
        backdrop_url: "/placeholder.svg?height=1080&width=1920",
      },
      {
        title: "Game of Thrones",
        description: "Nine noble families fight for control over the lands of Westeros while an ancient enemy returns.",
        type: "tv_show",
        genre: ["Action", "Adventure", "Drama"],
        release_year: 2011,
        duration_minutes: 57,
        rating: 9.3,
        poster_url: "/placeholder.svg?height=600&width=400",
        backdrop_url: "/placeholder.svg?height=1080&width=1920",
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
        poster_url: "/placeholder.svg?height=600&width=400",
        backdrop_url: "/placeholder.svg?height=1080&width=1920",
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
        poster_url: "/placeholder.svg?height=600&width=400",
        backdrop_url: "/placeholder.svg?height=1080&width=1920",
      },
    ]

    // Insert content
    const { error: insertError } = await supabase.from("content").upsert(sampleContent, { onConflict: "title" })

    if (insertError) {
      console.error("Content insertion error:", insertError)
      return
    }

    console.log("✅ Sample content inserted successfully")
    console.log(`📊 Inserted ${sampleContent.length} movies and TV shows`)
  } catch (error) {
    console.error("Setup error:", error)
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
}

export { setupDatabase }
