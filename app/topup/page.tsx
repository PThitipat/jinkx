"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Navbar from "@/components/Nav"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Coins,
  Zap,
  Gift,
  Ticket,
  CreditCard,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

type PaymentMethod = "truemoney-gift" | "truemoney-angpao" | "coupon-code"

export default function TopupPage() {
  const { data: session, update } = useSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [giftCode, setGiftCode] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCardClick = (method: PaymentMethod) => {
    const paymentMethod = paymentMethods.find(m => m.id === method)
    if (!paymentMethod?.enabled) {
      toast.error("Payment method unavailable", {
        description: "This payment method is currently not available."
      })
      return
    }
    setSelectedPayment(method)
    setGiftCode("")
    setIsDialogOpen(true)
  }

  const handleProcessTopup = async () => {
    if (!selectedPayment) return
    
    if (!giftCode.trim()) {
      toast.error("Please enter a gift code", {
        description: "Gift code is required to process topup."
      })
      return
    }

    setIsProcessing(true)
    try {
      let apiUrl = ""
      
      // Determine API endpoint based on payment method
      switch (selectedPayment) {
        case "truemoney-angpao":
          apiUrl = "/api/topup/truemoney-angpao"
          break
        case "truemoney-gift":
          // TODO: Implement when API is ready
          toast.error("Coming soon", {
            description: "This payment method is not yet available."
          })
          setIsProcessing(false)
          return
        case "coupon-code":
          // TODO: Implement when API is ready
          toast.error("Coming soon", {
            description: "This payment method is not yet available."
          })
          setIsProcessing(false)
          return
        default:
          toast.error("Invalid payment method")
          setIsProcessing(false)
          return
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giftLink: giftCode.trim(),
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        toast.error("Topup failed", {
          description: "Invalid response from server. Please try again later."
        })
        return
      }

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Topup failed", {
          description: data.code ? `Error: ${data.code}` : "Please try again later."
        })
        return
      }

      // Update session points
      if (data.newPoints !== undefined && session?.user) {
        ;(session.user as any).points = data.newPoints
        if (typeof update === "function") {
          await update({
            ...session,
            user: {
              ...(session.user as any),
              points: data.newPoints,
            },
          } as any)
        }
      }

      toast.success("Topup processed successfully", {
        description: `฿${data.amount?.toFixed(2) || "0.00"} points have been added to your account.`
      })
      
      setIsDialogOpen(false)
      setGiftCode("")
      setSelectedPayment(null)
    } catch (error: any) {
      toast.error("Topup failed", {
        description: error?.message || "Please try again later."
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const paymentMethods = [
    {
      id: "truemoney-gift" as PaymentMethod,
      label: "TrueMoney Gift Card",
      description: "Redeem TrueMoney gift cards",
      icon: CreditCard,
      iconBg: "bg-white",
      iconColor: "text-black",
      cardBorder: "border-white/20",
      enabled: false, // Set to false to disable
    },
    {
      id: "truemoney-angpao" as PaymentMethod,
      label: "TrueMoney Angpao",
      description: "Use TrueMoney Angpao links",
      icon: Gift,
      iconBg: "bg-red-500",
      iconColor: "text-white",
      cardBorder: "border-red-500/20",
      enabled: true, // Set to false to disable
    },
    {
      id: "coupon-code" as PaymentMethod,
      label: "Coupon Code",
      description: "Enter coupon codes",
      icon: Ticket,
      iconBg: "bg-green-500",
      iconColor: "text-white",
      cardBorder: "border-green-500/20",
      enabled: false, // Set to false to disable
    },
  ]

  const getHowToBuyInstructions = () => {
    if (!selectedPayment) return []
    
    switch (selectedPayment) {
      case "truemoney-gift":
        return [
          "Watch Video",
          "You can buy gift cards from popular platforms like G2A, ENEBA, DRIFFLE",
        ]
      case "truemoney-angpao":
        return [
          "สอนเติมเงิน",
          "เข้าแอป → ไปที่ \"โอนเงิน\" → เลือก \"สร้างซองอังเปา\" → คัดลอกลิงก์ → นำลิงก์มาเติมบนเว็บไซต์",
        ]
      case "coupon-code":
        return [
          "Enter your coupon code in the format XXXX-XXXX-XXXX",
          "Coupons can be obtained from promotions or giveaways",
        ]
      default:
        return []
    }
  }

  const getPlaceholder = () => {
    if (!selectedPayment) return ""
    
    switch (selectedPayment) {
      case "coupon-code":
        return "XXXX - XXXX - XXXX"
      case "truemoney-angpao":
        return "https://gift.truemoney.com/campaign/?v=x"
      case "truemoney-gift":
        return "https://redeem.yourdigitalreward.com/act"
      default:
        return ""
    }
  }

  const getInputLabel = () => {
    if (!selectedPayment) return "Gift Code"
    
    switch (selectedPayment) {
      case "coupon-code":
        return "Coupon Code"
      default:
        return "Gift Code"
    }
  }

  const getInputDescription = () => {
    if (!selectedPayment) return ""
    
    switch (selectedPayment) {
      case "coupon-code":
        return "Enter your coupon code to redeem points."
      default:
        return "Please enter the gift code link or code you received."
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      },
    },
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background overflow-x-hidden w-full">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              <span className="text-white">Topup</span>{" "}
              <span className="text-red-400">Points</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
              Add points to your account using various payment methods
            </p>
          </motion.div>

          {/* Payment Method Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mx-auto"
          >
            {paymentMethods.map((method) => {
              const isEnabled = method.enabled ?? true
              return (
                <motion.div key={method.id} variants={itemVariants}>
                  <Card
                    className={`border border-white/10 rounded overflow-hidden transition-all duration-300 bg-black/40 backdrop-blur-sm p-0 ${
                      isEnabled 
                        ? "hover:border-white/20 cursor-pointer" 
                        : "opacity-60 cursor-not-allowed"
                    }`}
                    onClick={() => handleCardClick(method.id)}
                  >
                    {/* Image with landscape aspect ratio */}
                    <div className="relative w-full aspect-[5/3]">
                      <Image
                        src="/TW.jpg"
                        alt={method.label}
                        fill
                        className="object-cover"
                      />
                      {/* Black overlay */}
                      <div className="absolute inset-0 bg-black/90" />
                      {/* Text overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-6 z-10">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1">
                          {method.label}
                        </h3>
                        <p className="text-white/80 text-xs md:text-sm">
                          {method.description}
                        </p>
                      </div>
                      {/* Warning overlay when disabled */}
                      {!isEnabled && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                          <div className="text-center px-4">
                            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                            <p className="text-white font-semibold text-lg mb-1">
                            Not available yet
                            </p>
                            <p className="text-white/70 text-sm">
                              This payment method is currently unavailable
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </main>

      {/* Add Points Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-black/95 border-white/10 backdrop-blur-xl p-0 overflow-hidden">
          {selectedPayment && (
            <div className="p-6">
              {/* Header */}
              <DialogHeader className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <Coins className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <DialogTitle className="text-3xl font-bold text-white">
                  Add Points
                </DialogTitle>
                <DialogDescription className="text-white/70 text-base mt-2">
                  Top up your account balance using {paymentMethods.find(m => m.id === selectedPayment)?.label.toLowerCase()}
                </DialogDescription>
              </DialogHeader>

              <hr className="border-white/10 mb-6" />

              {/* Gift Code Section */}
              <div className="space-y-2 mb-6">
                <label className="text-white font-semibold text-sm">
                  {getInputLabel()}
                </label>
                <Input
                  type="text"
                  placeholder={getPlaceholder()}
                  value={giftCode}
                  onChange={(e) => setGiftCode(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-lg h-12"
                />
                <p className="text-white/60 text-xs">
                  {getInputDescription()}
                </p>
              </div>

            {/* How to buy Section */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <label className="text-white font-semibold text-sm">
                  How to buy
                </label>
              </div>
              <ul className="space-y-2 text-white/70 text-sm">
                {getHowToBuyInstructions().map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>
                      {instruction.includes("ENEBA") ? (
                        <>
                          You can buy gift cards from popular platforms like{" "}
                          <a href="#" className="text-green-400 underline hover:text-green-300">
                            ENEBA
                          </a>
                        </>
                      ) : instruction.includes("Watch Video") ? (
                        <a href="#" className="text-green-400 underline hover:text-green-300">
                          Watch Video
                        </a>
                      ) : (
                        instruction
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process Topup Button */}
            <Button variant={"outline"}
              onClick={handleProcessTopup}
              disabled={isProcessing}
              className="w-full text-white rounded py-6 text-lg font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin text-green-400" />
                  Processing...
                </>
              ) : (
                <>
                  <Coins className="w-5 h-5 mr-2" />
                  Process Topup
                </>
              )}
            </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

