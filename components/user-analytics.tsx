"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Badge } from "@/components/ui/badge"

interface GenreData {
  name: string
  count: number
}

interface RatingData {
  rating: number
  count: number
}

interface UserAnalyticsProps {
  totalWatched?: number | null
  averageRating?: number | null
  genreData?: GenreData[] | null
  ratingData?: RatingData[] | null
  preferredGenreIds?: string[] | null
  genreLookup?: Record<string, string>
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#AF19FF", "#FF1919", "#19FFD1", "#FFD119"
]

// Utility to safely format numbers, with fallback for undefined/null/NaN
function safeNum(val: unknown, digits = 2, fallback: string | number = "N/A") {
  return typeof val === "number" && isFinite(val)
    ? val.toFixed(digits)
    : fallback
}

export function UserAnalytics({
  totalWatched = 0,
  averageRating = 0,
  genreData = [],
  ratingData = [],
  preferredGenreIds = [],
  genreLookup = {},
}: UserAnalyticsProps) {
  // Defensive: always work with array
  const genreList = Array.isArray(genreData) ? genreData : []
  const ratingList = Array.isArray(ratingData) ? ratingData : []
  const prefGenres = Array.isArray(preferredGenreIds) ? preferredGenreIds : []

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Watched</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof totalWatched === "number" && isFinite(totalWatched) ? totalWatched : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Movies & TV Shows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeNum(averageRating, 1)} / 5
            </div>
            <p className="text-xs text-muted-foreground">Based on your reviews</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Genre Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {genreList.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={genreList} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground">
                No genre data available from watched content.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {ratingList.some((data) => typeof data.count === "number" && data.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingList}
                    dataKey="count"
                    nameKey="rating"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {ratingList.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground">
                No rating data available from watched content.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <h2 className="text-2xl font-bold mb-4">Your Preferred Genres</h2>
      <div className="flex flex-wrap gap-2">
        {prefGenres.length > 0 ? (
          prefGenres.map((genreId) => (
            <Badge key={genreId}>
              {genreLookup[genreId] ?? `${genreId.substring(0, 8)}...`}
            </Badge>
          ))
        ) : (
          <p className="text-muted-foreground">
            No preferred genres set. Complete onboarding to set them.
          </p>
        )}
      </div>
    </div>
  )
}
