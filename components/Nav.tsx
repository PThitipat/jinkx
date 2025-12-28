"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import {
    Menu,
    X,
    LogIn,
    User2,
    History,
    ShoppingBag,
    LogOut,
    Coins,
    CreditCard,
    FileCode,
    RefreshCw,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
    const { data: session } = useSession()
    const router = useRouter()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Helper function to get role text color
    const getRoleTextColor = (role: string) => {
        switch (role) {
            case "Member":
                return "text-green-400"
            case "Premium":
                return "text-yellow-400"
            case "Exclusive":
                return "text-purple-400"
            case "Sovereign":
                return "text-orange-400"
            case "Admin":
                return "text-red-400"
            case "Owner":
                return "" // Owner uses animated gradient
            default:
                return "text-green-400"
        }
    }

    // Helper function to get role badge styling (glassmorphism)
    const getRoleBadgeStyle = (role: string) => {
        switch (role) {
            case "Member":
                return "bg-green-500/10 backdrop-blur-sm border-green-500/30 text-green-400"
            case "Premium":
                return "bg-yellow-500/10 backdrop-blur-sm border-yellow-500/30 text-yellow-400"
            case "Exclusive":
                return "bg-purple-500/10 backdrop-blur-sm border-purple-500/30 text-purple-400"
            case "Sovereign":
                return "bg-orange-500/10 backdrop-blur-sm border-orange-500/30 text-orange-400"
            case "Admin":
                return "bg-red-500/10 backdrop-blur-sm border-red-500/30 text-red-400"
            case "Owner":
                return "bg-white/10 backdrop-blur-sm border-white/20"
            default:
                return "bg-green-500/10 backdrop-blur-sm border-green-500/30 text-green-400"
        }
    }

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
        { href: "/store", label: "Store" },
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
                        {navItems
                            .filter(item => !(session?.user && item.label === "Donate"))
                            .map((item, index) => (
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

                    {/* Desktop CTA / Profile */}
                    <div className="hidden md:flex items-center gap-3">
                        {session?.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 rounded border border-white/20 bg-black/40 px-2 py-1 hover:bg-black/60 transition">
                                        <div className="h-8 w-8 rounded-full overflow-hidden bg-white/10">
                                            <img
                                                src={(session.user as any).image || "/favicon.ico"}
                                                alt={session.user.name || "Profile"}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col items-start mr-2">
                                            <span className="text-xs text-white/60">Available Points</span>
                                            <span className="text-sm font-semibold text-green-400 flex items-center gap-1">
                                                <Coins className="w-3 h-3" />
                                                {Number((session.user as any).points ?? 0).toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </span>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-72 bg-black/95 text-white border border-white/10 backdrop-blur-2xl rounded-xl shadow-xl p-0"
                                >
                                    <div className="px-4 pt-4 pb-3 border-b border-white/10 flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full overflow-hidden bg-white/10">
                                            <img
                                                src={(session.user as any).image || "/favicon.ico"}
                                                alt={session.user.name || "Profile"}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            {(session.user as any).role === "Owner" ? (
                                                <motion.span
                                                    className="text-sm font-semibold"
                                                    style={{
                                                        background: "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)",
                                                        backgroundSize: "200% 100%",
                                                        WebkitBackgroundClip: "text",
                                                        WebkitTextFillColor: "transparent",
                                                        backgroundClip: "text",
                                                    }}
                                                    animate={{
                                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                >
                                                    {session.user.name || "User"}
                                                </motion.span>
                                            ) : (
                                                <span className={`text-sm font-semibold ${getRoleTextColor((session.user as any).role || "Member")}`}>
                                                    {session.user.name || "User"}
                                                </span>
                                            )}
                                            {(session.user as any).role === "Owner" ? (
                                                <Badge 
                                                    className={`text-xs px-2 py-0.5 hover:!bg-white/10 hover:!opacity-100 ${getRoleBadgeStyle((session.user as any).role || "Member")}`}
                                                >
                                                    <motion.span
                                                        style={{
                                                            background: "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)",
                                                            backgroundSize: "200% 100%",
                                                            WebkitBackgroundClip: "text",
                                                            WebkitTextFillColor: "transparent",
                                                            backgroundClip: "text",
                                                        }}
                                                        animate={{
                                                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                                        }}
                                                        transition={{
                                                            duration: 3,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                        }}
                                                    >
                                                        Owner
                                                    </motion.span>
                                                </Badge>
                                            ) : (
                                                <Badge 
                                                    className={`text-xs px-2 py-0.5 hover:!bg-transparent hover:!opacity-100 ${getRoleBadgeStyle((session.user as any).role || "Member")}`}
                                                >
                                                    {(session.user as any).role || "Member"}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="m-3 rounded bg-green-900/40 border border-green-500/40 px-3 py-2 flex items-center justify-between">
                                        <span className="text-xs text-white/80">
                                            Available Points
                                        </span>
                                        <span className="text-sm font-semibold text-green-400 flex items-center gap-1">
                                            <Coins className="w-3 h-3" />
                                            {Number((session.user as any).points ?? 0).toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>

                                    <div className="mx-3 mb-3 rounded bg-yellow-900/40 border border-yellow-500/40 px-3 py-2 flex items-center justify-between">
                                        <span className="text-xs text-white/80">
                                            Reset Token
                                        </span>
                                        <span className="text-sm font-semibold text-yellow-400 flex items-center gap-1">
                                            <RefreshCw className="w-3 h-3" />
                                            {Number((session.user as any).reset_token ?? 0)}
                                        </span>
                                    </div>

                                    <DropdownMenuItem
                                        className="px-4 py-2.5 flex items-center gap-2 cursor-pointer"
                                        onClick={() => router.push("/topup")}
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Topup
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="px-4 py-2.5 flex items-center gap-2 cursor-pointer"
                                        onClick={() => router.push("/script-manager")}
                                    >
                                        <FileCode className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Script Manager
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="px-4 py-2.5 flex items-center gap-2 cursor-pointer"
                                        onClick={() => router.push("/history")}
                                    >
                                        <History className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            History
                                        </span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-white/10 my-1" />

                                    <DropdownMenuItem
                                        className="px-4 py-2.5 flex items-center gap-2 cursor-pointer text-red-400 hover:text-red-300"
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Sign Out
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.35 }}
                                >
                                    <Button
                                        variant="outline"
                                        className="h-10 px-4 rounded border-white/30 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white text-sm font-medium flex items-center gap-2"
                                        onClick={() => signIn("discord")}
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Login
                                    </Button>
                                </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <a href="https://discord.gg/XAfp5RsQ4M" target="_blank" rel="noopener noreferrer">
                                <Button 
                                            variant="outline"
                                            className="h-10 px-4 rounded border-[#5865F2]/60 bg-[#5865F2]/80 hover:bg-[#4752C4] text-white font-medium transition-all shadow-lg hover:shadow-xl text-sm flex items-center gap-2"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="20" 
                                        height="20" 
                                        viewBox="0 0 24 24" 
                                        fill="currentColor" 
                                                className="w-4 h-4"
                                    >
                                        <path d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l-.005 .15a2 2 0 1 0 1.995 -2.15z"></path>
                                    </svg>
                                            Discord
                                </Button>
                            </a>
                        </motion.div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu + Auth */}
                    <div className="flex items-center gap-2 md:hidden">
                        {session?.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 rounded border border-white/20 bg-black/40 px-2 py-1 hover:bg-black/60 transition">
                                        <div className="h-8 w-8 rounded-full overflow-hidden bg-white/10">
                                            <img
                                                src={(session.user as any).image || "/favicon.ico"}
                                                alt={session.user.name || "Profile"}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-72 bg-black/95 text-white border border-white/10 backdrop-blur-2xl rounded-xl shadow-xl p-0"
                                >
                                    <div className="px-4 pt-4 pb-3 border-b border-white/10 flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full overflow-hidden bg-white/10">
                                            <img
                                                src={(session.user as any).image || "/favicon.ico"}
                                                alt={session.user.name || "Profile"}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            {(session.user as any).role === "Owner" ? (
                                                <motion.span
                                                    className="text-sm font-semibold"
                                                    style={{
                                                        background: "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)",
                                                        backgroundSize: "200% 100%",
                                                        WebkitBackgroundClip: "text",
                                                        WebkitTextFillColor: "transparent",
                                                        backgroundClip: "text",
                                                    }}
                                                    animate={{
                                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                >
                                                    {session.user.name || "User"}
                                                </motion.span>
                                            ) : (
                                                <span className={`text-sm font-semibold ${getRoleTextColor((session.user as any).role || "Member")}`}>
                                                    {session.user.name || "User"}
                                                </span>
                                            )}
                                            {(session.user as any).role === "Owner" ? (
                                                <Badge 
                                                    className={`text-xs px-2 py-0.5 hover:!bg-white/10 hover:!opacity-100 ${getRoleBadgeStyle((session.user as any).role || "Member")}`}
                                                >
                                                    <motion.span
                                                        style={{
                                                            background: "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)",
                                                            backgroundSize: "200% 100%",
                                                            WebkitBackgroundClip: "text",
                                                            WebkitTextFillColor: "transparent",
                                                            backgroundClip: "text",
                                                        }}
                                                        animate={{
                                                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                                        }}
                                                        transition={{
                                                            duration: 3,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                        }}
                                                    >
                                                        Owner
                                                    </motion.span>
                                                </Badge>
                                            ) : (
                                                <Badge 
                                                    className={`text-xs px-2 py-0.5 hover:!bg-transparent hover:!opacity-100 ${getRoleBadgeStyle((session.user as any).role || "Member")}`}
                                                >
                                                    {(session.user as any).role || "Member"}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="m-3 rounded bg-green-900/40 border border-green-500/40 px-3 py-2 flex items-center justify-between">
                                        <span className="text-xs text-white/80">
                                            Available Points
                                        </span>
                                        <span className="text-sm font-semibold text-green-400 flex items-center gap-1">
                                            <Coins className="w-3 h-3" />
                                            {Number((session.user as any).points ?? 0).toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>

                                    <div className="mx-3 mb-3 rounded bg-yellow-900/40 border border-yellow-500/40 px-3 py-2 flex items-center justify-between">
                                        <span className="text-xs text-white/80">
                                            Reset Token
                                        </span>
                                        <span className="text-sm font-semibold text-yellow-400 flex items-center gap-1">
                                            <RefreshCw className="w-3 h-3" />
                                            {Number((session.user as any).reset_token ?? 0)}
                                        </span>
                                    </div>

                                    <DropdownMenuItem
                                        className="px-4 py-2.5 flex items-center gap-2 cursor-pointer"
                                        onClick={() => router.push("/topup")}
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Topup
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="px-4 py-2.5 flex items-center gap-2 cursor-pointer"
                                        onClick={() => router.push("/script-manager")}
                                    >
                                        <FileCode className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Script Manager
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="px-4 py-2.5 flex items-center gap-2 cursor-pointer"
                                        onClick={() => router.push("/history")}
                                    >
                                        <History className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            History
                                        </span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="px-4 py-2.5 flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300"
                                        onClick={() => {
                                            // TODO: Implement reset token functionality
                                            console.log("Reset Token clicked")
                                        }}
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Reset Token
                                        </span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-white/10 my-1" />

                                    <DropdownMenuItem
                                        className="px-4 py-2.5 flex items-center gap-2 cursor-pointer text-red-400 hover:text-red-300"
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Sign Out
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-3 rounded border-white/30 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white text-xs font-medium flex items-center gap-1"
                                onClick={() => signIn("discord")}
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </Button>
                        )}

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
                            {navItems
                                .filter(item => !(session?.user && item.label === "Donate"))
                                .map((item, index) => (
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
                                        className="w-full h-12 rounded hover:bg-[#4752C4] text-white font-medium"
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
                                        Discord
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
