"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface StreamingPlatformsProps {
  platforms: string[]
  movieTitle: string
}

const platformUrls: Record<string, string> = {
  Netflix: "https://www.netflix.com/search?q=",
  "Amazon Prime": "https://www.amazon.com/s?k=",
  Hulu: "https://www.hulu.com/search?q=",
  "Disney+": "https://www.disneyplus.com/search?q=",
  "HBO Max": "https://www.hbomax.com/search?q=",
  "Apple TV+": "https://tv.apple.com/search?term=",
  Paramount: "https://www.paramountplus.com/search/?query=",
  Peacock: "https://www.peacocktv.com/search?q=",
}

export function StreamingPlatforms({ platforms, movieTitle }: StreamingPlatformsProps) {
  if (!platforms || platforms.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">Where to watch:</p>
        <p className="text-xs text-gray-500">No streaming platforms available</p>
      </div>
    )
  }

  const handlePlatformClick = (platform: string) => {
    const baseUrl = platformUrls[platform]
    if (baseUrl) {
      const searchUrl = `${baseUrl}${encodeURIComponent(movieTitle)}`
      window.open(searchUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-400 mb-2">Where to watch:</p>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Button
            key={platform}
            onClick={() => handlePlatformClick(platform)}
            variant="outline"
            size="sm"
            className="text-xs bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500"
          >
            {platform}
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        ))}
      </div>
    </div>
  )
}
