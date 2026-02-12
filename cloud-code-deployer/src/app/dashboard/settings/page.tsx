"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, CreditCard, Key, Bell } from "lucide-react"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={session.user?.name || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={session.user?.email || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline" disabled>
                  Update Profile
                  <span className="ml-2 text-xs text-gray-500">(Coming Soon)</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage your deployment platform API keys and tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Vercel Token</h4>
                    <p className="text-sm text-gray-500">
                      Required for deploying to Vercel platform
                    </p>
                  </div>
                  <Badge variant="outline">Not Configured</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Netlify Access Token</h4>
                    <p className="text-sm text-gray-500">
                      Required for deploying to Netlify platform
                    </p>
                  </div>
                  <Badge variant="outline">Not Configured</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">GitHub Token</h4>
                    <p className="text-sm text-gray-500">
                      For accessing private repositories
                    </p>
                  </div>
                  <Badge variant="outline">Not Configured</Badge>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline" disabled>
                  Configure API Keys
                  <span className="ml-2 text-xs text-gray-500">(Coming Soon)</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Billing & Usage
              </CardTitle>
              <CardDescription>
                Manage your subscription and view usage statistics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">Free</div>
                  <div className="text-sm text-gray-500">Current Plan</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0/10</div>
                  <div className="text-sm text-gray-500">Deployments This Month</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">∞</div>
                  <div className="text-sm text-gray-500">Storage Limit</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Plan Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Up to 10 deployments per month
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    GitHub and ZIP file uploads
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Vercel and Netlify integration
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                    Priority support (Pro only)
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Button variant="outline" disabled>
                  Upgrade to Pro
                  <span className="ml-2 text-xs text-gray-500">(Coming Soon)</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you want to be notified about deployments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-500">
                      Get notified when deployments complete
                    </p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Deployment Failures</h4>
                    <p className="text-sm text-gray-500">
                      Immediate notifications for failed deployments
                    </p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Summary</h4>
                    <p className="text-sm text-gray-500">
                      Weekly deployment activity summary
                    </p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline" disabled>
                  Update Preferences
                  <span className="ml-2 text-xs text-gray-500">(Coming Soon)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}