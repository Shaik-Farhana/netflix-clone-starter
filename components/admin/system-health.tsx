"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Server, Database, Zap, Globe } from "lucide-react"

interface SystemHealthProps {
  data?: {
    serverStatus: string
    databaseStatus: string
    apiStatus: string
    pythonServiceStatus: string
  }
  isLoading: boolean
}

export function SystemHealth({ data, isLoading }: SystemHealthProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

  const services = [
    {
      name: "Web Server",
      status: data?.serverStatus || "healthy",
      icon: Server,
      description: "Next.js Application Server",
    },
    {
      name: "Database",
      status: data?.databaseStatus || "healthy",
      icon: Database,
      description: "Supabase PostgreSQL Database",
    },
    {
      name: "API Gateway",
      status: data?.apiStatus || "healthy",
      icon: Globe,
      description: "REST API Endpoints",
    },
    {
      name: "Python Services",
      status: data?.pythonServiceStatus || "warning",
      icon: Zap,
      description: "ML/AI Microservices",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Healthy
          </Badge>
        )
      case "warning":
        return (
          <Badge className="bg-yellow-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Warning
          </Badge>
        )
      case "error":
        return (
          <Badge className="bg-red-600 text-white">
            <XCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.name} className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{service.name}</CardTitle>
              <service.icon className={`h-4 w-4 ${getStatusColor(service.status)}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-white mb-1">{getStatusBadge(service.status)}</div>
                  <p className="text-xs text-gray-400">{service.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Metrics */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">System Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">45ms</div>
              <div className="text-sm text-gray-400">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0.01%</div>
              <div className="text-sm text-gray-400">Error Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent System Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <div className="text-white text-sm">Database backup completed successfully</div>
                <div className="text-gray-400 text-xs">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div className="flex-1">
                <div className="text-white text-sm">Python service response time increased</div>
                <div className="text-gray-400 text-xs">4 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <div className="text-white text-sm">System update deployed successfully</div>
                <div className="text-gray-400 text-xs">1 day ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
