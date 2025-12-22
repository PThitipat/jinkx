"use client"

import { motion } from "framer-motion"
import Script from "next/script"
import { useState, useEffect, Component, ReactNode } from "react"
import Navbar from "@/components/Nav"
import { KeyCard } from "@/components/key-card"
import { StreamModal } from "@/components/stream-modal"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: (error: Error, reset: () => void) => ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: (error: Error, reset: () => void) => ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset)
      }
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
            <p className="text-white/70">{this.state.error.message}</p>
            <button
              onClick={this.reset}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function KeySystemPage() {
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        // แสดง modal เมื่อเข้ามาหน้า key-system
        setShowModal(true)
    }, [])

    return (
        <ErrorBoundary>
            <div className="flex min-h-[100dvh] flex-col bg-background">
                {/* Monetag is scoped to this page only */}
                <Script
                    src="https://fpyf8.com/88/tag.min.js"
                    data-zone="177335"
                    data-cfasync="false"
                    strategy="afterInteractive"
                    onError={(e) => {
                        console.error("Script load error:", e)
                    }}
                />
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
                                Get Freemium Access to <span className="brand-jinkx">JinkX</span>
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
        </ErrorBoundary>
    )
}

