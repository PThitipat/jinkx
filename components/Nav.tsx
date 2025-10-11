import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
    Menu,
    X,
    Moon,
    Sun,
} from "lucide-react"
export default function Navbar() {
    
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
        if (window.scrollY > 10) {
            setIsScrolled(true)
        } else {
            setIsScrolled(false)
        }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <header className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"}`}>
            <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
                <div className="size-8 rounded-lg flex items-center justify-center text-primary-foreground">
                    <img src="/favicon.ico" alt="" />
                </div>
                <span>JinkX</span>
            </div>
            <nav className="hidden md:flex gap-8">
                <Link href="#home" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Home
                </Link>
                <Link href="#tos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Term of Services
                </Link>
                <Link href="#getkey" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Key Systems
                </Link>
            </nav>
            <div className="hidden md:flex gap-4 items-center">
                {/* <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
                <span className="sr-only">Toggle theme</span>
                </Button> */}
                <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base">
                    Login Discord
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="tabler-icon tabler-icon-brand-discord-filled size-5 mr-2"><path d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z"></path></svg>
                </Button>
            </div>
            <div className="flex items-center gap-4 md:hidden">
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                <span className="sr-only">Toggle menu</span>
                </Button>
            </div>
            </div>
            {/* Mobile menu */}
            {mobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
            >
                <div className="container py-4 flex flex-col gap-4">
                <Link href="#home" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Home
                </Link>
                <Link href="#tos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Term of Services
                </Link>
                <Link href="#getkey" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Key System
                </Link>
                <div className="flex flex-col gap-2 pt-2 border-t">
                    <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base">
                    Login Discord
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="tabler-icon tabler-icon-brand-discord-filled size-5 mr-2"><path d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z"></path></svg>
                    </Button>
                </div>
                </div>
            </motion.div>
            )}
        </header>
    )
}
