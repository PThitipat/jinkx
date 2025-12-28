"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Check,
    ArrowRight,
    Shield,
    Zap,
    Users,
    Heart,
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
            .catch(() => {
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

    const fadeUp = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 },
    }


    return (
        <div className="flex min-h-[100dvh] flex-col bg-background">
            <Navbar />

            <main className="flex-1 pt-16 md:pt-20" id="home">
                {/* Hero Section */}
                <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
                    </div>

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="grid lg:grid-cols-2">
                            {/* Left: Floating logo only; buttons stay static */}
                            <div className="flex flex-col items-center justify-center gap-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: [-12, 12, -12],
                                    }}
                                    transition={{
                                        opacity: { duration: 0.4 },
                                        scale: { duration: 0.4 },
                                        y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                                    }}
                                >
                                    <Image
                                        src="https://jinkx.pro/Logo.png"
                                        alt="JinkX Logo"
                                        width={320}
                                        height={320}
                                        className="w-64 h-64 md:w-72 md:h-72 object-contain drop-shadow-2xl"
                                        priority
                                    />
                                </motion.div>
                                <div className="flex flex-row flex-wrap justify-center gap-3 pb-4">
                                    <motion.div
                                        initial="hidden"
                                        animate="show"
                                        variants={fadeUp}
                                        transition={{ duration: 0.4, delay: 0.05 }}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button asChild variant="outline" className="text-base px-6">
                                            <a
                                                href="https://discord.gg/JinkX"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2"
                                            >
                                                Join Discord
                                            </a>
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        initial="hidden"
                                        animate="show"
                                        variants={fadeUp}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button asChild variant="outline" className="text-base px-6">
                                            <Link href="/key-system" className="flex items-center gap-2">
                                                Get Key
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right: JinkX Map Support list (no outer card) */}
                            <motion.div
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={container}
                                className="space-y-4 w-full max-w-xl"
                            >
                                <motion.div variants={item} className="flex items-center gap-3">
                                    <h3 className="text-2xl font-bold text-white"><span className="brand-jinkx">JinkX</span> Map Support</h3>
                                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                                        Live
                                    </Badge>
                                </motion.div>
                                <div className="relative">
                                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background via-background/35 to-transparent pointer-events-none"></div>
                                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/35 to-transparent pointer-events-none"></div>
                                    <div
                                        className="space-y-3 overflow-y-auto pr-2 no-scrollbar"
                                        style={{
                                            maxHeight: "360px",
                                            scrollbarWidth: "none",
                                            msOverflowStyle: "none",
                                        }}
                                    >
                                        {[
                                            { title: "Fish It!", image: "/MapImages/FishIt.webp" },
                                            { title: "[🎉] Raise Animals", image: "/MapImages/raise_animals.png" },
                                            { title: "[RELEASE] Dueling Grounds", image: "/MapImages/DuelingGrounds.webp" },
                                            { title: "Arise Ragnarok [🔓 Release ]", image: "/MapImages/new_arise_ragnarok.webp" },
                                            { title: "Violent District", image: "/MapImages/violence_district.webp" },
                                        ].map((game, idx) => (
                                            <motion.div
                                                key={idx}
                                                variants={item}
                                                className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3 shadow-lg"
                                            >
                                                <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-black/40 border border-white/10">
                                                    <Image
                                                        src={game.image}
                                                        alt={game.title}
                                                        fill
                                                        sizes="120px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white font-medium text-sm">{game.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="relative flex h-2.5 w-2.5">
                                                            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                                        </span>
                                                        <span className="text-xs text-white/70">Online</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Why Choose JinkX Section */}
                <section className="pt-4 pb-12" id="features">
                    <div className="container mx-auto px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Why Choose <span className="brand-jinkx">JinkX</span>?
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Stable & Secure */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white/5 border border-white/10 rounded p-6 backdrop-blur-sm hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded bg-white/5 border border-white/10">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        Stable & Secure
                                    </h3>
                                </div>
                                <p className="text-white/70 text-sm">
                                    Developed with stability and safety in mind for a smooth experience.
                                </p>
                            </motion.div>

                            {/* Weekly Updates */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white/5 border border-white/10 rounded p-6 backdrop-blur-sm hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded bg-white/5 border border-white/10">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        Weekly Updates
                                    </h3>
                                </div>
                                <p className="text-white/70 text-sm">
                                    New features and game support added every single week.
                                </p>
                            </motion.div>

                            {/* Active Community */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-white/5 border border-white/10 rounded p-6 backdrop-blur-sm hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded bg-white/5 border border-white/10">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        Active Community
                                    </h3>
                                </div>
                                <p className="text-white/70 text-sm">
                                    Join our active community on Discord for help and support.
                                </p>
                            </motion.div>

                            {/* Customer First */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="bg-white/5 border border-white/10 rounded p-6 backdrop-blur-sm hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded bg-white/5 border border-white/10">
                                        <Heart className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        Customer First
                                    </h3>
                                </div>
                                <p className="text-white/70 text-sm">
                                    Built with care and our users' needs as the top priority.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Discord Widget */}
                <section className="py-4" id="community">
                    <div className="container mx-auto px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-sm shadow-lg"
                        >
                            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                                <iframe
                                    src="https://discord.com/widget?id=1412401719996055584&theme=dark"
                                    width="100%"
                                    height="450"
                                    frameBorder="0"
                                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                                    className="w-full"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    )
}
