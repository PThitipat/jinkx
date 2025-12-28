"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import Navbar from "@/components/Nav"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ShoppingCart, ArrowRight, X, Plus, Minus, Coins, Loader2, ShoppingBag } from "lucide-react"
import { useSession } from "next-auth/react"

interface Script {
  id: string
  title: string
  image: string
  category: string
  duration: number
  price: number
  solds: number
  description: string
}

const getDurationColor = (duration: number) => {
  if (duration >= 30) return "text-red-500"
  if (duration >= 7) return "text-yellow-500"
  return "text-green-500"
}

export default function StorePage() {
    const { data: session, update } = useSession()
    const [selectedScript, setSelectedScript] = useState<Script | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [scripts, setScripts] = useState<Script[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isPurchasing, setIsPurchasing] = useState(false)
  
    const userPoints = (session?.user as any)?.points ?? 0

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  const handleBuyClick = (script: Script) => {
    setSelectedScript(script)
    setQuantity(1)
    setIsDialogOpen(true)
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  const handleCompletePurchase = async () => {
    if (!selectedScript) return

    const total = selectedScript.price * quantity

    if (!session?.user) {
      toast.error("Please login first", {
        description: "You need to be logged in to purchase."
      })
      return
    }

    // เช็ก point ก่อน
    if (userPoints < total) {
      toast.error("Not enough points", {
        description: `You need ฿${total.toFixed(2)} points but you have only ฿${userPoints.toFixed(2)}.`
      })
      return
    }

    setIsPurchasing(true)
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedScript.id,
          quantity,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error("Purchase failed", {
          description: data?.error || "Please try again."
        })
        return
      }

      // แสดง toast message ตามประเภท product
      if (data.isTokenProduct) {
        const tokenAmount = data.remainingResetToken - ((session?.user as any)?.reset_token ?? 0)
        toast.success("Purchase completed", {
          description: `Successfully purchased ${tokenAmount} reset token(s). Your tokens have been added to your account.`
        })
      } else {
        toast.success("Purchase completed", {
          description: `Successfully purchased ${data.licenses?.length || 0} license(s).`
        })
      }

      // อัปเดต point ใน UI ทันที
      const newPoints = typeof data?.remainingPoints === "number"
        ? data.remainingPoints
        : userPoints - total

      // อัปเดต reset_token ใน UI ทันที
      const newResetToken = typeof data?.remainingResetToken === "number"
        ? data.remainingResetToken
        : ((session?.user as any)?.reset_token ?? 0) + (data.isTokenProduct ? quantity : 2)

      // อัปเดต solds ใน UI ทันที
      const updatedSolds =
        typeof data?.productSolds === "number"
          ? data.productSolds
          : (selectedScript.solds ?? 0) + quantity

      setScripts((prev) =>
        prev.map((item) =>
          item.id === selectedScript.id ? { ...item, solds: updatedSolds } : item
        )
      )
      setSelectedScript((prev) =>
        prev ? { ...prev, solds: updatedSolds } : prev
      )

      if (session?.user) {
        ;(session.user as any).points = newPoints
        ;(session.user as any).reset_token = newResetToken
        if (typeof update === "function") {
          // best-effort อัปเดต session ให้ Navbar รีเรนเดอร์ตาม
          await update({
            ...session,
            user: {
              ...(session.user as any),
              points: newPoints,
              reset_token: newResetToken,
            },
          } as any)
        }
      }

      // ปิด dialog หลังซื้อสำเร็จ
      setIsDialogOpen(false)
    } catch {
      toast.error("Purchase failed", {
        description: "Please try again later."
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const totalPrice = selectedScript ? (selectedScript.price * quantity).toLocaleString("en-US", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }) : "0.00"

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/products", { cache: "no-store" })
        
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        
        const data = await response.json()
        setScripts(data)
      } catch (error) {
        toast.error("Failed to load products", {
          description: "Please try again later"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background overflow-x-hidden w-full">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <span className="text-white">JinkX</span>{" "}
                  <span className="text-red-400">Store</span>
                </h1>
                <p className="text-white/70 text-base md:text-lg max-w-2xl">
                  You can manage up to 100 premium scripts, including reset, get script, and buy script options. 
                  Easily organize and access your scripts in one convenient location.
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded px-4 py-2"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Scripts Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-white/70">Loading products...</div>
            </div>
          ) : scripts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-white/70">No products available</div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {scripts.map((script) => (
              <motion.div key={script.id} variants={itemVariants}>
                <Card className="border border-white/10 rounded overflow-hidden hover:border-white/20 transition-all duration-300">
                  {/* Image */}
                  <div className="relative w-full bg-black/30" style={{ aspectRatio: '1/1' }}>
                    <Image
                      src={script.image}
                      alt={script.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Price & Sold info */}
                  <div className="px-4 pt-2 flex items-center justify-between text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-green-400" />
                      <span className="font-semibold text-green-400">
                        ฿{script.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-white/70" />
                      <span className="text-white/80">{script.solds} sold</span>
                    </div>
                  </div>
                    <div className="px-4 py-2"><hr className="border-white/10" /></div>
                  {/* Card Header */}
                  <div className="px-4">
                    <h3 className="text-white text-sm font-semibold line-clamp-2">
                      {script.title}
                    </h3>
                  </div>

                  {/* Details Section */}
                  <div className="px-4 py-2">
                    <Button 
                      variant={'outline'} 
                      className="w-full text-white rounded"
                      onClick={() => handleBuyClick(script)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Purchase Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-black/95 border-white/10 backdrop-blur-xl p-0 overflow-hidden">
          {selectedScript && (
            <div className="p-6">
              {/* Product Visual Banner */}
              <div className="relative w-full rounded-lg overflow-hidden mb-6" style={{ aspectRatio: '2/1' }}>
                <Image
                  src={selectedScript.image}
                  alt={selectedScript.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Information */}
              <div className="space-y-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-400/10 hover:bg-yellow-400/10 text-yellow-400/90 border-yellow-400/20 rounded px-2 py-1 text-xs font-semibold backdrop-blur-sm pointer-events-none">
                    {selectedScript.category}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl font-bold text-white text-left">
                  {selectedScript.title}
                </DialogTitle>
                <DialogDescription className="text-white/70 text-sm text-left">
                  {selectedScript.description}
                </DialogDescription>
              </div>
                <hr />
              {/* Quantity Selector */}
              <div className="space-y-2 mb-2 pt-2">
                <div>
                  <label className="text-white font-semibold text-sm">Quantity</label>
                  <p className="text-white/60 text-xs">Select how many licenses you want to purchase</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-4 py-2 bg-white/5 border border-white/10 rounded text-white text-center font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <span className="text-white font-semibold">Total Price</span>
                <span className="text-green-400 text-xl font-bold">
                  ฿{totalPrice}
                </span>
              </div>

              {/* Complete Purchase Button */}
              <Button
                variant="outline"
                className="w-full bg-green-500/90 hover:bg-green-600 text-white rounded py-6 text-lg font-semibold backdrop-blur-sm"
                onClick={handleCompletePurchase}
                disabled={isPurchasing}
                >
                {isPurchasing ? (
                    <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                    </>
                ) : (
                    <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Complete Purchase
                    </>
                )}
              </Button>

              {/* Disclaimer */}
              <p className="text-white/50 text-xs text-center mt-4">
                By purchasing, you agree to our{" "}
                <Link href="/terms" className="text-white underline hover:text-white/80 transition-colors">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link href="/terms" className="text-white underline hover:text-white/80 transition-colors">
                  Privacy Policy
                </Link>
                . All sales are final.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

