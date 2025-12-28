"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Nav"

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background overflow-x-hidden w-full">
      <Navbar />
      
      <main className="flex-1 pt-20 md:pt-24 pb-12 flex items-center justify-center px-4 sm:px-6">
        <motion.div
          className="container mx-auto max-w-4xl w-full relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animated Background Gradient */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full max-h-[600px] pointer-events-none"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-red-500/30 via-red-600/20 to-red-500/30 blur-3xl" />
          </motion.div>

          <div className="relative z-10">
            {/* 404 Number Section */}
            <motion.div
              variants={numberVariants}
              className="text-center mb-6 md:mb-8"
            >
              <div className="relative inline-block">
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 -z-10"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-r from-red-500/40 to-red-600/40 blur-3xl rounded-full" />
                </motion.div>
                
                <h1 className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[14rem] font-black bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent leading-none select-none">
                  404
                </h1>
              </div>
            </motion.div>

            {/* Title Section */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-4 md:mb-6"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
                Page Not Found
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto rounded-full" />
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-white/70 text-base sm:text-lg md:text-xl text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4 leading-relaxed"
            >
              Oops! The page you&apos;re looking for seems to have wandered off into the digital void. 
              Don&apos;t worry, let&apos;s get you back on track.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 md:mb-12 px-4"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-lg px-6 md:px-8 py-6 md:py-7 text-base md:text-lg font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300"
              >
                <Link href="/" className="flex items-center gap-2 md:gap-3">
                  <Home className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Back to Home</span>
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border-white/20 hover:border-white/30 rounded-lg px-6 md:px-8 py-6 md:py-7 text-base md:text-lg font-semibold transition-all duration-300"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Go Back</span>
                </div>
              </Button>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto px-4"
            >
              <Link
                href="/"
                className="group p-4 md:p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-red-500/10 group-hover:bg-red-500/20 rounded-lg transition-colors">
                    <Home className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm md:text-base mb-1">Home</h3>
                    <p className="text-white/60 text-xs md:text-sm">Return to homepage</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/store"
                className="group p-4 md:p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-red-500/10 group-hover:bg-red-500/20 rounded-lg transition-colors">
                    <Search className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm md:text-base mb-1">Store</h3>
                    <p className="text-white/60 text-xs md:text-sm">Browse our products</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Footer Help Text */}
            <motion.div
              variants={itemVariants}
              className="mt-8 md:mt-12 text-center px-4"
            >
              <p className="text-white/50 text-sm md:text-base">
                Need assistance?{" "}
                <Link href="/" className="text-red-400 hover:text-red-300 transition-colors underline underline-offset-4">
                  Contact us
                </Link>
                {" "}or visit our{" "}
                <a
                  href="https://discord.gg/XAfp5RsQ4M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 transition-colors underline underline-offset-4"
                >
                  Discord
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
