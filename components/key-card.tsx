"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KeyRound, LinkIcon, Copy, Loader2 } from "lucide-react"
import { useMemo, useState } from "react"
import Link from "next/link"

interface KeyCardProps {
  title: string
  description: string
  features: string[]
  iconColor?: "yellow" | "purple"
  buttonColor?: "yellow" | "purple"
}

export function KeyCard({
  title,
  description,
  features,
  iconColor = "yellow",
  buttonColor = "yellow",
}: KeyCardProps) {
  const [phase1Clicks, setPhase1Clicks] = useState(0)
  const [phase2Clicks, setPhase2Clicks] = useState(0)
  const [isDelaying, setIsDelaying] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [CreatedKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const DirectLink = [
    "https://otieu.com/4/10024793",
    "https://otieu.com/4/9932455",
    "https://otieu.com/4/9932451",
    "https://otieu.com/4/9932452",
    "https://otieu.com/4/9932453",
    "https://otieu.com/4/9932460",
    "https://otieu.com/4/9932454",
    "https://otieu.com/4/9932456",
    "https://otieu.com/4/9932457",
    "https://otieu.com/4/9932459",
    "https://otieu.com/4/9932458",
  ]

  // ✅ ล็อกลิงก์สุ่มไว้ ไม่เปลี่ยนทุก render
  const randomUrl = useMemo(() => {
    const idx = Math.floor(Math.random() * DirectLink.length)
    return DirectLink[idx]
  }, [DirectLink.length])

  /** ✅ เปิดลิงก์แบบปลอดภัย */
  const safeOpenLink = (url: string) => {
    if (typeof window !== "undefined") {
      const newTab = window.open(url, "_blank", "noopener,noreferrer")
      if (!newTab) console.warn("Popup blocked or failed to open:", url)
    }
  }

  /** ✅ คัดลอก key แบบปลอดภัย */
  const handleCopyKey = async () => {
    if (!CreatedKey) return
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      console.warn("Clipboard API unavailable.")
      return
    }

    try {
      await navigator.clipboard.writeText(CreatedKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Clipboard error:", e)
    }
  }

  /** ✅ คลิกหลายเฟส (Phase1 → Phase2 → สร้าง key) */
  const handleMultiClick = async () => {
    if (isDelaying || isLoading) return

    if (!isCompleted) {
      safeOpenLink(randomUrl)
    }

    // Phase 1: 5 คลิกแรก
    if (phase1Clicks < 5) {
      setPhase1Clicks(prev => prev + 1)
      setIsDelaying(true)
      setTimeout(() => setIsDelaying(false), 800)
      return
    }

    // Phase 2: 3 คลิกถัดไป → เริ่มสร้าง Key
    if (phase2Clicks < 3) {
      const newCount = phase2Clicks + 1
      setPhase2Clicks(newCount)

      if (newCount === 3) {
        setIsCompleted(true)
        setIsLoading(true)

        try {
          const res = await fetch("/api/create-key", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          })

          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = await res.json()
          const key =
            data?.luarmor_data?.user_key ||
            data?.luarmor_data?.message ||
            "ERROR_CREATING_KEY"

          setCreatedKey(key)
        } catch (err) {
          console.error("Error creating key:", err)
          setCreatedKey("ERROR_CREATING_KEY")
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsDelaying(true)
        setTimeout(() => setIsDelaying(false), 800)
      }
    }
  }

  /** ✅ ปรับ UX ของปุ่มให้ feedback ชัด */
  const getButtonText = () => {
    if (isLoading) return "Creating Key..."
    if (CreatedKey) return "Key Created ✅"
    if (phase1Clicks < 5) return `Click ${5 - phase1Clicks} more`
    if (phase2Clicks < 3) return `Click ${3 - phase2Clicks} more`
    return `Get Key - ${title}`
  }

  const iconColorClasses =
    iconColor === "purple"
      ? "bg-purple-500/10 text-purple-500"
      : "bg-yellow-500/10 text-yellow-500"

  const buttonColorClasses = CreatedKey
    ? "bg-green-500 hover:bg-green-600 text-white"
    : buttonColor === "purple"
    ? "bg-purple-500 hover:bg-purple-600 text-white"
    : "bg-yellow-500 hover:bg-yellow-600 text-slate-900"

  const Icon = iconColor === "purple" ? KeyRound : LinkIcon

  return (
    <Card className="w-full h-full flex flex-col justify-center overflow-hidden bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md select-none">
      <CardContent className="p-8 flex flex-col justify-center space-y-6 h-full">
        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${iconColorClasses}`}>
            <Icon className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <h3 className="text-white text-2xl font-bold">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Progress Dots */}
        {!CreatedKey && (
          <div className="flex justify-center space-x-2 pt-2">
            {[...Array(8)].map((_, i) => {
              const active = i < phase1Clicks + phase2Clicks
              return (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition ${active ? "bg-yellow-500" : "bg-zinc-700"}`}
                />
              )
            })}
          </div>
        )}

        {/* Instructions */}
        {!CreatedKey && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5">
            <ol className="space-y-2.5 text-gray-300 text-sm">
              {features.map((feature, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-semibold text-gray-400 shrink-0">{index + 1}.</span>
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Main Button */}
        {!CreatedKey && (
          <>
            {!isCompleted ? (
              // 🟡 ถ้ายังไม่ครบ → ใช้ลิงก์แทนปุ่ม
              <Link href={randomUrl} passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-full h-12 rounded-lg font-semibold text-base transition-all duration-200 select-none ${buttonColorClasses} ${
                    isDelaying ? "cursor-not-allowed opacity-70" : ""
                  }`}
                  onClick={handleMultiClick}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {getButtonText()}
                </a>
              </Link>
            ) : (
              <Button
                onClick={handleMultiClick}
                disabled={isDelaying || isLoading}
                className={`w-full h-12 rounded-lg font-semibold text-base transition-all duration-200 select-none ${buttonColorClasses} ${
                  isDelaying ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5 mr-2" />
                )}
                {getButtonText()}
              </Button>
            )}
          </>
        )}

        {/* Key Display */}
        {CreatedKey && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-6 flex flex-col items-center text-center space-y-4">
            <KeyRound className="w-10 h-10 text-green-400" />
            <div className="text-gray-200 font-mono break-all text-sm bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
              {CreatedKey}
            </div>
            <Button
              onClick={handleCopyKey}
              variant="outline"
              className="w-full rounded-lg border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 transition"
            >
              <Copy className="w-5 h-5 mr-2" />
              {copied ? "Copied!" : "Copy Key"}
            </Button>
            <p className="text-xs text-gray-500">Expires in 4 hours ⏳</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
