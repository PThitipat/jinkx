import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY ?? "",
        response: body.token,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      return NextResponse.json({ success: false, error: "Invalid captcha" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("hCaptcha verify error:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
