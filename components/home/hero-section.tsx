"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Info, Volume2, VolumeX } from "lucide-react"

interface HeroContent {
  id: string
  title: string
  description: string
  backdrop_path: string
  video_url?: string
}

export function HeroSection() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading hero content with mock data
    setTimeout(() => {
      setHeroContent({
        id: "1",
        title: "Stranger Things",
        description:
          "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
        backdrop_path: "/placeholder.svg?height=1080&width=1920&text=Stranger+Things+Hero",
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="relative h-screen bg-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 flex items-center h-full">
          <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="max-w-2xl space-y-4">
              <div className="h-12 bg-gray-800 rounded w-3/4" />
              <div className="h-6 bg-gray-800 rounded w-full" />
              <div className="h-6 bg-gray-800 rounded w-5/6" />
              <div className="flex gap-4 mt-8">
                <div className="h-12 bg-gray-800 rounded w-32" />
                <div className="h-12 bg-gray-800 rounded w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroContent?.backdrop_path})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {heroContent?.title || "Featured Content"}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 line-clamp-3">
              {heroContent?.description ||
                "Discover amazing content tailored just for you with our AI-powered recommendation system."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold">
                <Play className="w-5 h-5 mr-2" />
                Play
              </Button>
              <Button size="lg" variant="secondary" className="bg-gray-600/70 text-white hover:bg-gray-600/90">
                <Info className="w-5 h-5 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>

        {/* Volume Control */}
        <div className="absolute bottom-8 right-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-gray-800/50 hover:bg-gray-800/70 text-white border border-gray-600"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
