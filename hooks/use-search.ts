"use client"

import { useState, useCallback } from "react"

interface SearchResult {
  id: string
  title: string
  type: "movie" | "tv"
  poster_path: string
  overview: string
  rating: number
  year: number
  genre: string[]
}

export function useSearchMovies() {
  const [data, setData] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string, filters: any) => {
    setIsLoading(true)
    setError(null)

    try {
      // Call Python microservice for search with ML ranking
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, filters }),
      })

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const results = await response.json()
      setData(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search error occurred")
      console.error("Search error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    search,
  }
}
