"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { RecommendationGrid } from "@/components/recommendations/recommendation-grid"
import { RecommendationFilters } from "@/components/recommendations/recommendation-filters"
import { useRecommendations } from "@/hooks/use-recommendations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState("for-you")
  const [filters, setFilters] = useState({
    genre: "",
    mood: "",
    duration: "",
  })

  const { data: recommendations, isLoading, fetchRecommendations } = useRecommendations()

  useEffect(() => {
    fetchRecommendations(activeTab, filters)
  }, [activeTab, filters, fetchRecommendations])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Recommendations</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="for-you" className="data-[state=active]:bg-red-600">
              For You
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-red-600">
              Trending
            </TabsTrigger>
            <TabsTrigger value="similar" className="data-[state=active]:bg-red-600">
              Similar to Watched
            </TabsTrigger>
            <TabsTrigger value="new-releases" className="data-[state=active]:bg-red-600">
              New Releases
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
            <div className="lg:col-span-1">
              <RecommendationFilters filters={filters} onFiltersChange={setFilters} />
            </div>
            <div className="lg:col-span-3">
              <TabsContent value="for-you">
                <RecommendationGrid
                  recommendations={recommendations?.forYou || []}
                  isLoading={isLoading}
                  title="Personalized for You"
                />
              </TabsContent>
              <TabsContent value="trending">
                <RecommendationGrid
                  recommendations={recommendations?.trending || []}
                  isLoading={isLoading}
                  title="Trending Now"
                />
              </TabsContent>
              <TabsContent value="similar">
                <RecommendationGrid
                  recommendations={recommendations?.similar || []}
                  isLoading={isLoading}
                  title="Because You Watched"
                />
              </TabsContent>
              <TabsContent value="new-releases">
                <RecommendationGrid
                  recommendations={recommendations?.newReleases || []}
                  isLoading={isLoading}
                  title="New Releases"
                />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
