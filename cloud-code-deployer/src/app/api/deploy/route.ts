import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { v2 as cloudinary } from 'cloudinary'
import { z } from "zod"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const deploySchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  platform: z.enum(["vercel", "netlify"]),
  githubUrl: z.string().url().optional(),
})

interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  [key: string]: unknown
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const projectName = formData.get('projectName') as string
    const platform = formData.get('platform') as string
    const githubUrl = formData.get('githubUrl') as string
    const file = formData.get('file') as File

    // Validate input
    const validatedData = deploySchema.parse({
      projectName,
      platform,
      githubUrl: githubUrl || undefined,
    })

    if (!file && !githubUrl) {
      return NextResponse.json(
        { error: "Either file upload or GitHub URL is required" },
        { status: 400 }
      )
    }

    let fileUrl: string | undefined

    // Handle file upload to Cloudinary
    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      try {
        const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: "raw",
              folder: "deployments",
              public_id: `${session.user.id}/${Date.now()}_${file.name}`,
            },
            (error, result) => {
              if (error) reject(error)
              else if (result) resolve(result as CloudinaryUploadResult)
              else reject(new Error('Upload failed'))
            }
          ).end(buffer)
        })

        fileUrl = uploadResult.secure_url
      } catch (error) {
        console.error('Cloudinary upload error:', error)
        return NextResponse.json(
          { error: "Failed to upload file" },
          { status: 500 }
        )
      }
    }

    // Create deployment record
    const { data: deployment, error } = await supabaseAdmin
      .from('deployments')
      .insert({
        user_id: session.user.id,
        project_name: validatedData.projectName,
        platform: validatedData.platform,
        status: 'pending',
        source_url: githubUrl || fileUrl,
        source_type: githubUrl ? 'github' : 'upload',
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: "Failed to create deployment" },
        { status: 500 }
      )
    }

    // Trigger deployment in background
    triggerDeployment(deployment.id, validatedData.platform)

    return NextResponse.json({
      message: "Deployment started successfully",
      deployment: {
        id: deployment.id,
        project_name: deployment.project_name,
        platform: deployment.platform,
        status: deployment.status,
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Deploy API error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Background deployment function
async function triggerDeployment(
  deploymentId: string,
  platform: 'vercel' | 'netlify'
) {
  try {
    // Update status to in_progress
    await supabaseAdmin
      .from('deployments')
      .update({ status: 'in_progress' })
      .eq('id', deploymentId)

    let previewUrl: string | undefined
    let success = false

    if (platform === 'vercel') {
      const result = await deployToVercel()
      previewUrl = result.previewUrl
      success = result.success
    } else if (platform === 'netlify') {
      const result = await deployToNetlify()
      previewUrl = result.previewUrl
      success = result.success
    }

    // Update deployment status
    await supabaseAdmin
      .from('deployments')
      .update({
        status: success ? 'success' : 'failed',
        preview_url: previewUrl,
        error_message: success ? null : 'Deployment failed. Please check your project configuration.',
        updated_at: new Date().toISOString(),
      })
      .eq('id', deploymentId)

  } catch (deploymentError) {
    console.error('Deployment error:', deploymentError)
    await supabaseAdmin
      .from('deployments')
      .update({
        status: 'failed',
        error_message: 'Internal deployment error occurred.',
        updated_at: new Date().toISOString(),
      })
      .eq('id', deploymentId)
  }
}

async function deployToVercel() {
  // Simulate Vercel deployment
  // In a real implementation, you would use Vercel's API
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock successful deployment
    const mockDeploymentId = `vercel-${Date.now()}`
    const previewUrl = `https://${mockDeploymentId}.vercel.app`
    
    return {
      success: true,
      previewUrl,
    }
  } catch {
    return {
      success: false,
      previewUrl: undefined,
    }
  }
}

async function deployToNetlify() {
  // Simulate Netlify deployment
  // In a real implementation, you would use Netlify's API
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    // Mock successful deployment
    const mockDeploymentId = `netlify-${Date.now()}`
    const previewUrl = `https://${mockDeploymentId}.netlify.app`
    
    return {
      success: true,
      previewUrl,
    }
  } catch {
    return {
      success: false,
      previewUrl: undefined,
    }
  }
}