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

    const { timeRange } = await request.json()

    // Call Python analytics microservice
    const response = await fetch(`${PYTHON_API_BASE}/analytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PYTHON_API_KEY}`,
      },
      body: JSON.stringify({
        time_range: timeRange,
        user_id: user.id,
        include_user_specific: true,
      }),
    })

    if (!response.ok) {
      throw new Error("Analytics service error")
    }

    const analytics = await response.json()

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
