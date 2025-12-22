"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

function LoadingOverlayContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const prevPathRef = useRef<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // ตรวจจับการเปลี่ยน pathname หรือ searchParams
    const currentPath = `${pathname}${searchParams.toString()}`
    
    // Clear timeout เก่า
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (prevPathRef.current !== null && prevPathRef.current !== currentPath) {
      // มีการเปลี่ยนหน้า - แสดง loading
      setIsLoading(true)
      
      // ซ่อน loading หลังจาก navigation เสร็จ (delay เล็กน้อย)
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        timeoutRef.current = null
      }, 300)
    } else if (prevPathRef.current === null) {
      // ครั้งแรกที่โหลด - ไม่แสดง loading
      setIsLoading(false)
    }
    
    // อัพเดท prevPath
    prevPathRef.current = currentPath

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [pathname, searchParams])

  // ตรวจจับการคลิก link เพื่อแสดง loading ทันที
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')
      
      if (link) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('/') && href !== pathname) {
          // เป็น internal link - แสดง loading
          setIsLoading(true)
          
          // Fallback: ซ่อน loading หลังจาก 2 วินาที (กรณี navigation ช้า)
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(() => {
            setIsLoading(false)
            timeoutRef.current = null
          }, 2000)
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [pathname])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Loader2 className="w-12 h-12 text-zinc-600" strokeWidth={2.5} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-medium text-zinc-600"
            >
              Loading...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function LoadingOverlay() {
  return (
    <Suspense fallback={null}>
      <LoadingOverlayContent />
    </Suspense>
  )
}

