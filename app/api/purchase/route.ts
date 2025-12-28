import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@supabase/supabase-js"
import axios from "axios"

const NODE_SERVER_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL!
const LOCAL_API_KEY = process.env.NEXT_PUBLIC_LOCAL_API_KEY!

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

    const { productId, quantity } = await req.json()
    const qty = Math.max(1, Number(quantity) || 1)

    // ดึงสินค้า + category
    const { data: product, error: productError } = await supabase
      .from("Xjinkx_products")
      .select(`
        id, 
        title, 
        duration, 
        price, 
        solds, 
        is_active,
        category_id,
        Xjinkx_categories (name)
      `)
      .eq("id", productId)
      .eq("is_active", true)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // ดึง user + points + reset_token
    const { data: userRow, error: userError } = await supabase
      .from("Xjinkx_users")
      .select("id, points, reset_token")
      .eq("id", (session.user as any).id)
      .single()

    if (userError || !userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const unitPrice = Number(product.price) || 0
    const totalPrice = unitPrice * qty

    if (userRow.points < totalPrice) {
      return NextResponse.json(
        { error: "Not enough points" },
        { status: 400 }
      )
    }

    // ตรวจสอบว่าเป็น ResetToken product หรือไม่
    const categoryName = (product.Xjinkx_categories as any)?.name
    const isResetTokenProduct = categoryName === "ResetToken"

    let licenses: string[] = []
    let tokenAmount = 0

    if (isResetTokenProduct) {
      // สำหรับ ResetToken: ไม่ต้องสร้าง license, เพิ่ม token ตามจำนวนที่ซื้อ (1 token per item)
      tokenAmount = qty
      // สร้าง fake license สำหรับ purchase history (ใช้ "TOKEN" เป็น placeholder)
      licenses = Array(qty).fill("TOKEN")
    } else {
      // สำหรับ product ปกติ: สร้าง license ตามจำนวนที่ซื้อ
      for (let i = 0; i < qty; i++) {
        const resp = await axios.post(
          `${NODE_SERVER_URL}/create-key`,
          {
            key_days: product.duration, // จำนวนวันของ key ตาม product.duration
            duration_type: "days",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": LOCAL_API_KEY,
            },
            timeout: 30000,
          }
        )

        const data = resp.data
        const lic =
          data?.luarmor_data?.user_key ||
          data?.luarmor_data?.message ||
          null

        if (!lic) {
          return NextResponse.json(
            { error: "Failed to generate license" },
            { status: 500 }
          )
        }

        licenses.push(lic)
      }
      // สำหรับ product ปกติ: ให้ reset_token 2 tokens (เหมือนเดิม)
      tokenAmount = 2
    }

    // บันทึก purchase history (รวม discord_id จาก session)
    const discordId = (session.user as any).discord_id || null
    const historyRows = licenses.map((license) => ({
      user_id: userRow.id,
      product_id: product.id,
      license,
      discord_id: discordId,
    }))

    const { error: historyError } = await supabase
      .from("Xjinkx_purchase_history")
      .insert(historyRows)

    if (historyError) {
      return NextResponse.json(
        { error: "Failed to save purchase history" },
        { status: 500 }
      )
    }

    // หัก points + เพิ่ม reset_token + อัปเดต solds
    const newPoints = userRow.points - totalPrice
    const newResetToken = (userRow.reset_token ?? 0) + tokenAmount

    await supabase
      .from("Xjinkx_users")
      .update({
        points: newPoints,
        reset_token: newResetToken,
        last_updated: new Date().toISOString(),
      })
      .eq("id", userRow.id)

    const newSolds = product.solds + qty

    await supabase
      .from("Xjinkx_products")
      .update({
        solds: newSolds,
      })
      .eq("id", product.id)

    return NextResponse.json({
      ok: true,
      licenses: isResetTokenProduct ? [] : licenses, // ไม่ส่ง licenses สำหรับ ResetToken
      remainingPoints: newPoints,
      remainingResetToken: newResetToken,
      productSolds: newSolds,
      isTokenProduct: isResetTokenProduct, // บอก frontend ว่าเป็น token product
    })
  } catch (err: any) {
    // แปลง error จาก axios / Supabase ให้เป็นข้อความอ่านง่าย แทนที่จะเป็น 500 ทั่วไป
    const status = err?.response?.status || 500
    let message = "Internal server error"

    // ถ้าเป็น error จาก Node server หรือ Luarmor
    if (err?.response?.data?.error && typeof err.response.data.error === "string") {
      message = err.response.data.error
    } else if (typeof err?.message === "string" && status !== 500) {
      message = err.message
    } else if (status === 429) {
      message = "Service is rate limited. Please try again later."
    }

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}