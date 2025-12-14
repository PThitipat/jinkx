"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

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

        if (phase1Clicks < 5) {
            const newCount = phase1Clicks + 1;
            setPhase1Clicks(newCount);

            if (newCount < 5) {
            setIsDelaying(true);
            setTimeout(() => setIsDelaying(false), 1000);
            }
        } else {
            const newCount = phase2Clicks + 1;
            setPhase2Clicks(newCount);

            if (newCount === 3) {
            setIsCompleted(true);
            onCopy?.();
            } else {
            setIsDelaying(true);
            setTimeout(() => setIsDelaying(false), 1000);
            }
        }
    };

    const getButtonText = () => {
        if (isCompleted) return "Copied!";

        if (phase1Clicks < 5) {
            const remaining = 5 - phase1Clicks;
            return `Click - ${remaining} left`;
        } else {
            const remainingPhase2Click = 3 - phase2Clicks;
            return `Copy Script - ${remainingPhase2Click} left`;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
        >
            <Card className="w-full overflow-hidden border border-border/50 bg-card/50 backdrop-blur-md rounded-2xl shadow-lg transition-all hover:shadow-2xl select-none group">
                <div className="relative overflow-hidden">
                    <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src={image || "/placeholder.svg"}
                                alt={title}
                                width={400}
                                height={225}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-foreground">{title}</h3>

                    <div>
                        <p className="text-muted-foreground text-sm font-medium mb-3">Key Features</p>
                        <div className="flex flex-wrap gap-2">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="bg-muted text-foreground hover:bg-muted/80 text-xs px-3 py-1.5 border border-border/50"
                                    >
                                        {feature}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <Link className="w-full" href="https://otieu.com/4/10024793" target="_blank">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="outline"
                                    onClick={handleMultiClick}
                                    disabled={isDelaying}
                                    className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 select-none shadow-lg hover:shadow-xl ${
                                        isCompleted
                                            ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                                            : isDelaying
                                            ? "cursor-not-allowed opacity-70"
                                            : "border-border/50 hover:border-primary/50"
                                    }`}
                                >
                                    <Copy className="w-4 h-4" />
                                    {getButtonText()}
                                </Button>
                            </motion.div>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
