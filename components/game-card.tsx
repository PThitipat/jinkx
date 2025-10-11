"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

interface GameCardProps {
  title: string
  image: string
  features: string[]
  onCopy?: () => void
}

export function GameCard({ title, image, features, onCopy }: GameCardProps) {
    const [phase1Clicks, setPhase1Clicks] = useState(0)
    const [phase2Clicks, setPhase2Clicks] = useState(0)
    const [isDelaying, setIsDelaying] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    const handleMultiClick = () => {
        if (isDelaying || isCompleted) return;

        if (phase1Clicks < 10) {
            const newCount = phase1Clicks + 1;
            setPhase1Clicks(newCount);

            if (newCount < 10) {
            setIsDelaying(true);
            setTimeout(() => setIsDelaying(false), 1000);
            }
        } else {
            const newCount = phase2Clicks + 1;
            setPhase2Clicks(newCount);

            if (newCount === 3) {
            setIsCompleted(true);
            onCopy?.();
            // รีเซ็ต state หลัง 2 วิ
            setTimeout(() => {
                setPhase1Clicks(0);
                setPhase2Clicks(0);
                setIsCompleted(false);
            }, 1000);
            } else {
            setIsDelaying(true);
            setTimeout(() => setIsDelaying(false), 1000);
            }
        }
    };

    const getButtonText = () => {
        if (isCompleted) return "Copied!";

        if (phase1Clicks < 10) {
            const remaining = 10 - phase1Clicks;
            return `Click - ${remaining} left`;
        } else {
            const remainingPhase2Click = 3 - phase2Clicks;
            return `Copy Script - ${remainingPhase2Click} left`;
        }
    };

    return (
        <Card className="w-full max-w-lg overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md select-none">
        <div className="relative">
            <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
            <Image
                src={image || "/placeholder.svg"}
                alt={title}
                width={400}
                height={225}
                className="w-full h-full object-cover"
            />
            </div>
        </div>

        <CardContent className="p-4 space-y-4">
            <h3 className="text-white text-lg font-semibold">{title}</h3>

            <div>
            <p className="text-gray-300 text-sm font-medium mb-2">Key Features</p>
            <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-700 text-gray-200 hover:bg-gray-600 text-xs px-3 py-1"
                >
                    {feature}
                </Badge>
                ))}
            </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <Link className="w-full" href="https://otieu.com/4/9935002" target="_blank">
                    <Button variant="outline"
                        onClick={handleMultiClick}
                        disabled={isDelaying}
                        className={`w-full px-6 py-2 rounded-md flex items-center gap-2 transition-all duration-200 select-none ${
                        isCompleted
                            ? "hover:bg-green-600"
                            : isDelaying
                            ? "cursor-not-allowed"
                            : ""
                        } text-white`}
                    >
                        <Copy className="w-4 h-4" />
                        {getButtonText()}
                    </Button>
                </Link>
            </div>
        </CardContent>
        </Card>
    )
}
