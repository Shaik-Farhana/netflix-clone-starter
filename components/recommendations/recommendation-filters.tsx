"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RecommendationFiltersProps {
  filters: {
    genre: string
    mood: string
    duration: string
  }
  onFiltersChange: (filters: any) => void
}

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Documentary",
]

const moods = ["Relaxing", "Exciting", "Thought-provoking", "Feel-good", "Suspenseful", "Romantic"]

export function RecommendationFilters({ filters, onFiltersChange }: RecommendationFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Customize Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Genre Preference */}
        <div className="space-y-2">
          <Label className="text-white">Preferred Genre</Label>
          <Select value={filters.genre} onValueChange={(value) => updateFilter("genre", value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Any Genre" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="any">Any Genre</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre.toLowerCase()}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mood Filter */}
        <div className="space-y-2">
          <Label className="text-white">Mood</Label>
          <Select value={filters.mood} onValueChange={(value) => updateFilter("mood", value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Any Mood" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="any">Any Mood</SelectItem>
              {moods.map((mood) => (
                <SelectItem key={mood} value={mood.toLowerCase()}>
                  {mood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration Preference */}
        <div className="space-y-2">
          <Label className="text-white">Duration Preference</Label>
          <Select value={filters.duration} onValueChange={(value) => updateFilter("duration", value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Any Duration" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="any">Any Duration</SelectItem>
              <SelectItem value="short">Short (&lt; 90 min)</SelectItem>
              <SelectItem value="medium">Medium (90-150 min)</SelectItem>
              <SelectItem value="long">Long (&gt; 150 min)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
