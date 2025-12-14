"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Navbar from "@/components/Nav"
import { KeyCard } from "@/components/key-card"
import { StreamModal } from "@/components/stream-modal"

export default function KeySystemPage() {
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        // แสดง modal เมื่อเข้ามาหน้า key-system
        setShowModal(true)
    }, [])

    return (
        <div className="flex min-h-[100dvh] flex-col bg-background">
            <Navbar />
            
            <StreamModal isOpen={showModal} onClose={() => setShowModal(false)} />
            
            <main className="flex-1 pt-16 md:pt-20">
                <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
                    {/* Background Effects */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>
                    </div>

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-center mb-12"
                            >
                                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-white">
                                Get Freemium Access to JinkX
                                </h1>
                                <p className="text-md text-white/70 dark:text-white/70 max-w-2xl mx-auto">
                                Generate your 4-hour access key instantly. You can keep up to 5 active keys at the same time for maximum convenience and flexibility.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
                                className="flex justify-center"
                            >
                                <KeyCard
                                    title="Key Systems"
                                    description="Press the button to generate your access key."
                                    features={[
                                        "Click 12 times to unlock phase 2",
                                        "Click 2 times more to generate the key",
                                        "Key will expire in 4 hours",
                                    ]}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    )
}

