import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force no-cache in Next.js route handlers
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

type ProductRow = {
  id: string;
  title: string | null;
  image: string | null;
  duration: any;
  price: any;
  solds: any;
  description: string | null;
  is_active: boolean | null;
  category_id: string | null;
  Xjinkx_categories?: { id: string; name: string | null } | { id: string; name: string | null }[] | null;
};

function toNumberSafe(v: unknown, fallback = 0) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET() {
  try {
    // 1) Fetch products
    const { data: products, error: productErr } = await supabase
      .from("Xjinkx_products")
      .select(
        `
        id,
        title,
        image,
        duration,
        price,
        solds,
        description,
        is_active,
        category_id,
        Xjinkx_categories (
          id,
          name
        )
      `
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (productErr) {
      console.error("Failed to fetch products:", productErr.message);
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    const productList: ProductRow[] = (products ?? []).map((p: any) => ({
      ...p,
      Xjinkx_categories: Array.isArray(p?.Xjinkx_categories)
        ? p.Xjinkx_categories[0] ?? null
        : p.Xjinkx_categories ?? null,
    }));

    if (productList.length === 0) {
      return NextResponse.json([]);
    }

    // 2) Count purchase history per product using COUNT EXACT with head:true (no pagination issues)
    //    This is the safest "100%" approach without relying on group() behavior.
    const counts = await Promise.all(
      productList.map(async (product) => {
        const { count, error } = await supabase
          .from("Xjinkx_purchase_history")
          .select("id", { count: "exact", head: true })
          .eq("product_id", product.id);

        if (error) {
          console.error("Failed to count history", { productId: product.id, error: error.message });
          return { productId: product.id, historyCount: 0, hadError: true };
        }

        return { productId: product.id, historyCount: typeof count === "number" ? count : 0, hadError: false };
      })
    );

    const historyMap = new Map<string, number>();
    for (const row of counts) historyMap.set(row.productId, row.historyCount);

    // 3) Transform response (IMPORTANT: return finalSolds, not product.solds)
    const transformedProducts = productList.map((product) => {
      const fromHistory = historyMap.get(product.id) ?? 0;
      const fromProduct = toNumberSafe(product.solds, 0);
      const finalSolds = Math.max(fromHistory, fromProduct);

      return {
        id: product.id,
        title: product.title ?? "",
        image: product.image ?? "",
        category: (product.Xjinkx_categories as any)?.name ?? "Unknown",
        duration: product.duration,
        price: toNumberSafe(product.price, 0),
        solds: finalSolds,
        description: product.description ?? "",
      };
    });

    // 4) Explicitly disable caching at HTTP level too
    return new NextResponse(JSON.stringify(transformedProducts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("Internal server error:", error?.message ?? error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
