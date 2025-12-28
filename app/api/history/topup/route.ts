import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
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
      .from("Xjinkx_topup_history")
      .select("id, amount, method, voucher_id, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Failed to fetch topup history:", error)
      return NextResponse.json(
        { error: "Failed to fetch topup history" },
        { status: 500 }
      )
    }

    const rows =
      data?.map((row: any) => ({
        id: row.id,
        amount: Number(row.amount ?? 0),
        method: row.method ?? null,
        reference: row.voucher_id ?? null,
        status: row.status ?? null,
        created_at: row.created_at,
      })) ?? []

    return NextResponse.json(rows)
  } catch (error: any) {
    console.error("Topup history error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


