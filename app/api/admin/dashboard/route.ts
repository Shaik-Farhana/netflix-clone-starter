import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you'd check if user has admin privileges
    // For demo purposes, we'll return mock data

    const adminData = {
      stats: {
        totalUsers: 12543,
        activeUsers: 8921,
        totalContent: 1247,
        systemHealth: 98,
        errorRate: 0.01,
        uptime: 99.9,
      },
      users: [
        {
          id: "1",
          email: "john.doe@example.com",
          full_name: "John Doe",
          created_at: "2024-01-15",
          last_active: "2024-01-30",
          subscription_tier: "premium",
        },
        {
          id: "2",
          email: "jane.smith@example.com",
          full_name: "Jane Smith",
          created_at: "2024-01-10",
          last_active: "2024-01-29",
          subscription_tier: "basic",
        },
        {
          id: "3",
          email: "mike.johnson@example.com",
          full_name: "Mike Johnson",
          created_at: "2024-01-20",
          last_active: "2024-01-28",
          subscription_tier: "premium",
        },
        {
          id: "4",
          email: "sarah.wilson@example.com",
          full_name: "Sarah Wilson",
          created_at: "2024-01-12",
          last_active: "2024-01-31",
          subscription_tier: "basic",
        },
        {
          id: "5",
          email: "alex.brown@example.com",
          full_name: "Alex Brown",
          created_at: "2024-01-18",
          last_active: "2024-01-30",
          subscription_tier: "premium",
        },
      ],
      content: [
        {
          id: "1",
          title: "The Matrix",
          type: "movie",
          views: 15000,
          rating: 8.7,
          created_at: "2024-01-15",
        },
        {
          id: "2",
          title: "Stranger Things",
          type: "tv_show",
          views: 25000,
          rating: 8.7,
          created_at: "2024-01-10",
        },
        {
          id: "3",
          title: "Inception",
          type: "movie",
          views: 12000,
          rating: 8.8,
          created_at: "2024-01-20",
        },
        {
          id: "4",
          title: "Breaking Bad",
          type: "tv_show",
          views: 32000,
          rating: 9.5,
          created_at: "2024-01-08",
        },
        {
          id: "5",
          title: "The Dark Knight",
          type: "movie",
          views: 18000,
          rating: 9.0,
          created_at: "2024-01-22",
        },
      ],
      system: {
        serverStatus: "healthy",
        databaseStatus: "healthy",
        apiStatus: "healthy",
        pythonServiceStatus: "warning",
      },
    }

    return NextResponse.json(adminData)
  } catch (error) {
    console.error("Admin dashboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 })
  }
}
