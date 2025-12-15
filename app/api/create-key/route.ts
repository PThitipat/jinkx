import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NODE_SERVER_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL!;
const LOCAL_API_KEY = process.env.NEXT_PUBLIC_LOCAL_API_KEY!;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || "";
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY!;

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  
  return (
    cfConnectingIp ||
    (forwarded ? forwarded.split(",")[0].trim() : null) ||
    realIp ||
    req.ip ||
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

async function verifyHcaptcha(token: string): Promise<boolean> {
  if (!HCAPTCHA_SECRET) {
    console.warn("HCAPTCHA_SECRET not set, skipping verification");
    return true; // Allow if not configured
  }

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: HCAPTCHA_SECRET,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  // 1. Check Origin/Referer
  if (ALLOWED_ORIGIN) {
    const allowedOrigins = ALLOWED_ORIGIN.split(",").map((o) => o.trim());
    const isValidOrigin =
      origin && allowedOrigins.some((allowed) => origin.startsWith(allowed));
    const isValidReferer =
      referer && allowedOrigins.some((allowed) => referer.startsWith(allowed));

    if (!isValidOrigin && !isValidReferer) {
      console.log(`❌ Blocked: Invalid origin/referer | ip=${ip} | origin=${origin} | referer=${referer}`);
      return NextResponse.json(
        { error: "Forbidden: Invalid origin" },
        { status: 403 }
      );
    }
  }

  // 2. Rate Limiting
  if (!checkRateLimit(ip)) {
    console.log(`❌ Blocked: Rate limit exceeded | ip=${ip}`);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // 3. Check hCaptcha Token
  try {
    const body = await req.json();
    const hcaptchaToken = body.hcaptchaToken;

    if (!hcaptchaToken) {
      console.log(`❌ Blocked: Missing hCaptcha token | ip=${ip}`);
      return NextResponse.json(
        { error: "hCaptcha token is required" },
        { status: 400 }
      );
    }

    const isValidCaptcha = await verifyHcaptcha(hcaptchaToken);
    if (!isValidCaptcha) {
      console.log(`❌ Blocked: Invalid hCaptcha token | ip=${ip}`);
      return NextResponse.json(
        { error: "Invalid hCaptcha verification" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(`❌ Blocked: Failed to parse body | ip=${ip}`, error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // 4. Forward to Node.js server
  try {
    const response = await axios.post(
      NODE_SERVER_URL,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": LOCAL_API_KEY,
        },
        timeout: 30000,
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Error forwarding to Node server:", err?.response?.data ?? err.message);
    return NextResponse.json(
      { error: err?.response?.data || "Internal Server Error" },
      { status: err?.response?.status || 500 }
    );
  }
}