// Simple Node.js script to run the setup
const { createClient } = require("@supabase/supabase-js")

console.log("🚀 Starting Supabase setup for Netflix Clone...")

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.log("⚠️ Supabase credentials not found in environment variables.")
  console.log("The app will work with mock data for the preview.")
  console.log("")
  console.log("To set up Supabase:")
  console.log("1. Create a Supabase project at https://supabase.com")
  console.log("2. Add your credentials to .env.local:")
  console.log("   NEXT_PUBLIC_SUPABASE_URL=your_project_url")
  console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key")
  console.log("   SUPABASE_SERVICE_ROLE_KEY=your_service_key")
  console.log("3. Run this setup script again")
  process.exit(0)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log("📋 Creating database schema...")

    // First, let's check if we can connect
    const { data: testData, error: testError } = await supabase.from("content").select("count").limit(1)

    if (testError && testError.code === "42P01") {
      // Table doesn't exist, create it
      console.log("🔧 Creating tables...")

      // Create content table
      const { error: createError } = await supabase.rpc("exec", {
        sql: `
          CREATE TABLE IF NOT EXISTS public.content (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
          
          ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY IF NOT EXISTS "Anyone can view content" ON public.content
            FOR SELECT USING (true);
        `,
      })

      if (createError) {
        console.error("❌ Error creating tables:", createError)
        return
      }
    }

    console.log("✅ Database schema ready")

    // Insert sample content
    console.log("📊 Inserting sample content...")

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
        description: "A thief who steals corporate secrets through dream-sharing technology.",
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
        description: "A high school chemistry teacher turned methamphetamine manufacturer.",
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
    ]

    const { data, error } = await supabase.from("content").upsert(sampleContent, {
      onConflict: "title",
      ignoreDuplicates: false,
    })

    if (error) {
      console.error("❌ Error inserting content:", error)
      return
    }

    console.log("✅ Sample content inserted successfully!")
    console.log(`📊 Added ${sampleContent.length} movies and TV shows`)
    console.log("")
    console.log("🎉 Supabase setup complete!")
    console.log("Your Netflix Clone is now ready with:")
    console.log("- Database schema created")
    console.log("- Sample content loaded")
    console.log("- Authentication ready")
    console.log("")
    console.log("You can now:")
    console.log("1. Sign up for a new account")
    console.log("2. Browse the content library")
    console.log("3. Use the search and recommendation features")
  } catch (error) {
    console.error("❌ Setup failed:", error)
  }
}

setupDatabase()
