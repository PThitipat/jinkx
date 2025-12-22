import { NextResponse } from "next/server"

// Cache storage
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const scrap = searchParams.get("scrap")
  const key = searchParams.get("key")

  if (!scrap || !key) {
    return NextResponse.json(
      { error: "Missing scrap or key parameter" },
      { status: 400 }
    )
  }

  // Check cache
  const cacheKey = `${scrap}-${key}`
  const cached = cache.get(cacheKey)
  const now = Date.now()

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data)
  }

  try {
    const response = await fetch(
      `https://api.rubis.app/v2/scrap/${scrap}/raw?accessKey=${key}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch test results" },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Update cache
    cache.set(cacheKey, { data, timestamp: now })

    return NextResponse.json(data)
  } catch (error) {
    // console.error("Error fetching sUNC test results:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

