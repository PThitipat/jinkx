"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/Nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Mail, HelpCircle, FileText } from "lucide-react"

export default function SupportPage() {
    const supportOptions = [
        {
            icon: <MessageCircle className="w-6 h-6" />,
            title: "Discord Support",
            description: "Join our Discord server for real-time help and community support",
            action: "Join Discord",
            href: "https://discord.gg/XAfp5RsQ4M",
        },
        {
            icon: <HelpCircle className="w-6 h-6" />,
            title: "FAQ",
            description: "Find answers to commonly asked questions",
            action: "View FAQ",
            href: "#",
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: "Documentation",
            description: "Read our comprehensive guides and tutorials",
            action: "View Docs",
            href: "#",
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Contact Us",
            description: "Get in touch with our support team",
            action: "Contact",
            href: "#",
        },
    ]

    return (
        <div className="flex min-h-[100dvh] flex-col bg-background">
            <Navbar />
            
            <main className="flex-1 pt-16 md:pt-20">
                <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
                    {/* Background Effects */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
                    </div>

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-5xl mx-auto"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-center mb-16"
                            >
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Support
                                </h1>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    We're here to help you get the most out of <span className="brand-jinkx">JinkX</span>
                                </p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {supportOptions.map((option, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    >
                                        <Card className="h-full border border-border/50 bg-card/50 backdrop-blur-md hover:bg-card/70 transition-all duration-300 hover:shadow-lg">
                                            <CardContent className="p-6 flex flex-col h-full">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                                        {option.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                                                        <p className="text-muted-foreground text-sm">{option.description}</p>
                                                    </div>
                                                </div>
                                                <a href={option.href} target={option.href.startsWith("http") ? "_blank" : undefined} rel={option.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                                                    <Button className="w-full mt-auto" variant="outline">
                                                        {option.action}
                                                    </Button>
                                                </a>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    )
}

