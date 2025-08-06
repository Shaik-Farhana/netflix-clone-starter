import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardWatchedMovies } from "@/components/dashboard-watched-movies"
import { UserAnalytics } from "@/components/user-analytics"
import { Recommendations } from "@/components/recommendations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  // Get user authentication state
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/") // Redirect to login if not authenticated
  }

  // Check onboarding completion
  const { data: userProfile, error: profileError } = await supabase
    .from("user_profiles")
    .select("onboarding_complete")
    .eq("user_id", user.id)
    .single()

  if (profileError || !userProfile?.onboarding_complete) {
    redirect("/onboarding") // Redirect to onboarding if not complete
  }

  // Main dashboard layout
  return (
    <div className="flex flex-1 flex-col p-4 md:p-8">
      <h1 className="mb-6 text-3xl font-bold text-primary">
        Your Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Watched Movies */}
        <Card className="md:col-span-2 lg:col-span-2 bg-card text-card-foreground border-netflix-dark-light">
          <CardHeader>
            <CardTitle className="text-xl text-primary">
              Recently Watched & Rated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading watched movies...</div>}>
              <DashboardWatchedMovies userId={user.id} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card className="bg-card text-card-foreground border-netflix-dark-light">
          <CardHeader>
            <CardTitle className="text-xl text-primary">
              Your Viewing Habits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading analytics...</div>}>
              <UserAnalytics userId={user.id} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="md:col-span-3 bg-card text-card-foreground border-netflix-dark-light">
          <CardHeader>
            <CardTitle className="text-xl text-primary">
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading recommendations...</div>}>
              <Recommendations userId={user.id} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
