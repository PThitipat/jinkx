import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment")
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id

    const { data, error } = await supabase
      .from("Xjinkx_purchase_history")
      .select(
        `
        id,
        license,
        created_at,
        product_id,
        Xjinkx_products (
          title,
          price
        )
      `
      )
      .eq("user_id", userId)
      .neq("license", "TOKEN") // Filter out TOKEN licenses (reset token products)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch purchase history" },
        { status: 500 }
      )
    }

    const rows =
      data?.map((row: any) => ({
        id: row.id,
        license: row.license,
        created_at: row.created_at,
        productTitle: row.Xjinkx_products?.title ?? "Unknown",
        price: Number(row.Xjinkx_products?.price ?? 0),
      })) ?? []

    return NextResponse.json(rows)
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


