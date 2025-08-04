"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { UserBehaviorCharts } from "@/components/analytics/user-behavior-charts"
import { ContentPerformance } from "@/components/analytics/content-performance"
import { RecommendationMetrics } from "@/components/analytics/recommendation-metrics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAnalytics } from "@/hooks/use-analytics"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const { data: analytics, isLoading, fetchAnalytics } = useAnalytics()

  useEffect(() => {
    fetchAnalytics(timeRange)
  }, [timeRange, fetchAnalytics])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white rounded px-3 py-2"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        <AnalyticsOverview data={analytics?.overview} isLoading={isLoading} />

        <Tabs defaultValue="user-behavior" className="mt-8">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="user-behavior" className="data-[state=active]:bg-red-600">
              User Behavior
            </TabsTrigger>
            <TabsTrigger value="content-performance" className="data-[state=active]:bg-red-600">
              Content Performance
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-red-600">
              Recommendation Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user-behavior" className="mt-8">
            <UserBehaviorCharts data={analytics?.userBehavior} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="content-performance" className="mt-8">
            <ContentPerformance data={analytics?.contentPerformance} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="recommendations" className="mt-8">
            <RecommendationMetrics data={analytics?.recommendations} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
