"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
    Menu,
    X,
} from "lucide-react"

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navItems = [
        { href: "/", label: "Home" },
        { href: "/executors", label: "Executors" },
        { href: "/key-system", label: "Key Systems" },
        { href: "https://www.youtube.com/@JinkX-Script", label: "Showcases", external: true },
        { href: "/donate", label: "Donate" },
        { href: "/terms", label: "Terms" },
    ]
    
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
                isScrolled 
                    ? "bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm" 
                    : "bg-transparent"
            }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 md:h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative w-8 h-8 md:w-10 md:h-10"
                        >
                            <img 
                                src="/favicon.ico" 
                                alt="JinkX Logo" 
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                        <motion.span
                            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#ff3b3b] via-[#ff5c5c] to-[#ff7b7b] bg-clip-text text-transparent group-hover:from-[#ff4a4a] group-hover:via-[#ff6a6a] group-hover:to-[#ff8a8a] transition-all"
                            whileHover={{ scale: 1.05 }}
                        >
                            JinkX
                        </motion.span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                            >
                                <Link
                                    href={item.href}
                                    target={item.external ? "_blank" : undefined}
                                    rel={item.external ? "noopener noreferrer" : undefined}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                                >
                                    {item.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Desktop CTA Button */}
                    <div className="hidden md:flex items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <a href="https://discord.gg/XAfp5RsQ4M" target="_blank" rel="noopener noreferrer">
                                <Button 
                                    size="lg" 
                                    className="h-10 px-6 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium transition-all shadow-lg hover:shadow-xl"
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
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="h-10 w-10"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md border-b border-border/40"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={item.href}
                                        target={item.external ? "_blank" : undefined}
                                        rel={item.external ? "noopener noreferrer" : undefined}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: navItems.length * 0.05 }}
                                className="pt-2 border-t border-border/40"
                            >
                                <a 
                                    href="https://discord.gg/XAfp5RsQ4M" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Button 
                                        size="lg" 
                                        className="w-full h-12 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium"
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
