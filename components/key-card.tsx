"use client"

import { Button } from "@/components/ui/button"
import { KeyRound, LinkIcon, Copy, Loader2, CheckCircle2, Clock, Trash2, Check, Plus } from "lucide-react"
import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface KeyCardProps {
  title: string
  description: string
  features: string[]
  iconColor?: "yellow" | "purple"
  buttonColor?: "yellow" | "purple"
}

interface StoredKey {
  key: string
  createdAt: number
  expiresAt: number
  id: string
}

const MAX_KEYS = 5
const KEY_EXPIRY_HOURS = 4
const STORAGE_KEY = "jinkx_active_keys"

export function KeyCard({
  title,
  description,
  features,
  iconColor = "yellow",
  buttonColor = "yellow",
}: KeyCardProps) {
  // ✅ ตัวแปรสำหรับจำนวนคลิก - แก้ไขได้ง่าย
  const PHASE1_CLICKS = 12
  const PHASE2_CLICKS = 2
  const TOTAL_CLICKS = PHASE1_CLICKS + PHASE2_CLICKS

  const [phase1Clicks, setPhase1Clicks] = useState(0)
  const [phase2Clicks, setPhase2Clicks] = useState(0)
  const [isDelaying, setIsDelaying] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [CreatedKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null) // เวลาเหลือในวินาที
  const [storedKeys, setStoredKeys] = useState<StoredKey[]>([])
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null)

  // Countdown timer สำหรับ 4 ชั่วโมง (14400 วินาที)
  useEffect(() => {
    if (!CreatedKey || timeLeft === null) return

    if (timeLeft <= 0) {
      setTimeLeft(0)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [CreatedKey, timeLeft])

  // เริ่ม countdown เมื่อ key ถูกสร้าง
  useEffect(() => {
    if (CreatedKey && timeLeft === null) {
      setTimeLeft(4 * 60 * 60) // 4 ชั่วโมง = 14400 วินาที
    }
  }, [CreatedKey, timeLeft])

  // Update stored keys countdown timers and remove expired keys
  useEffect(() => {
    if (storedKeys.length === 0) return

    const timer = setInterval(() => {
      setStoredKeys(prevKeys => {
        const now = Date.now()
        const activeKeys = prevKeys.filter(key => key.expiresAt > now)
        const expiredCount = prevKeys.length - activeKeys.length
        
        if (expiredCount > 0) {
          saveKeysToStorage(activeKeys)
          // Show toast for expired keys
          if (expiredCount === 1) {
            toast.info("1 key has expired and been removed", {
              description: `${activeKeys.length} active key${activeKeys.length !== 1 ? 's' : ''} remaining`
            })
          } else {
            toast.info(`${expiredCount} keys have expired and been removed`, {
              description: `${activeKeys.length} active key${activeKeys.length !== 1 ? 's' : ''} remaining`
            })
          }
        }
        
        return activeKeys
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [storedKeys.length])

  // Load keys from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const keys: StoredKey[] = JSON.parse(stored)
        // Filter out expired keys
        const now = Date.now()
        const activeKeys = keys.filter(key => key.expiresAt > now)
        setStoredKeys(activeKeys)
        // Update localStorage with filtered keys
        if (activeKeys.length !== keys.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(activeKeys))
        }
      }
    } catch (e) {
      console.error("Error loading keys from localStorage:", e)
    }
  }, [])

  // Save keys to localStorage
  const saveKeysToStorage = (keys: StoredKey[]) => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
    } catch (e) {
      console.error("Error saving keys to localStorage:", e)
    }
  }

  // Format time เป็น HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Calculate time left for a stored key
  const getTimeLeft = (expiresAt: number) => {
    const now = Date.now()
    const diff = Math.max(0, Math.floor((expiresAt - now) / 1000))
    return diff
  }

  // Delete a key
  const handleDeleteKey = (keyId: string) => {
    const updatedKeys = storedKeys.filter(k => k.id !== keyId)
    setStoredKeys(updatedKeys)
    saveKeysToStorage(updatedKeys)
    toast.success("Key deleted")
  }

  // Copy a stored key
  const handleCopyStoredKey = async (key: string, keyId: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard API unavailable")
      return
    }

    try {
      await navigator.clipboard.writeText(key)
      setCopiedKeyId(keyId)
      toast.success("Key copied to clipboard!", {
        description: "You can now paste it in your executor"
      })
      setTimeout(() => setCopiedKeyId(null), 2000)
    } catch (e) {
      console.error("Clipboard error:", e)
      toast.error("Failed to copy key", {
        description: "Please try again"
      })
    }
  }

  // Reset state to create a new key
  const handleCreateNewKey = () => {
    setPhase1Clicks(0)
    setPhase2Clicks(0)
    setIsDelaying(false)
    setIsCompleted(false)
    setIsLoading(false)
    setCreatedKey(null)
    setCopied(false)
    setTimeLeft(null)
    toast.info("Ready to create a new key")
  }

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

  // ✅ ล็อกลิงก์สุ่มไว้ ไม่เปลี่ยนทุก render
  const randomUrl = useMemo(() => {
    const idx = Math.floor(Math.random() * DirectLink.length)
    return DirectLink[idx]
  }, [DirectLink.length])

  /** ✅ เปิดลิงก์แบบปลอดภัย */
  const safeOpenLink = (url: string) => {
    if (typeof window !== "undefined") {
      const newTab = window.open(url, "_blank", "noopener,noreferrer")
      if (!newTab) console.warn("Popup blocked or failed to open:", url)
    }
  }

  /** ✅ คัดลอก key แบบปลอดภัย */
  const handleCopyKey = async () => {
    if (!CreatedKey) return
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard API unavailable")
      return
    }

    try {
      await navigator.clipboard.writeText(CreatedKey)
      setCopied(true)
      toast.success("Key copied to clipboard!", {
        description: "You can now paste it in your executor"
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Clipboard error:", e)
      toast.error("Failed to copy key", {
        description: "Please try again"
      })
    }
  }

  /** ✅ คลิกหลายเฟส (Phase1 → Phase2 → สร้าง key) */
  const handleMultiClick = async () => {
    if (isDelaying || isLoading) return

    if (!isCompleted) {
      safeOpenLink(randomUrl)
    }

    // Phase 1: คลิกแรก
    if (phase1Clicks < PHASE1_CLICKS) {
      setPhase1Clicks(prev => prev + 1)
      setIsDelaying(true)
      setTimeout(() => setIsDelaying(false), 800)
      return
    }

    // Phase 2: คลิกถัดไป → เริ่มสร้าง Key
    if (phase2Clicks < PHASE2_CLICKS) {
      const newCount = phase2Clicks + 1
      setPhase2Clicks(newCount)

      if (newCount === PHASE2_CLICKS) {
        setIsCompleted(true)
        setIsLoading(true)

        try {
          const res = await fetch("/api/create-key", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          })

          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = await res.json()
          const key =
            data?.luarmor_data?.user_key ||
            data?.luarmor_data?.message ||
            "ERROR_CREATING_KEY"

          setCreatedKey(key)
          if (key !== "ERROR_CREATING_KEY") {
            // Add key to stored keys
            const now = Date.now()
            const expiresAt = now + (KEY_EXPIRY_HOURS * 60 * 60 * 1000)
            const newKey: StoredKey = {
              key,
              createdAt: now,
              expiresAt,
              id: `${now}-${Math.random().toString(36).substr(2, 9)}`
            }
            
            let updatedKeys = [...storedKeys, newKey]
            
            // If we have more than MAX_KEYS, remove the oldest one
            if (updatedKeys.length > MAX_KEYS) {
              updatedKeys.sort((a, b) => a.createdAt - b.createdAt)
              updatedKeys = updatedKeys.slice(-MAX_KEYS)
              toast.info(`Maximum ${MAX_KEYS} keys reached. Oldest key removed.`)
            }
            
            setStoredKeys(updatedKeys)
            saveKeysToStorage(updatedKeys)
            
            toast.success("Key generated successfully!", {
              description: `You can keep up to ${MAX_KEYS} active keys`
            })
          } else {
            toast.error("Failed to generate key", {
              description: "Please try again later"
            })
          }
        } catch (err) {
          console.error("Error creating key:", err)
          setCreatedKey("ERROR_CREATING_KEY")
          toast.error("Error creating key", {
            description: "Please try again"
          })
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsDelaying(true)
        setTimeout(() => setIsDelaying(false), 800)
      }
    }
  }

  /** ✅ ปรับ UX ของปุ่มให้ feedback ชัด */
  const getButtonText = () => {
    if (isLoading) return "Creating Key..."
    if (CreatedKey) return "Key Created ✅"
    if (phase1Clicks < PHASE1_CLICKS) {
      const remaining = PHASE1_CLICKS - phase1Clicks
      return `Direct Link ${remaining} Click${remaining > 1 ? 's' : ''}`
    }
    if (phase2Clicks < PHASE2_CLICKS) {
      const remaining = PHASE2_CLICKS - phase2Clicks
      return `Direct Link ${remaining} Click${remaining > 1 ? 's' : ''}`
    }
    return `Get Key - ${title}`
  }

  // Calculate progress
  const totalProgress = phase1Clicks + phase2Clicks
  const progressPercentage = (totalProgress / TOTAL_CLICKS) * 100
  const remainingClicks = TOTAL_CLICKS - totalProgress

  const Icon = iconColor === "purple" ? KeyRound : LinkIcon

  return (
    <div className="relative w-full max-w-6xl mx-auto p-6 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border border-white/5 group-hover:border-white/20 group">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Video Section */}
        <div className="flex flex-col space-y-6">
          <div className="relative aspect-video bg-black/40 rounded-lg overflow-hidden border border-white/10">
            <iframe
              src="https://www.youtube.com/embed/S4Chxpyq9XE?autoplay=1&mute=1&controls=1&loop=1&playlist=S4Chxpyq9XE"
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title="JinkX Video"
            />
          </div>
          
          {/* Video Info */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
            <h4 className="text-lg font-semibold text-white">How to Use</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Watch the video to learn about JinkX features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Follow the steps to generate your key</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Your key will be valid for 4 hours</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Key Generation System */}
        <div className="flex flex-col space-y-6">
          {/* Icon & Title */}
          <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-xl flex items-center justify-center bg-white/10 border border-white/10 group-hover:border-white/20 transition-all"
          >
            <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
          </motion.div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md">{description}</p>
        </div>

        {/* Progress Indicator */}
        {!CreatedKey && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80 font-medium">Progress</span>
                <span className="text-white/60">
                  {totalProgress} / {TOTAL_CLICKS} clicks
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"
                />
              </div>
            </div>

            {/* State Indicator */}
            <AnimatePresence mode="wait">
              {phase1Clicks < PHASE1_CLICKS ? (
                <motion.div
                  key="phase1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-sm">{PHASE1_CLICKS - phase1Clicks}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">Phase 1</p>
                    <p className="text-white/60 text-xs">
                      {remainingClicks > 0 ? `${remainingClicks} click${remainingClicks > 1 ? 's' : ''} remaining` : 'Complete!'}
                    </p>
                  </div>
                </motion.div>
              ) : phase2Clicks < PHASE2_CLICKS ? (
                <motion.div
                  key="phase2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">Phase 1 Complete</p>
                    <p className="text-white/60 text-xs">Phase 2: {PHASE2_CLICKS - phase2Clicks} click{PHASE2_CLICKS - phase2Clicks > 1 ? 's' : ''} remaining</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">Generating Key...</p>
                    <p className="text-white/60 text-xs">Please wait</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Instructions */}
        {!CreatedKey && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-5 backdrop-blur-sm">
            <ol className="space-y-3 text-white/80 text-sm">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <span className="font-bold text-yellow-400 shrink-0">{index + 1}.</span>
                  <span className="leading-relaxed">{feature}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        )}

        {/* Main Button */}
        {!CreatedKey && (
          <>
            {!isCompleted ? (
              <Link href={randomUrl} passHref legacyBehavior>
                <motion.a
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center justify-center w-full h-12 rounded-lg font-semibold text-sm transition-all duration-200 select-none shadow-lg hover:shadow-xl ${
                    isDelaying 
                      ? "cursor-not-allowed opacity-70 bg-white/10 text-white/50" 
                      : "bg-yellow-500 hover:bg-yellow-400 text-slate-900"
                  }`}
                  onClick={handleMultiClick}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {getButtonText()}
                </motion.a>
              </Link>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleMultiClick}
                  disabled={isDelaying || isLoading}
                  className={`w-full h-12 rounded-lg font-semibold text-sm transition-all duration-200 select-none shadow-lg hover:shadow-xl ${
                    isLoading
                      ? "bg-blue-500 hover:bg-blue-400 text-white"
                      : isDelaying
                      ? "cursor-not-allowed opacity-70 bg-white/10 text-white/50"
                      : "bg-yellow-500 hover:bg-yellow-400 text-slate-900"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 mr-2" />
                  )}
                  {getButtonText()}
                </Button>
              </motion.div>
            )}
          </>
        )}

        {/* Key Display */}
        {CreatedKey && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col items-center text-center space-y-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center"
            >
              <KeyRound className="w-8 h-8 text-green-400" />
            </motion.div>
            <div className="text-white font-mono break-all text-xs md:text-sm bg-white/5 px-4 py-3 rounded-lg border border-white/10 w-full">
              {CreatedKey}
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <Button
                onClick={handleCopyKey}
                className={`w-full h-11 rounded-lg font-semibold text-sm transition-all shadow-lg hover:shadow-xl ${
                  copied
                    ? "bg-green-500 hover:bg-green-400 text-white"
                    : "bg-yellow-500 hover:bg-yellow-400 text-slate-900"
                }`}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy Key"}
              </Button>
            </motion.div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-white/60" />
              <span className="text-xs text-white/60">Time left:</span>
              <span className="text-sm font-bold text-green-400 font-mono">
                {timeLeft !== null ? formatTime(timeLeft) : '4:00:00'}
              </span>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <Button
                onClick={handleCreateNewKey}
                variant="outline"
                className="w-full h-11 rounded-lg font-semibold text-sm transition-all shadow-lg hover:shadow-xl bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Key
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Stored Keys List */}
        {storedKeys.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Active Keys ({storedKeys.length}/{MAX_KEYS})</h3>
              <p className="text-xs text-white/60">You can keep up to {MAX_KEYS} active keys</p>
            </div>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {storedKeys.map((storedKey, index) => {
                  const keyTimeLeft = getTimeLeft(storedKey.expiresAt)
                  const isExpired = keyTimeLeft <= 0
                  
                  // Don't render expired keys (they should be removed by the timer)
                  if (isExpired) return null
                  
                  return (
                    <motion.div
                      key={storedKey.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, scale: 0.9 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <KeyRound className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <p className="text-xs text-white/60 font-mono truncate">
                              {storedKey.key}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-white/40" />
                            <span className="text-xs text-white/60">Time left:</span>
                            <span className={`text-xs font-bold font-mono ${
                              isExpired ? "text-red-400" : keyTimeLeft < 3600 ? "text-yellow-400" : "text-green-400"
                            }`}>
                              {isExpired ? "Expired" : formatTime(keyTimeLeft)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleCopyStoredKey(storedKey.key, storedKey.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                            title="Copy key"
                          >
                            {copiedKeyId === storedKey.id ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-white/80" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteKey(storedKey.id)}
                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all"
                            title="Delete key"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
