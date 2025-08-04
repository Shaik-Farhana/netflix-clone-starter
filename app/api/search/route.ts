import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const PYTHON_API_BASE = process.env.PYTHON_API_BASE || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query, filters } = await request.json()

    // Call Python search microservice with ML ranking
    const response = await fetch(`${PYTHON_API_BASE}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PYTHON_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        filters,
        user_id: user.id,
        user_preferences: await getUserPreferences(user.id, supabase),
        search_history: await getSearchHistory(user.id, supabase),
      }),
    })

    if (!response.ok) {
      throw new Error("Search service error")
    }

    const results = await response.json()

    // Log search for analytics and personalization
    await logSearchQuery(user.id, query, filters, results.length, supabase)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

async function getUserPreferences(userId: string, supabase: any) {
  const { data } = await supabase.from("user_preferences").select("*").eq("user_id", userId).single()

  return data || {}
}

async function getSearchHistory(userId: string, supabase: any) {
  const { data } = await supabase
    .from("search_history")
    .select("*")
    .eq("user_id", userId)
    .order("searched_at", { ascending: false })
    .limit(50)

  return data || []
}

async function logSearchQuery(userId: string, query: string, filters: any, resultCount: number, supabase: any) {
  await supabase.from("search_history").insert({
    user_id: userId,
    query,
    filters,
    result_count: resultCount,
    searched_at: new Date().toISOString(),
  })
}
