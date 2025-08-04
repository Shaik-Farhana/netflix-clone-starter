"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { RatingModal } from "./rating-modal"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  contentId: string
  title: string
  videoUrl?: string
  onRatingSubmit?: (rating: number, review?: string) => void
  currentUserRating?: number
}

export function VideoPlayer({ contentId, title, videoUrl, onRatingSubmit, currentUserRating }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [hasWatched, setHasWatched] = useState(false)

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const resetTimeout = () => {
      clearTimeout(timeout)
      setShowControls(true)
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    const handleMouseMove = () => resetTimeout()

    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", handleMouseMove)
    }

    resetTimeout()

    return () => {
      clearTimeout(timeout)
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [isPlaying])

  // Check if user has watched significant portion (80%) to show rating prompt
  useEffect(() => {
    if (duration > 0 && currentTime > 0) {
      const watchedPercentage = (currentTime / duration) * 100
      if (watchedPercentage >= 80 && !hasWatched && !currentUserRating) {
        setHasWatched(true)
        setShowRatingModal(true)
      }
    }
  }, [currentTime, duration, hasWatched, currentUserRating])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleRatingSubmit = (rating: number, review?: string) => {
    onRatingSubmit?.(rating, review)
    setShowRatingModal(false)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(true)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        poster="/placeholder.svg?height=720&width=1280&text=Video+Poster"
      >
        {videoUrl && <source src={videoUrl} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-xl font-semibold">{title}</h1>
            <div className="flex items-center gap-2">
              {/* Rating Display */}
              {currentUserRating && (
                <div className="flex items-center gap-1 bg-black/50 rounded-full px-3 py-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-white text-sm">{currentUserRating}</span>
                </div>
              )}

              {/* Quick Rating Buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setShowRatingModal(true)}
              >
                <Star className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ThumbsUp className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ThumbsDown className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 text-white"
              onClick={togglePlay}
            >
              <Play className="w-8 h-8 ml-1" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-white text-sm mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => skip(-10)}>
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => skip(10)}>
                <SkipForward className="w-5 h-5" />
              </Button>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <div className="w-20">
                  <Slider value={[isMuted ? 0 : volume]} max={1} step={0.1} onValueChange={handleVolumeChange} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setShowRatingModal(true)}
              >
                <Star className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        contentTitle={title}
        currentRating={currentUserRating}
      />
    </div>
  )
}
