import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@supabase/supabase-js"
import axios from "axios"
import https from "https"

const PHONE_TOPUP = process.env.PHONE_TOPUP
const XPLUEM_API_BASE = "https://api.xpluem.com"

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment")
}

if (!PHONE_TOPUP) {
  throw new Error("Missing PHONE_TOPUP in environment")
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

// Extract voucher code from gift link
// Supports both full link and code only
// Example: https://gift.truemoney.com/campaign/?v=019b2a54672c72276490bd8667561c90b9C
// Returns: 019b2a54672c72276490bd8667561c90b9C
function extractVoucherCode(linkVoucher: string): string | null {
  if (!linkVoucher || typeof linkVoucher !== "string") {
    return null
  }

  // Check if link contains ?v=
  if (linkVoucher.includes("?v=")) {
    const parts = linkVoucher.split("?v=")
    if (parts.length > 1 && parts[1]) {
      // Remove any query parameters after voucher code
      const voucherCode = parts[1].split("&")[0].split("#")[0].trim()
      return voucherCode || null
    }
  }

  // If no ?v= found, assume the whole string is the voucher code
  return linkVoucher.trim() || null
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { giftLink } = await req.json()

    if (!giftLink || typeof giftLink !== "string") {
      return NextResponse.json(
        { error: "Gift link is required" },
        { status: 400 }
      )
    }

    // Extract voucher code from gift link
    const voucherCode = extractVoucherCode(giftLink)
    if (!voucherCode) {
      return NextResponse.json(
        { error: "Invalid gift link format. Could not extract voucher code." },
        { status: 400 }
      )
    }

    // Call Xpluem API
    // Format: https://api.xpluem.com/{voucher_code}/{target_phone}
    const apiUrl = `${XPLUEM_API_BASE}/${voucherCode}/${PHONE_TOPUP}`

    let apiResponse
    try {
      const response = await axios.get(apiUrl, {
        timeout: 30000,
        validateStatus: (status) => status < 500, // Don't throw on 4xx errors
        // Disable SSL verification (as in PHP code: CURLOPT_SSL_VERIFYHOST, CURLOPT_SSL_VERIFYPEER)
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      })

      // Check if response is HTML (error page)
      const contentType = response.headers["content-type"] || ""
      if (!contentType.includes("application/json")) {
        const text = typeof response.data === "string" ? response.data : JSON.stringify(response.data)
        if (text.trim().startsWith("<!DOCTYPE")) {
          return NextResponse.json(
            {
              error: "Payment service returned an error page",
              code: "INVALID_RESPONSE",
            },
            { status: 500 }
          )
        }
      }

      apiResponse = response.data
    } catch (apiError: any) {
      // Handle axios errors
      if (apiError.response) {
        const errorData = apiError.response.data

        // Check if response is HTML
        if (typeof errorData === "string" && errorData.trim().startsWith("<!DOCTYPE")) {
          return NextResponse.json(
            { error: "Payment service returned an error page" },
            { status: 500 }
          )
        }

        // Try to parse error message from response
        let errorMessage = "Topup failed"
        if (errorData?.message) {
          errorMessage = errorData.message
        } else if (typeof errorData === "string") {
          errorMessage = errorData
        }

        return NextResponse.json(
          {
            error: errorMessage,
            code: `HTTP_${apiError.response.status}`,
          },
          { status: apiError.response.status || 500 }
        )
      }

      if (apiError.request) {
        return NextResponse.json(
          {
            error: "เชื่อมต่อ API ไม่สำเร็จ",
            code: "SERVICE_UNAVAILABLE",
            details: "The payment service did not respond. Please check your connection and try again.",
          },
          { status: 503 }
        )
      }

      return NextResponse.json(
        {
          error: "Failed to process topup request",
          code: "UNKNOWN_ERROR",
          details: apiError.message || "An unexpected error occurred. Please try again.",
        },
        { status: 500 }
      )
    }

    // Check response format
    if (!apiResponse || typeof apiResponse !== "object") {
      console.error("Invalid API response:", apiResponse)
      return NextResponse.json(
        {
          error: "Invalid response from payment service",
          details: "Response format is not valid. Please check server logs.",
        },
        { status: 500 }
      )
    }

    // Check if success
    if (apiResponse.success === true) {
      // Get amount from response
      // Response format: { success: true, data: { name: "...", amount: "10.00" } }
      const amountStr = apiResponse.data?.amount || "0"
      const amount = parseFloat(amountStr)

      if (isNaN(amount) || amount <= 0) {
        console.error("Invalid amount from API:", amountStr, apiResponse)
        return NextResponse.json(
          { error: "Invalid voucher amount" },
          { status: 400 }
        )
      }

      // Get user from database
      const { data: userRow, error: userError } = await supabase
        .from("Xjinkx_users")
        .select("id, points")
        .eq("id", (session.user as any).id)
        .single()

      if (userError || !userRow) {
        console.error("User not found:", userError, session.user)
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Get current points
      const currentPoints = parseFloat(userRow.points?.toString() || "0")
      // Calculate new points (keep as number for calculation)
      const newPointsValue = currentPoints + amount
      // Convert to integer since database column is integer type
      const newPoints = Math.round(newPointsValue)

      console.log("Updating points:", {
        userId: userRow.id,
        currentPoints,
        amount,
        newPoints,
      })

      const { error: updateError } = await supabase
        .from("Xjinkx_users")
        .update({ points: newPoints })
        .eq("id", userRow.id)

      if (updateError) {
        console.error("Failed to update points:", updateError)
        return NextResponse.json(
          { 
            error: "Failed to update points",
            details: updateError.message || "Database update failed"
          },
          { status: 500 }
        )
      }

      // Record topup history (optional - table may not exist yet)
      try {
        const { error: historyError } = await supabase
          .from("Xjinkx_topup_history")
          .insert({
            user_id: userRow.id,
            amount: amount,
            method: "truemoney-angpao",
            voucher_id: voucherCode,
            status: "success",
          })

        if (historyError) {
          // Log error but don't fail the request if table doesn't exist
          console.error("Failed to record topup history:", historyError)
        }
      } catch (historyErr) {
        // Silently ignore if table doesn't exist
        console.error("Topup history table may not exist:", historyErr)
      }

      return NextResponse.json({
        success: true,
        amount: amount,
        newPoints: newPoints,
        owner: apiResponse.data?.name || "ไม่ระบุ",
        message: apiResponse.message || "เติมเงินสำเร็จ",
      })
    } else {
      // Error case
      const errorMessage = apiResponse.message || "เกิดข้อผิดพลาดที่ไม่รู้จัก"
      return NextResponse.json(
        {
          error: errorMessage,
          code: "REDEEM_FAILED",
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error("Topup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
