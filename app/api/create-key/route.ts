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
      return NextResponse.json(
        { error: "Forbidden: Invalid origin" },
        { status: 403 }
      );
    }
  }

  // 2. Rate Limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // 3. Parse body and Check hCaptcha Token
  let body;
  try {
    body = await req.json();
    const hcaptchaToken = body.hcaptchaToken;

    if (!hcaptchaToken) {
      return NextResponse.json(
        { error: "hCaptcha token is required" },
        { status: 400 }
      );
    }

    const isValidCaptcha = await verifyHcaptcha(hcaptchaToken);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: "Invalid hCaptcha verification" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // 4. Forward to Node.js server
  try {
    const { auth_expire, key_days, identifier, discord_id, duration_type } = body;

    // Check if NODE_SERVER_URL is configured
    if (!NODE_SERVER_URL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Prepare payload for Node.js server
    const payload: any = {};
    
    if (key_days !== undefined) {
      // If key_days is provided, use it directly (timer doesn't start until key is used)
      payload.key_days = key_days;
      if (duration_type) {
        payload.duration_type = duration_type; // "days" or "hours"
      }
    } else if (auth_expire !== undefined) {
      // If auth_expire is provided
      payload.auth_expire = auth_expire;
      
      // If identifier or discord_id is provided, it's a claimed key (starts counting immediately)
      if (identifier) {
        payload.identifier = identifier;
      }
      if (discord_id) {
        payload.discord_id = discord_id;
      }
      // If neither identifier nor discord_id is provided, server will convert offset to key_days
    }

    const response = await axios.post(
      `${NODE_SERVER_URL}/create-key`,
      payload,
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
    // Handle 404 specifically
    if (err?.response?.status === 404) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 404 }
      );
    }
    
    // Handle other errors - don't expose internal details
    const statusCode = err?.response?.status || 500;
    const errorMessage = statusCode === 500 
      ? "An internal error occurred. Please try again later."
      : (err?.response?.data?.error || "An error occurred. Please try again.");
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}