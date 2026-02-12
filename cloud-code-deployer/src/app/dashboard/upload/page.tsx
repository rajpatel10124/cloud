"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Github, Trash2, FileArchive } from "lucide-react"

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [githubUrl, setGithubUrl] = useState("")
  const [projectName, setProjectName] = useState("")
  const [platform, setPlatform] = useState<"vercel" | "netlify">("vercel")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [error, setError] = useState("")

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0])
        setGithubUrl("") // Clear GitHub URL if file is uploaded
      }
    },
  })

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

  const handleGithubUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGithubUrl(e.target.value)
    if (e.target.value) {
      setUploadedFile(null) // Clear uploaded file if GitHub URL is provided
    }
  }

  const handleDeploy = async () => {
    if (!projectName.trim()) {
      setError("Please enter a project name")
      return
    }

    if (!uploadedFile && !githubUrl.trim()) {
      setError("Please upload a file or provide a GitHub repository URL")
      return
    }

    setIsDeploying(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append('projectName', projectName)
      formData.append('platform', platform)
      
      if (uploadedFile) {
        formData.append('file', uploadedFile)
      } else {
        formData.append('githubUrl', githubUrl)
      }

      const response = await fetch('/api/deploy', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to deploy')
      }

      // Redirect to deployments page to see the progress
      router.push('/dashboard/deployments')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsDeploying(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Deploy Your Project</h1>
          <p className="text-gray-600 mt-2">
            Upload a ZIP file or provide a GitHub repository URL to deploy your project.
          </p>
        </div>

        <div className="space-y-6">
          {/* Project Name */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Give your project a name for easy identification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="my-awesome-project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Source Code</CardTitle>
              <CardDescription>
                Choose between uploading a ZIP file or providing a GitHub repository URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload Area */}
              <div>
                <Label>Upload ZIP File</Label>
                <div
                  {...getRootProps()}
                  className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-gray-400"
                  } ${uploadedFile ? "bg-green-50 border-green-300" : ""}`}
                >
                  <input {...getInputProps()} />
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <FileArchive className="mx-auto h-8 w-8 text-green-600" />
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm font-medium text-green-700">
                          {uploadedFile.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile()
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-green-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          {isDragActive
                            ? "Drop the ZIP file here"
                            : "Drag and drop a ZIP file here, or click to select"}
                        </p>
                        <p className="text-xs text-gray-500">ZIP files only, up to 50MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* GitHub URL */}
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub Repository URL</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="githubUrl"
                    placeholder="https://github.com/username/repository"
                    value={githubUrl}
                    onChange={handleGithubUrlChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Deployment Platform</CardTitle>
              <CardDescription>
                Choose where you want to deploy your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <button
                  onClick={() => setPlatform("vercel")}
                  className={`flex-1 p-4 border rounded-lg text-left transition-colors ${
                    platform === "vercel"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">Vercel</div>
                  <div className="text-sm text-gray-500">
                    Optimized for Next.js, React, and static sites
                  </div>
                  {platform === "vercel" && (
                    <Badge className="mt-2">Selected</Badge>
                  )}
                </button>
                <button
                  onClick={() => setPlatform("netlify")}
                  className={`flex-1 p-4 border rounded-lg text-left transition-colors ${
                    platform === "netlify"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">Netlify</div>
                  <div className="text-sm text-gray-500">
                    Great for static sites and JAMstack applications
                  </div>
                  {platform === "netlify" && (
                    <Badge className="mt-2">Selected</Badge>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Deploy Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleDeploy}
              disabled={isDeploying}
              size="lg"
              className="px-8"
            >
              {isDeploying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deploying...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Deploy Now
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}