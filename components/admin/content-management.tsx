"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search, MoreHorizontal, Play, Edit, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ContentManagementProps {
  data?: Array<{
    id: string
    title: string
    type: string
    views: number
    rating: number
    created_at: string
  }>
  isLoading: boolean
}

export function ContentManagement({ data, isLoading }: ContentManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const content = data || [
    {
      id: "1",
      title: "The Matrix",
      type: "movie",
      views: 15000,
      rating: 8.7,
      created_at: "2024-01-15",
    },
    {
      id: "2",
      title: "Stranger Things",
      type: "tv_show",
      views: 25000,
      rating: 8.7,
      created_at: "2024-01-10",
    },
    {
      id: "3",
      title: "Inception",
      type: "movie",
      views: 12000,
      rating: 8.8,
      created_at: "2024-01-20",
    },
  ]

  const filteredContent = content.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "movie":
        return <Badge className="bg-blue-600 text-white">Movie</Badge>
      case "tv_show":
        return <Badge className="bg-green-600 text-white">TV Show</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Content Management</CardTitle>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button className="bg-red-600 hover:bg-red-700">Add Content</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300">Title</th>
                <th className="text-left py-3 px-4 text-gray-300">Type</th>
                <th className="text-left py-3 px-4 text-gray-300">Views</th>
                <th className="text-left py-3 px-4 text-gray-300">Rating</th>
                <th className="text-left py-3 px-4 text-gray-300">Created</th>
                <th className="text-left py-3 px-4 text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item) => (
                <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
                        <Play className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{item.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getTypeBadge(item.type)}</td>
                  <td className="py-3 px-4 text-gray-300">{item.views.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-300">⭐ {item.rating}</td>
                  <td className="py-3 px-4 text-gray-300">{item.created_at}</td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Content
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Content
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
