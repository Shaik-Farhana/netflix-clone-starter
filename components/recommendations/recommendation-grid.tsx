"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Play, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Movie {
  id: string
  title: string
  poster_path: string
  overview: string
  rating: number
  genre: string[]
}

interface RecommendationGridProps {
  recommendations: Movie[]
  isLoading: boolean
  title: string
}

export function RecommendationGrid({ recommendations, isLoading, title }: RecommendationGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-800 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800 animate-pulse">
              <div className="aspect-[2/3] bg-gray-800 rounded-t-lg" />
              <CardContent className="p-3">
                <div className="h-4 bg-gray-800 rounded mb-2" />
                <div className="h-3 bg-gray-800 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No recommendations available</p>
        <p className="text-gray-500 mt-2">Try adjusting your preferences or watch more content</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {recommendations.map((movie) => (
          <Card key={movie.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all group">
            <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
              <img
                src={
                  movie.poster_path ||
                  `/placeholder.svg?height=600&width=400&query=${encodeURIComponent(movie.title)}+poster`
                }
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex gap-2">
                  <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-gray-600/70 hover:bg-gray-600/90">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-3">
              <h3 className="font-semibold text-white text-sm line-clamp-1 mb-1">{movie.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-300 ml-1">{movie.rating}</span>
                </div>
                <div className="flex gap-1">
                  {movie.genre.slice(0, 1).map((g) => (
                    <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300 px-1 py-0">
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
