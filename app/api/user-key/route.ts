import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const NODE_SERVER_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL!
const LOCAL_API_KEY = process.env.NEXT_PUBLIC_LOCAL_API_KEY! || process.env.LOCAL_API_KEY!

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userKey = searchParams.get("user_key")

    // Input validation
    if (!userKey || typeof userKey !== "string" || userKey.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid user_key parameter" },
        { status: 400 }
      )
    }

    // Sanitize user_key
    const sanitizedUserKey = userKey.trim()
    if (sanitizedUserKey.length > 200) {
      return NextResponse.json(
        { error: "Invalid user_key format" },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${NODE_SERVER_URL}/get-user-key?user_key=${encodeURIComponent(sanitizedUserKey)}`,
      {
        headers: {
          "x-api-key": LOCAL_API_KEY,
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(30000), // 30 seconds
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch key details" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

