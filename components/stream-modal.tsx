"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface StreamModalProps {
  isOpen: boolean
  onClose: () => void
}

export function StreamModal({ isOpen, onClose }: StreamModalProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isWaiting, setIsWaiting] = useState(true)
  const [isDelaying, setIsDelaying] = useState(false)

  const DirectLink = [
    "https://otieu.com/4/10024793",
    "https://otieu.com/4/9932455",
    "https://otieu.com/4/9932451",
    "https://otieu.com/4/9932452",
    "https://otieu.com/4/9932453",
    "https://otieu.com/4/9932460",
    "https://otieu.com/4/9932454",
    "https://otieu.com/4/9932456",
    "https://otieu.com/4/9932457",
    "https://otieu.com/4/9932459",
    "https://otieu.com/4/9932458",
  ]

  // สุ่มลิงก์ใหม่ทุกครั้งที่กด X
  const getRandomUrl = () => {
    const idx = Math.floor(Math.random() * DirectLink.length)
    return DirectLink[idx]
  }

  // Countdown timer 15 วินาที
  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1
        if (newTime >= 15) {
          setIsWaiting(false)
          return 15
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  // Reset เมื่อเปิด modal ใหม่
  useEffect(() => {
    if (isOpen) {
      setTimeElapsed(0)
      setIsWaiting(true)
    }
  }, [isOpen])

  const handleCloseClick = () => {
    if (isDelaying) return

    if (isWaiting) {
      // ถ้ายังไม่ครบ 15 วินาที ให้เปิด DirectLink แทน (สุ่มใหม่ทุกครั้ง)
      setIsDelaying(true)
      const url = getRandomUrl()
      window.open(url, "_blank", "noopener,noreferrer")
      toast.info("Opening link...", {
        description: "Please wait 15 seconds to close"
      })
      setTimeout(() => {
        setIsDelaying(false)
      }, 1000) // delay 1 วินาที
    } else {
      // ถ้าครบ 15 วินาทีแล้ว ให้ปิดได้
      onClose()
      toast.success("Stream closed")
    }
  }

  const handleWatch = () => {
    // เปิดลิงก์ดู stream
    window.open("https://www.youtube.com/watch?v=-OEhymfC-XM", "_blank", "noopener,noreferrer")
    toast.success("Opening stream...", {
      description: "Enjoy watching!"
    })
  }

  const remainingTime = 15 - timeElapsed
  const progressPercentage = (timeElapsed / 15) * 100

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="stream-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl"
          >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Play className="w-4 h-4 text-green-400 fill-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">JinkX Stream</h2>
            </div>
            <button
              onClick={handleCloseClick}
              disabled={isDelaying}
              className={`p-2 rounded-lg transition-all ${
                isDelaying
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/10 cursor-pointer"
              }`}
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {/* Promotional Text */}
          <div className="p-4 border-b border-white/10">
            <p className="text-sm text-white/80 text-center">
              Watch the livestream for a chance to win a FREE 7-Day Key! 🎁 Keys are given away every hour during the stream!
            </p>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black/40 overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/-OEhymfC-XM?autoplay=1&mute=1&controls=1&loop=1&playlist=-OEhymfC-XM"
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title="JinkX Stream"
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            {isWaiting ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Waiting {remainingTime} seconds...</span>
                  <span className="text-white/40">{timeElapsed}/15</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 h-11 bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
                <Button
                  onClick={handleWatch}
                  className="flex-1 h-11 bg-green-500 hover:bg-green-400 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Watch
                </Button>
              </div>
            )}
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

