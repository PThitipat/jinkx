import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@supabase/supabase-js"

const NODE_SERVER_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL!
const LOCAL_API_KEY = process.env.NEXT_PUBLIC_LOCAL_API_KEY! || process.env.LOCAL_API_KEY!

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment")
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user_key, force } = await req.json()

    // Input validation
    if (!user_key || typeof user_key !== "string" || user_key.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid user_key parameter" },
        { status: 400 }
      )
    }

    // Sanitize user_key (basic validation - alphanumeric and some special chars)
    const sanitizedUserKey = user_key.trim()
    if (sanitizedUserKey.length > 200) {
      return NextResponse.json(
        { error: "Invalid user_key format" },
        { status: 400 }
      )
    }

    // Check user's reset_token
    const { data: userRow, error: userError } = await supabase
      .from("Xjinkx_users")
      .select("id, reset_token")
      .eq("id", (session.user as any).id)
      .single()

    if (userError || !userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const currentResetToken = userRow.reset_token ?? 0
    if (currentResetToken < 1) {
      return NextResponse.json(
        { error: "Not enough reset tokens. You need at least 1 reset token to reset HWID." },
        { status: 400 }
      )
    }

    // Call external API to reset HWID
    const response = await fetch(`${NODE_SERVER_URL}/reset-hwid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": LOCAL_API_KEY,
      },
      body: JSON.stringify({
        user_key: sanitizedUserKey,
        force: typeof force === "boolean" ? force : false,
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000), // 30 seconds
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error || "Failed to reset HWID" },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Only deduct reset_token if reset was successful
    if (data.ok && data.success) {
      const newResetToken = Math.max(0, currentResetToken - 1)
      
      const { error: updateError } = await supabase
        .from("Xjinkx_users")
        .update({
          reset_token: newResetToken,
          last_updated: new Date().toISOString(),
        })
        .eq("id", userRow.id)

      if (updateError) {
        // Silently handle update error - don't expose internal errors
        return NextResponse.json(
          { error: "Failed to update reset token" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        ...data,
        remainingResetToken: newResetToken,
      })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

