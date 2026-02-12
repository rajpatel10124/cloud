"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push("/login")
      return
    }

    // Redirect to upload page as default
    router.push("/dashboard/upload")
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="text-center">
        <p>Redirecting to upload...</p>
      </div>
    </DashboardLayout>
  )
}