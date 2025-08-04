"use client"

import { useState, useCallback } from "react"

interface Movie {
  id: string
  title: string
  poster_path: string
  overview: string
  rating: number
  genre: string[]
}

interface RecommendationData {
  forYou: Movie[]
  trending: Movie[]
  similar: Movie[]
  newReleases: Movie[]
}

export function useRecommendations() {
  const [data, setData] = useState<RecommendationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = useCallback(async (type: string, filters: any) => {
    setIsLoading(true)
    setError(null)

    try {
      // Call Python microservice for recommendations
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, filters }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching recommendations:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    fetchRecommendations,
  }
}
