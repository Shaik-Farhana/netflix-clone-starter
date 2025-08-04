"use client"

import { useState, useEffect } from "react"
import { MovieCard } from "./movie-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Movie {
  id: string
  title: string
  overview: string
  poster_url: string
  backdrop_url: string
  year: number
  genre: string[]
  imdb_rating: number
  type: string
  duration: number
  streaming_platforms: string[]
}

interface UserRating {
  content_id: string
  rating: number
}

export function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [userRatings, setUserRatings] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const { toast } = useToast()

  // Get unique genres from movies
  const genres = Array.from(new Set(movies.flatMap((movie) => movie.genre))).sort()

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        type: selectedType,
        genre: selectedGenre,
        search: searchTerm,
        sort: sortBy,
      })

      const response = await fetch(`/api/movies?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch movies")
      }

      const data = await response.json()
      setMovies(data.movies || [])
    } catch (error) {
      console.error("Error fetching movies:", error)
      toast({
        title: "Error",
        description: "Failed to load movies. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRatings = async () => {
    try {
      // This would fetch user ratings if authenticated
      // For now, we'll skip this to avoid auth issues
    } catch (error) {
      console.error("Error fetching user ratings:", error)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [selectedType, selectedGenre, searchTerm, sortBy])

  useEffect(() => {
    fetchUserRatings()
  }, [])

  const handleRatingSubmit = async (movieId: string, rating: number, review?: string) => {
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          rating,
          review,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit rating")
      }

      // Update local state
      setUserRatings((prev) => ({
        ...prev,
        [movieId]: rating,
      }))

      toast({
        title: "Rating saved!",
        description: `You rated this ${rating} stars`,
      })
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save rating",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-white">Loading movies...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
            />
          </div>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="tv_show">TV Shows</SelectItem>
            </SelectContent>
          </Select>

          {/* Genre Filter */}
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Movies Grid */}
      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No movies found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              userRating={userRatings[movie.id]}
              onRatingSubmit={handleRatingSubmit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
