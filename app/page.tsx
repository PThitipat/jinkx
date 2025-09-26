"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import {
    Check,
    ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/Nav";
import { HeartHandshake } from "@/components/HeartHandshake";
import { Activity } from "@/components/Activity";
import { Users } from "@/components/Users";
import { GameCard } from "@/components/game-card";

export default function LandingPage() {

    const handleCopy = () => {
        console.log("Game copied!")
    }

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

    const features = [
        {
            title: "Smart Automation",
            description: "Automate tasks effortlessly with intelligent tools.",
            icon: <Users className="size-5" />,
        },
        {
            title: "Premium Quality",
            description: "Enjoy top-tier performance and reliability every time.",
            icon: <Activity className="size-5" />,
        },
        {
            title: "Customer Support",
            description: "Get fast, friendly help whenever you need it.",
            icon: <HeartHandshake className="size-5" />,
        },
    ];

    return (
        <div className="flex min-h-[100dvh] flex-col">
            <Navbar></Navbar>
            <main className="flex-1" id="#home">
                {/* Hero Section */}
                <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
                <div className="container px-4 md:px-6 relative">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-12"
                    >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 
                    bg-clip-text text-transparent 
                    bg-gradient-to-r from-black to-red-700">
                    JinkX
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        The all-in-one platform that helps teams collaborate, automate, and deliver exceptional results.
                        Streamline your processes and focus on what matters most.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base border border-red-700">
                        Join Discord
                        <ArrowRight className="ml-2 size-4" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                        <Check className="size-4 text-primary" />
                        <span>100% Free script</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <Check className="size-4 text-primary" />
                        <span>24 hrs trial</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <Check className="size-4 text-primary" />
                        <span>Undetected</span>
                        </div>
                    </div>
                    </motion.div>

                    <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative mx-auto max-w-5xl"
                    >
                    <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                        <Image
                        src="https://img5.pic.in.th/file/secure-sv1/image2c7a0b70af9677c3.png"
                        width={1280}
                        height={720}
                        alt="SaaSify dashboard"
                        className="w-full h-auto"
                        priority
                        />
                        <div className=""></div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
                    <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
                    </motion.div>
                </div>
                </section>

                {/* Features Section */}
                <section id="About Us" className="w-full py-20 md:py-32">
                <div className="container px-4 md:px-6">
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
                    >
                    <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                        About Us
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
                    <p className="max-w-[800px] text-muted-foreground md:text-lg">
                        Our comprehensive platform provides all the tools you need to streamline your workflow, boost
                        productivity, and achieve your goals.
                    </p>
                    </motion.div>

                    <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                    {features.map((feature, i) => (
                        <motion.div key={i} variants={item}>
                        <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                            <CardContent className="p-6 flex flex-col h-full">
                            <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                        </motion.div>
                    ))}
                    </motion.div>
                </div>
                </section>

                {/* How It Works Section */}
                <section className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

                    <div className="container px-4 md:px-6 relative">
                        <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
                        >
                        <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                            Roblox Map Support
                        </Badge>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-4 md:gap-6 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

                        {[
                            {
                                image: "/MapImages/99Night.png",
                                title: "[🌋] 99 Nights in the Forest 🔦",
                            },
                            {
                                image: "/MapImages/FishIt.webp",
                                title: "Fish It! 🐟",
                            },
                            {
                                image: "/MapImages/Plant_vs_Brainrot.webp",
                                title: "[🌈] Plants Vs Brainrots 🌻",
                            },
                        ].map((step, i) => (
                            <motion.div key={i} variants={item}>
                            <GameCard
                                title={step.title}
                                image={step.image}
                                features={["Survival", "Crafting", "Monster ESP"]}
                                onCopy={handleCopy}
                            />
                            </motion.div>
                        ))}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    )
}
