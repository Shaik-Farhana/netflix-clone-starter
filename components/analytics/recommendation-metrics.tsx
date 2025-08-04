"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, Target, MousePointer, Zap } from "lucide-react"

interface RecommendationMetricsProps {
  data?: {
    accuracy: number
    clickThroughRate: number
    conversionRate: number
    algorithmPerformance: Array<{ algorithm: string; accuracy: number; usage: number }>
  }
  isLoading: boolean
}

export function RecommendationMetrics({ data, isLoading }: RecommendationMetricsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800 animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-800 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-gray-900 border-gray-800 animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-gray-800 rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const metrics = [
    {
      title: "Recommendation Accuracy",
      value: `${data?.accuracy || 0}%`,
      icon: Target,
      change: "+2.3%",
      changeType: "positive" as const,
    },
    {
      title: "Click-Through Rate",
      value: `${data?.clickThroughRate || 0}%`,
      icon: MousePointer,
      change: "+1.8%",
      changeType: "positive" as const,
    },
    {
      title: "Conversion Rate",
      value: `${data?.conversionRate || 0}%`,
      icon: TrendingUp,
      change: "+0.9%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <p className="text-xs text-green-500 mt-1">{metric.change} from last period</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Algorithm Performance */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Algorithm Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.algorithmPerformance || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="algorithm" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="accuracy" fill="#ef4444" name="Accuracy %" />
              <Bar dataKey="usage" fill="#3b82f6" name="Usage %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendation Performance Over Time */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recommendation Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[
                { date: "Jan", accuracy: 75.2, ctr: 11.8, conversion: 8.1 },
                { date: "Feb", accuracy: 76.8, ctr: 12.1, conversion: 8.3 },
                { date: "Mar", accuracy: 77.9, ctr: 12.0, conversion: 8.5 },
                { date: "Apr", accuracy: 78.5, ctr: 12.3, conversion: 8.7 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="accuracy" stroke="#ef4444" strokeWidth={2} name="Accuracy %" />
              <Line type="monotone" dataKey="ctr" stroke="#3b82f6" strokeWidth={2} name="CTR %" />
              <Line type="monotone" dataKey="conversion" stroke="#22c55e" strokeWidth={2} name="Conversion %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Algorithm Details */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Algorithm Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(data?.algorithmPerformance || []).map((algorithm, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <div>
                    <h3 className="text-white font-medium">{algorithm.algorithm}</h3>
                    <p className="text-gray-400 text-sm">Machine Learning Algorithm</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{algorithm.accuracy}% Accuracy</div>
                  <div className="text-gray-400 text-sm">{algorithm.usage}% Usage</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
