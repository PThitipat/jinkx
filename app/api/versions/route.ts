import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://weao.xyz/api/versions/current", {
      headers: {
        'User-Agent': 'WEAO-3PService'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch versions" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    // console.error("Error fetching versions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

