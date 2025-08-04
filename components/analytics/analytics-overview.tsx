"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Play, TrendingUp, Clock } from "lucide-react"

interface AnalyticsOverviewProps {
  data?: {
    totalUsers: number
    activeUsers: number
    totalViews: number
    avgWatchTime: number
    userGrowth: number
    engagementRate: number
  }
  isLoading: boolean
}

export function AnalyticsOverview({ data, isLoading }: AnalyticsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-gray-900 border-gray-800 animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-800 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: "Total Users",
      value: data?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      change: `+${data?.userGrowth || 0}%`,
      changeType: "positive" as const,
    },
    {
      title: "Active Users",
      value: data?.activeUsers?.toLocaleString() || "0",
      icon: TrendingUp,
      change: `+${data?.engagementRate || 0}%`,
      changeType: "positive" as const,
    },
    {
      title: "Total Views",
      value: data?.totalViews?.toLocaleString() || "0",
      icon: Play,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Avg Watch Time",
      value: `${data?.avgWatchTime || 0}m`,
      icon: Clock,
      change: "+8.2%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className="text-xs text-green-500 mt-1">{stat.change} from last period</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
