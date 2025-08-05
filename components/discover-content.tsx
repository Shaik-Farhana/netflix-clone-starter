"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { MovieCard } from "@/components/movie-card"

interface Movie {
  id: string
  title: string
  overview: string | null
  release_year: number | null
  poster_url: string | null
  type: string
  genre_ids: number[]
  language_ids: number[]
  avg_rating?: number | null
}

interface Genre {
  id: string
  name: string
}

interface Language {
  id: string
  name: string
}

export function DiscoverContent({
  genres,
  languages,
}: { genres: Genre[]; languages: Language[] }) {
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [genreFilter, setGenreFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    supabase.rpc("get_movies_with_avg_ratings", {
      q: searchQuery || null,
      genre: genreFilter !== "all" ? genreFilter : null,
      language: languageFilter !== "all" ? languageFilter : null,
    }).then(({ data, error }) => {
      if (!active) return
      let filtered = Array.isArray(data) ? data : []
      if (typeFilter !== "all")
        filtered = filtered.filter(m => m.type === typeFilter)
      setMovies(filtered)
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" })
      }
      setLoading(false)
    })
    return () => { active = false }
  }, [searchQuery, genreFilter, languageFilter, typeFilter])

  function getGenreObjects(ids: number[]) {
    return Array.isArray(ids) ? genres.filter((g) => ids.includes(Number(g.id))) : []
  }
  function getLanguageObjects(ids: number[]) {
    return Array.isArray(ids) ? languages.filter((l) => ids.includes(Number(l.id))) : []
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setGenreFilter("all")
    setLanguageFilter("all")
    setTypeFilter("all")
  }

  return (
    <div className="container mx-auto p-4">
      {/* FILTER FORM: only here, just one! */}
      <form
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        onSubmit={e => e.preventDefault()}
      >
        <div>
          <Input
            id="query"
            name="query"
            placeholder="Search by title…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id.toString()}>{genre.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id.toString()}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Movie">Movie</SelectItem>
              <SelectItem value="TV Show">TV Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(searchQuery || genreFilter !== "all" || languageFilter !== "all" || typeFilter !== "all") && (
          <Button variant="outline" onClick={handleClearFilters} className="flex-shrink-0 bg-transparent sm:col-span-4">
            <XCircle className="h-4 w-4 mr-2" /> Clear Filters
          </Button>
        )}
      </form>
      {/* MOVIES */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] w-full rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <p>No content found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={{
                ...movie,
                genres: getGenreObjects(movie.genre_ids ?? []),
                languages: getLanguageObjects(movie.language_ids ?? []),
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
