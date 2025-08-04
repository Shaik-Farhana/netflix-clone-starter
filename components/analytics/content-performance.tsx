"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface ContentPerformanceProps {
  data?: {
    topContent: Array<{ title: string; views: number; rating: number }>
    genrePerformance: Array<{ genre: string; views: number; engagement: number }>
  }
  isLoading: boolean
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"]

export function ContentPerformance({ data, isLoading }: ContentPerformanceProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="bg-gray-900 border-gray-800 animate-pulse">
            <CardContent className="p-6">
              <div className="h-64 bg-gray-800 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content Performance */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.topContent || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="title" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="views" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Genre Performance */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Genre Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.genrePerformance || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ genre, views }) => `${genre}: ${views.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="views"
                >
                  {(data?.genrePerformance || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Content Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Content Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Title</th>
                  <th className="text-left py-3 px-4 text-gray-300">Views</th>
                  <th className="text-left py-3 px-4 text-gray-300">Rating</th>
                  <th className="text-left py-3 px-4 text-gray-300">Performance</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topContent || []).map((content, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-white font-medium">{content.title}</td>
                    <td className="py-3 px-4 text-gray-300">{content.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-300">⭐ {content.rating}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${Math.min((content.views / 25000) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{Math.round((content.views / 25000) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
