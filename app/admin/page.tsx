"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { AdminStats } from "@/components/admin/admin-stats"
import { UserManagement } from "@/components/admin/user-management"
import { ContentManagement } from "@/components/admin/content-management"
import { SystemHealth } from "@/components/admin/system-health"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminData } from "@/hooks/use-admin-data"
import { Shield } from "lucide-react"

export default function AdminPage() {
  const { data: adminData, isLoading, fetchAdminData } = useAdminData()

  useEffect(() => {
    fetchAdminData()
  }, [fetchAdminData])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <AdminStats data={adminData?.stats} isLoading={isLoading} />

        <Tabs defaultValue="users" className="mt-8">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-red-600">
              User Management
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-red-600">
              Content Management
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-red-600">
              System Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-8">
            <UserManagement data={adminData?.users} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="content" className="mt-8">
            <ContentManagement data={adminData?.content} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="system" className="mt-8">
            <SystemHealth data={adminData?.system} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
