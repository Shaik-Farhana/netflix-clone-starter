"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search, MoreHorizontal, UserCheck, UserX, Crown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface UserManagementProps {
  data?: Array<{
    id: string
    email: string
    full_name: string
    created_at: string
    last_active: string
    subscription_tier: string
  }>
  isLoading: boolean
}

export function UserManagement({ data, isLoading }: UserManagementProps) {
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

  const users = data || [
    {
      id: "1",
      email: "john.doe@example.com",
      full_name: "John Doe",
      created_at: "2024-01-15",
      last_active: "2024-01-30",
      subscription_tier: "premium",
    },
    {
      id: "2",
      email: "jane.smith@example.com",
      full_name: "Jane Smith",
      created_at: "2024-01-10",
      last_active: "2024-01-29",
      subscription_tier: "basic",
    },
    {
      id: "3",
      email: "mike.johnson@example.com",
      full_name: "Mike Johnson",
      created_at: "2024-01-20",
      last_active: "2024-01-28",
      subscription_tier: "premium",
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "premium":
        return <Badge className="bg-yellow-600 text-white">Premium</Badge>
      case "basic":
        return <Badge variant="secondary">Basic</Badge>
      default:
        return <Badge variant="outline">Free</Badge>
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "premium":
        return <Crown className="w-4 h-4 text-yellow-500" />
      default:
        return <UserCheck className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">User Management</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300">User</th>
                <th className="text-left py-3 px-4 text-gray-300">Subscription</th>
                <th className="text-left py-3 px-4 text-gray-300">Created</th>
                <th className="text-left py-3 px-4 text-gray-300">Last Active</th>
                <th className="text-left py-3 px-4 text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        {getTierIcon(user.subscription_tier)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.full_name}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getTierBadge(user.subscription_tier)}</td>
                  <td className="py-3 px-4 text-gray-300">{user.created_at}</td>
                  <td className="py-3 px-4 text-gray-300">{user.last_active}</td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <UserCheck className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade Subscription
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
                          <UserX className="w-4 h-4 mr-2" />
                          Suspend User
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
