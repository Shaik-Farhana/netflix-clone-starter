"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-64"
      />
      <Button type="submit" size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-black">
        <Search className="w-4 h-4" />
      </Button>
    </form>
  )
}
