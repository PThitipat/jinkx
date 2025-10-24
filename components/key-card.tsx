"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KeyRound, LinkIcon, Copy, Loader2 } from "lucide-react"
import { useState } from "react"

interface KeyCardProps {
    title: string
    description: string
    features: string[]
    iconColor?: "yellow" | "purple"
    buttonColor?: "yellow" | "purple"
}

const LUARMOR_API_URL = process.env.NEXT_PUBLIC_LUARMOR_API_URL!
const LUARMOR_API_KEY = process.env.NEXT_PUBLIC_LUARMOR_API_KEY!

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

    const externalLink = "https://otieu.com/4/10024793"

    const [copied, setCopied] = useState(false)

    const handleCopyKey = () => {
        if (CreatedKey) {
            navigator.clipboard.writeText(CreatedKey).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000) // กลับเป็นปกติใน 2 วิ
            })
        }
    }

    const handleMultiClick = async () => {
        if (isDelaying || isLoading) return

        // เปิดลิงก์ถ้ายังไม่ครบ
        if (!isCompleted) {
            window.open(externalLink, "_blank")
        }

        if (phase1Clicks < 8) {
            const newCount = phase1Clicks + 1
            setPhase1Clicks(newCount)
            if (newCount < 8) {
                setIsDelaying(true)
                setTimeout(() => setIsDelaying(false), 1000)
            }
        } else if (phase2Clicks < 3) {
            const newCount = phase2Clicks + 1
            setPhase2Clicks(newCount)

            if (newCount === 3) {
                setIsCompleted(true);
                setIsLoading(true);
                try {
                    const res = await fetch("/api/create-key", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const data = await res.json();
                    setCreatedKey(data.luarmor_data?.user_key || data.luarmor_data?.message || "ERROR_CREATING_KEY");
                } catch (e) {
                    setCreatedKey("ERROR_CREATING_KEY");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsDelaying(true)
                setTimeout(() => setIsDelaying(false), 1000)
            }
        }
    }

    const getButtonText = () => {
        if (isLoading) return "CREATING Key..."
        if (CreatedKey) return "Key Created ✅"
        if (phase1Clicks < 8) return `Click ${8 - phase1Clicks} more`
        if (phase2Clicks < 3) return `Click ${3 - phase2Clicks} more to create`
        return `Get Key - ${title}`
    }

    const iconColorClasses =
        iconColor === "purple" ? "bg-purple-500/10 text-purple-500" : "bg-yellow-500/10 text-yellow-500"

    const buttonColorClasses = CreatedKey
        ? "bg-green-500 hover:bg-green-600 text-white"
        : buttonColor === "purple"
        ? "bg-purple-500 hover:bg-purple-600 text-white"
        : "bg-yellow-500 hover:bg-yellow-600 text-slate-900"

    const Icon = iconColor === "purple" ? KeyRound : LinkIcon

    return (
        <Card className="w-ful h-full flex flex-col justify-center overflow-hidden border border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md select-none">
            <CardContent className="p-8 flex flex-col justify-center space-y-6 h-full">

                {/* Icon & Title */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${iconColorClasses}`}>
                        <Icon className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-white text-2xl font-bold">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                </div>

                {/* Progress Indicator */}
                {!CreatedKey && (
                    <div className="flex justify-center space-x-2 pt-2">
                        {[...Array(11)].map((_, i) => {
                            const active = i < (phase1Clicks + phase2Clicks)
                            return (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition ${
                                        active ? "bg-yellow-500" : "bg-zinc-700"
                                    }`}
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

                {/* Created Key Display */}
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
