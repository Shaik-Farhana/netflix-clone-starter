"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { SearchFilters } from "@/components/search/search-filters"
import { SearchResults } from "@/components/search/search-results"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    sortBy: "relevance",
  })
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsLoading(true)
      // Simulate search
      setTimeout(() => {
        setSearchResults([
          {
            id: "1",
            title: "The Matrix",
            type: "movie" as const,
            poster_path: "/placeholder.svg?height=600&width=400",
            overview: "A computer programmer discovers reality is a simulation",
            rating: 8.7,
            year: 1999,
            genre: ["Action", "Sci-Fi"],
          },
          {
            id: "2",
            title: "Inception",
            type: "movie" as const,
            poster_path: "/placeholder.svg?height=600&width=400",
            overview: "A thief steals corporate secrets through dream-sharing technology",
            rating: 8.8,
            year: 2010,
            genre: ["Action", "Sci-Fi", "Thriller"],
          },
        ])
        setIsLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Search Movies & TV Shows</h1>

          <form onSubmit={handleSearch} className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for movies, TV shows, actors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Search
            </Button>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <SearchFilters filters={filters} onFiltersChange={setFilters} />
            </div>
            <div className="lg:col-span-3">
              <SearchResults results={searchResults} isLoading={isLoading} query={query} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
