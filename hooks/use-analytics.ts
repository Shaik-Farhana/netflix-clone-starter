"use client"

import { useState, useCallback } from "react"

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalViews: number
    avgWatchTime: number
    userGrowth: number
    engagementRate: number
  }
  userBehavior: {
    dailyActivity: Array<{ date: string; users: number; sessions: number }>
    deviceTypes: Array<{ name: string; value: number }>
    watchPatterns: Array<{ hour: number; views: number }>
  }
  contentPerformance: {
    topContent: Array<{ title: string; views: number; rating: number }>
    genrePerformance: Array<{ genre: string; views: number; engagement: number }>
  }
  recommendations: {
    accuracy: number
    clickThroughRate: number
    conversionRate: number
    algorithmPerformance: Array<{ algorithm: string; accuracy: number; usage: number }>
  }
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async (timeRange: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Call Python microservice for analytics processing
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timeRange }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analytics error occurred")
      console.error("Analytics error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    fetchAnalytics,
  }
}
