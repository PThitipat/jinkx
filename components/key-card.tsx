"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LinkIcon, KeyRound } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface KeyCardProps {
    title: string
    description: string
    features: string[]
    link: string
    iconColor?: "yellow" | "purple"
    buttonColor?: "yellow" | "purple"
    onCopy?: () => void
}

export function KeyCard({
    title,
    description,
    features,
    link,
    iconColor = "yellow",
    buttonColor = "yellow",
    onCopy,
}: KeyCardProps) {
    const [phase1Clicks, setPhase1Clicks] = useState(0)
    const [phase2Clicks, setPhase2Clicks] = useState(0)
    const [isDelaying, setIsDelaying] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    const handleMultiClick = () => {
        if (isDelaying || isCompleted) return

        if (phase1Clicks < 8) {
        const newCount = phase1Clicks + 1
        setPhase1Clicks(newCount)

        if (newCount < 8) {
            setIsDelaying(true)
            setTimeout(() => setIsDelaying(false), 1000)
        }
        } else {
        const newCount = phase2Clicks + 1
        setPhase2Clicks(newCount)

        if (newCount === 3) {
            setIsCompleted(true)
        } else {
            setIsDelaying(true)
            setTimeout(() => setIsDelaying(false), 1000)
        }
        }
    }

    const getButtonText = () => {
        if (isCompleted) return `Get Key - ${title}`;

        if (phase1Clicks < 8) {
            const remaining = 8 - phase1Clicks;
            return `Click - ${remaining} left`;
        } else {
            const remainingPhase2Click = 3 - phase2Clicks;
            return `Get Key - ${title} - ${remainingPhase2Click} left`;
        }
    };

    const currentLink = (phase1Clicks >= 8 && phase2Clicks >= 3) ? link : "https://otieu.com/4/10024793"

    const iconColorClasses =
        iconColor === "purple" ? "bg-purple-500/10 text-purple-500" : "bg-yellow-500/10 text-yellow-500"

    const buttonColorClasses = isCompleted
        ? "bg-green-500 hover:bg-green-600 text-white"
        : buttonColor === "purple"
        ? "bg-purple-500 hover:bg-purple-600 text-white"
        : "bg-yellow-500 hover:bg-yellow-600 text-slate-900"

    const Icon = iconColor === "purple" ? KeyRound : LinkIcon

    return (
        <Card className="w-full max-w-lg overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md select-none">
            <CardContent className="p-8 space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${iconColorClasses}`}>
                        <Icon className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-white text-2xl font-bold text-center">{title}</h3>

                {/* Description */}
                <p className="text-gray-400 text-sm text-center leading-relaxed">{description}</p>

                {/* Instructions List */}
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

                {/* Button */}
                <Link className="block w-full" href={currentLink} target="_blank">
                    <Button
                        onClick={handleMultiClick}
                        disabled={isDelaying}
                        className={`w-full h-12 rounded-lg font-semibold text-base transition-all duration-200 select-none ${buttonColorClasses} ${
                        isDelaying ? "cursor-not-allowed opacity-70" : ""
                        }`}
                    >
                        <Icon className="w-5 h-5 mr-2" />
                        {getButtonText()}
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
