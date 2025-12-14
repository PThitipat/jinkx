"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import {
    Check,
    ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Nav";
import { GameCard } from "@/components/game-card";
import { toast } from "sonner"

export default function LandingPage() {

    const handleCopy = () => {
        const textToCopy = 'loadstring(game:HttpGet("https://raw.githubusercontent.com/stormskmonkey/JinkX/refs/heads/main/Loader.lua"))()';
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                toast.success("Script copied to clipboard!", {
                    description: "You can now paste it in your executor"
                })
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
                toast.error("Failed to copy script", {
                    description: "Please try again"
                })
            });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }


    return (
        <div className="flex min-h-[100dvh] flex-col bg-background">
            <Navbar />

            <main className="flex-1 pt-16 md:pt-20" id="home">
                {/* Hero Section */}
                <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
                    </div>

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="space-y-6 mb-12"
                            >
                                <motion.h1
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
                                >
                                    <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                                        Experience the Best{" "}
                                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                                            Free Script
                                        </span>
                                    </span>
                                </motion.h1>
                                
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                                >
                                    JinkX provides lightning-fast execution, and a simple interface — all completely freemium.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
                                >
                                    <a href="https://discord.gg/XAfp5RsQ4M" target="_blank" rel="noopener noreferrer">
                                        <Button 
                                            size="lg" 
                                            className="h-12 px-8 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium text-base shadow-lg hover:shadow-xl transition-all"
                                        >
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="20" 
                                                height="20" 
                                                viewBox="0 0 24 24" 
                                                fill="currentColor" 
                                                className="mr-2"
                                            >
                                                <path d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l-.005 .15a2 2 0 1 0 1.995 -2.15z"></path>
                                            </svg>
                                            Join Discord
                                        </Button>
                                    </a>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground"
                                >
                                    <div className="flex items-center gap-2">
                                        <Check className="size-5 text-green-500" />
                                        <span>100% Free script</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="size-5 text-green-500" />
                                        <span>24 hrs trial</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="size-5 text-green-500" />
                                        <span>Undetected</span>
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="relative mt-16"
                            >
                                <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card/50 backdrop-blur-sm">
                                    <Image
                                        src="https://img5.pic.in.th/file/secure-sv1/image2c7a0b70af9677c3.png"
                                        width={1280}
                                        height={720}
                                        alt="JinkX Dashboard"
                                        className="w-full h-auto"
                                        priority
                                    />
                                </div>
                                <div className="absolute -z-10 -bottom-10 -right-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
                                <div className="absolute -z-10 -top-10 -left-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Roblox Map Support Section */}
                <section className="w-full py-20 md:py-32 relative overflow-hidden">
                    <div className="container mx-auto px-4 md:px-6 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-3xl md:text-5xl font-bold mb-4"
                            >
                                JinkX Map Support
                            </motion.h2>
                        </motion.div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                        >
                            {[
                                {
                                    image: "/MapImages/FishIt.webp",
                                    title: "Fish It! 🐟",
                                },
                                {
                                    image: "/MapImages/raise_animals.png",
                                    title: "[🎉] Raise Animals",
                                },
                                {
                                    image: "/MapImages/DuelingGrounds.webp",
                                    title: "[RELEASE] Dueling Grounds",
                                },
                            ].map((step, i) => (
                                <motion.div 
                                    key={i} 
                                    variants={item}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <GameCard
                                        title={step.title}
                                        image={step.image}
                                        features={["Auto Farm", "ESP", "Walk Speed"]}
                                        onCopy={handleCopy}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    )
}
