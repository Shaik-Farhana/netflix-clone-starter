import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Check if Supabase is configured
    const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    if (!isSupabaseConfigured) {
      return NextResponse.json({
        isSetup: false,
        message: "Supabase not configured",
        needsIntegration: true,
      })
    }

    try {
      const supabase = createRouteHandlerClient({ cookies })

      // Check if content table exists and has data
      const { data, error } = await supabase.from("content").select("id").limit(1)

      if (error) {
        if (error.code === "42P01") {
          return NextResponse.json({
            isSetup: false,
            message: "Database tables not found",
            needsSchema: true,
          })
        }

        return NextResponse.json({
          isSetup: false,
          message: `Database error: ${error.message}`,
          error: error.code,
        })
      }

      return NextResponse.json({
        isSetup: data && data.length > 0,
        message: data && data.length > 0 ? "Setup complete" : "No content found",
        hasContent: data && data.length > 0,
      })
    } catch (dbError) {
      console.error("Database check failed:", dbError)
      return NextResponse.json({
        isSetup: false,
        message: "Unable to connect to database",
        connectionError: true,
      })
    }
  } catch (error) {
    console.error("Setup check error:", error)
    return NextResponse.json({
      isSetup: false,
      message: "Setup check failed",
      error: true,
    })
  }
}
