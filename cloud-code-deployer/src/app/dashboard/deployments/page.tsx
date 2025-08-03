"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, RefreshCw, Calendar, Globe } from "lucide-react"
import { Deployment } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

export default function DeploymentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchDeployments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/deployments')
      
      if (!response.ok) {
        throw new Error('Failed to fetch deployments')
      }

      const data = await response.json()
      setDeployments(data.deployments)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status !== "loading" && session) {
      fetchDeployments()
    }
  }, [session, status])

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  const getStatusBadge = (status: Deployment['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Success</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
      case 'pending':
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPlatformBadge = (platform: Deployment['platform']) => {
    const colors = {
      vercel: "bg-black text-white hover:bg-black",
      netlify: "bg-teal-600 text-white hover:bg-teal-600"
    }
    
    return (
      <Badge variant="secondary" className={colors[platform]}>
        {platform.charAt(0).toUpperCase() + platform.slice(1)}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading deployments...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deployments</h1>
            <p className="text-gray-600 mt-2">
              Track the status of your deployments and access your live sites.
            </p>
          </div>
          <Button onClick={fetchDeployments} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {deployments.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Globe className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No deployments yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Start by uploading your first project to see your deployments here.
                </p>
                <Button
                  onClick={() => router.push('/dashboard/upload')}
                  className="mt-4"
                >
                  Deploy Your First Project
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <Card key={deployment.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{deployment.project_name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {getPlatformBadge(deployment.platform)}
                      {getStatusBadge(deployment.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDistanceToNow(new Date(deployment.created_at), { addSuffix: true })}
                      </div>
                      {deployment.preview_url && (
                        <div className="flex items-center">
                          <Globe className="mr-1 h-4 w-4" />
                          <a
                            href={deployment.preview_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Live Site
                          </a>
                        </div>
                      )}
                    </div>
                    {deployment.preview_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={deployment.preview_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open
                        </a>
                      </Button>
                    )}
                  </div>
                  {deployment.error_message && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{deployment.error_message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}