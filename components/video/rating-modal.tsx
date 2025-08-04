"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rating: number, review?: string) => void
  contentTitle: string
  currentRating?: number
}

export function RatingModal({ isOpen, onClose, onSubmit, contentTitle, currentRating }: RatingModalProps) {
  const [rating, setRating] = useState(currentRating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmit(rating, review.trim() || undefined)
      onClose()
    } catch (error) {
      console.error("Failed to submit rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setRating(currentRating || 0)
    setReview("")
    setHoveredRating(0)
    onClose()
  }

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1:
        return "Terrible"
      case 2:
        return "Poor"
      case 3:
        return "Average"
      case 4:
        return "Good"
      case 5:
        return "Excellent"
      default:
        return "Rate this content"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {currentRating ? "Update Your Rating" : "Rate This Content"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Content Title */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-200">{contentTitle}</h3>
            <p className="text-sm text-gray-400 mt-1">
              {currentRating ? "How would you rate this now?" : "How did you like this content?"}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      hoveredRating >= star || rating >= star ? "text-yellow-500 fill-current" : "text-gray-400",
                    )}
                  />
                </button>
              ))}
            </div>

            <p className="text-sm font-medium text-gray-300">{getRatingText(hoveredRating || rating)}</p>
          </div>

          {/* Review Text Area */}
          {rating > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Write a review (optional)</label>
              <Textarea
                placeholder="Share your thoughts about this content..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right">{review.length}/500 characters</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Submitting..." : currentRating ? "Update Rating" : "Submit Rating"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
