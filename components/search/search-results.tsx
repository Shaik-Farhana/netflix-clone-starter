"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  query: string
}

export function SearchResults({ results, isLoading, query }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-gray-900 border-gray-800 animate-pulse">
            <div className="aspect-[2/3] bg-gray-800 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-800 rounded mb-2" />
              <div className="h-3 bg-gray-800 rounded mb-2" />
              <div className="h-3 bg-gray-800 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Enter a search term to find movies and TV shows</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No results found for "{query}"</p>
        <p className="text-gray-500 mt-2">Try adjusting your search terms or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          Search Results for "{query}" ({results.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item) => (
          <Card key={item.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors group">
            <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
              <img
                src={item.poster_path || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white line-clamp-1">{item.title}</h3>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {item.type === "movie" ? "Movie" : "TV"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-300 ml-1">{item.rating}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-400">{item.year}</span>
              </div>

              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{item.overview}</p>

              <div className="flex flex-wrap gap-1">
                {item.genre.slice(0, 2).map((g) => (
                  <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {g}
                  </Badge>
                ))}
                {item.genre.length > 2 && (
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                    +{item.genre.length - 2}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
