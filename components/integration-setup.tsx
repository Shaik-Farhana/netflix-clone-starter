"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Plus, ExternalLink, CheckCircle } from "lucide-react"

export function IntegrationSetup() {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleAddSupabase = () => {
    setIsConnecting(true)
    // This would trigger the Vercel integration flow
    window.open("https://vercel.com/integrations/supabase", "_blank")
    setTimeout(() => setIsConnecting(false), 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Database className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Connect to Supabase</CardTitle>
          <CardDescription className="text-gray-400">
            Your Netflix Clone needs a database to store content, user data, and analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Integration Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">What you'll get:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">User Authentication</p>
                  <p className="text-gray-400 text-sm">Sign up, login, and user management</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Content Database</p>
                  <p className="text-gray-400 text-sm">Movies, TV shows, and metadata</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Real-time Analytics</p>
                  <p className="text-gray-400 text-sm">User behavior and content metrics</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Admin Dashboard</p>
                  <p className="text-gray-400 text-sm">Content and user management</p>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Steps */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Quick Setup (2 minutes):</h4>
            <ol className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  1
                </span>
                <span>Click "Add Supabase Integration" below</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Create or connect your Supabase project</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  3
                </span>
                <span>Environment variables will be automatically configured</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  4
                </span>
                <span>Database will be set up with sample content</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleAddSupabase}
              disabled={isConnecting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isConnecting ? (
                <>
                  <Database className="w-4 h-4 mr-2 animate-pulse" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Supabase Integration
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              onClick={() => window.open("https://supabase.com/docs", "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          </div>

          {/* Manual Setup Option */}
          <div className="border-t border-gray-700 pt-4">
            <details className="text-sm">
              <summary className="text-gray-400 cursor-pointer hover:text-white">
                Manual setup (for advanced users)
              </summary>
              <div className="mt-3 space-y-2 text-gray-400">
                <p>If you prefer to set up manually:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>
                    Create a Supabase project at{" "}
                    <a href="https://supabase.com" className="text-red-400 hover:underline">
                      supabase.com
                    </a>
                  </li>
                  <li>Add these environment variables to your Vercel project:</li>
                </ol>
                <div className="bg-gray-800 rounded p-3 mt-2 font-mono text-xs">
                  <div>NEXT_PUBLIC_SUPABASE_URL=your_project_url</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</div>
                  <div>SUPABASE_SERVICE_ROLE_KEY=your_service_key</div>
                </div>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
