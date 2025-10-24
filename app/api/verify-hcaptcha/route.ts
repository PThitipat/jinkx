// pages/api/verify-hcaptcha.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

interface HCaptchaResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  credit?: boolean
  "error-codes"?: string[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" })
  }

  const { token } = req.body
  if (!token) return res.status(400).json({ success: false, message: "Missing token" })

  try {
    const secret = process.env.HCAPTCHA_SECRET_KEY
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${token}`
    })
    const data: HCaptchaResponse = await response.json() as HCaptchaResponse
    res.status(200).json({ success: data.success })
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" })
  }
}
