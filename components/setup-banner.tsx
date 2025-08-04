"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Database, Loader2, ExternalLink, Info } from "lucide-react"

interface SetupStatus {
  isSetup: boolean
  message: string
  needsIntegration?: boolean
  needsSchema?: boolean
  connectionError?: boolean
  hasContent?: boolean
  error?: boolean
}

export function SetupBanner() {
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/setup/check")
      if (response.ok) {
        const data = await response.json()
        setSetupStatus(data)
      } else {
        setSetupStatus({
          isSetup: false,
          message: "Unable to check setup status",
          error: true,
        })
      }
    } catch (error) {
      console.error("Setup check failed:", error)
      setSetupStatus({
        isSetup: false,
        message: "Setup check failed",
        error: true,
      })
    } finally {
      setIsChecking(false)
    }
  }

  const runSetup = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/setup/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      let data
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        // Handle non-JSON response
        const text = await response.text()
        console.error("Non-JSON response:", text)
        data = {
          success: false,
          message: "Server returned an invalid response. Please check your Supabase configuration.",
        }
      }

      if (response.ok && data.success) {
        setSetupStatus({
          isSetup: true,
          message: data.message,
          hasContent: true,
        })
        // Refresh the page to show updated content
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setSetupStatus({
          isSetup: false,
          message: data.message || "Setup failed",
          error: true,
        })
      }
    } catch (error) {
      console.error("Setup failed:", error)
      setSetupStatus({
        isSetup: false,
        message: "Setup failed due to a network error. Please try again.",
        error: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openSupabaseIntegration = () => {
    window.open("https://vercel.com/integrations/supabase", "_blank")
  }

  const openSupabaseDocs = () => {
    window.open("https://supabase.com/docs/guides/getting-started/quickstarts/nextjs", "_blank")
  }

  if (isChecking) {
    return (
      <div className="bg-blue-600 text-white p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Checking database setup...</span>
        </div>
      </div>
    )
  }

  if (!setupStatus) {
    return null
  }

  if (setupStatus.isSetup && setupStatus.hasContent) {
    return (
      <div className="bg-green-600 text-white p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>✅ Database setup complete! Your Netflix Clone is ready with sample content.</span>
        </div>
      </div>
    )
  }

  if (setupStatus.needsIntegration) {
    return (
      <Card className="m-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Database className="w-6 h-6 text-yellow-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                🔌 Supabase Integration Required
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                Connect your Supabase database to enable full functionality including user authentication, content
                management, and analytics.
              </p>
              <div className="flex gap-2">
                <Button onClick={openSupabaseIntegration} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Add Supabase Integration
                </Button>
                <Button
                  onClick={openSupabaseDocs}
                  variant="outline"
                  className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Setup Guide
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (setupStatus.needsSchema) {
    return (
      <Card className="m-4 border-red-500 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">📋 Database Schema Required</h3>
              <p className="text-red-700 dark:text-red-300 mb-4">
                Your Supabase project is connected, but the required database tables are missing. Please run the SQL
                scripts to create the schema.
              </p>
              <div className="bg-gray-800 rounded p-3 mb-4 font-mono text-xs text-white">
                <div>1. Go to your Supabase dashboard</div>
                <div>2. Navigate to SQL Editor</div>
                <div>3. Run the scripts from scripts/01-create-tables.sql</div>
                <div>4. Then run scripts/02-seed-sample-data.sql</div>
              </div>
              <div className="flex gap-2">
                <Button onClick={openSupabaseDocs} className="bg-red-600 hover:bg-red-700 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Supabase Dashboard
                </Button>
                <Button
                  onClick={checkSetupStatus}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  Check Again
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (setupStatus.error || setupStatus.connectionError) {
    return (
      <Card className="m-4 border-red-500 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">⚠️ Setup Issue</h3>
              <p className="text-red-700 dark:text-red-300 mb-4">{setupStatus.message}</p>
              <div className="flex gap-2">
                <Button
                  onClick={checkSetupStatus}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  Try Again
                </Button>
                <Button onClick={openSupabaseIntegration} className="bg-red-600 hover:bg-red-700 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Check Integration
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default case - needs setup
  return (
    <Card className="m-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Database className="w-6 h-6 text-yellow-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🚀 Database Setup Required</h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              Your Supabase integration is connected, but the database needs to be set up with sample content to enable
              full functionality.
            </p>
            <div className="space-y-2 text-sm text-yellow-600 dark:text-yellow-400 mb-4">
              <p>• 5 movies and TV shows will be added</p>
              <p>• User authentication tables will be configured</p>
              <p>• Analytics and recommendation tracking will be enabled</p>
              <p>• Admin dashboard will become functional</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={runSetup} disabled={isLoading} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up database...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Setup Database Now
                  </>
                )}
              </Button>
              <Button
                onClick={openSupabaseIntegration}
                variant="outline"
                className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 bg-transparent"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Integration
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
