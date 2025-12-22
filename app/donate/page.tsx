"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Navbar from "@/components/Nav"
import { Copy, Check, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { toast } from "sonner"

interface CryptoInfo {
  name: string
  network: string
  address: string
  icon: string
  bgColor: string
  borderColor: string
  buttonColor: string
  buttonHover: string
}

export default function DonatePage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const cryptocurrencies: CryptoInfo[] = [
    {
      name: "USDT",
      network: "TRC20",
      address: "TXyHewMe6yXzpb5gac6WTskb4L8XxfbRFw",
      icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
      buttonColor: "bg-green-500 hover:bg-green-400",
      buttonHover: "hover:bg-green-400"
    },
    {
      name: "BTC",
      network: "BEP20",
      address: "0x24b92b85cac870aba49d926a786b7fdb44a40370",
      icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/30",
      buttonColor: "bg-orange-500 hover:bg-orange-400",
      buttonHover: "hover:bg-orange-400"
    },
    {
      name: "Litecoin",
      network: "BEP20",
      address: "0x24b92b85cac870aba49d926a786b7fdb44a40370",
      icon: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
      buttonColor: "bg-blue-500 hover:bg-blue-400",
      buttonHover: "hover:bg-blue-400"
    }
  ]

  const handleCopy = async (address: string, index: number, cryptoName: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard API unavailable")
      return
    }

    try {
      await navigator.clipboard.writeText(address)
      setCopiedIndex(index)
      toast.success(`${cryptoName} address copied!`, {
        description: "Address has been copied to clipboard"
      })
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (e) {
      console.error("Clipboard error:", e)
      toast.error("Failed to copy address", {
        description: "Please try again"
      })
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Navbar />
      
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
              className="max-w-6xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white dark:text-white">
                  Donate
                </h1>
                <p className="text-lg text-white/70 dark:text-white/70 max-w-2xl mx-auto">
                  Support <span className="brand-jinkx">JinkX</span> development with cryptocurrency
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {cryptocurrencies.map((crypto, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1, type: "spring", stiffness: 100 }}
                  >
                    <Card className="w-full p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-all duration-300 h-full">
                      <CardContent className="space-y-6 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex flex-col items-center text-center space-y-4">
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: index * 0.1 }}
                            className={`w-16 h-16 rounded-xl flex items-center justify-center ${crypto.bgColor} border ${crypto.borderColor} overflow-hidden`}
                          >
                            <Image
                              src={crypto.icon}
                              alt={crypto.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                              unoptimized
                            />
                          </motion.div>
                          <div>
                            <h2 className="text-xl font-bold text-white mb-1">{crypto.name}</h2>
                            <p className="text-white/60 text-xs">({crypto.network})</p>
                          </div>
                        </div>

                        {/* Address Display */}
                        <div className="space-y-3 flex-1">
                          <label className="text-xs font-medium text-white/80">Wallet Address</label>
                          <div className="relative">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3 pr-10">
                              <p className="text-white font-mono text-xs break-all">
                                {crypto.address}
                              </p>
                            </div>
                            <button
                              onClick={() => handleCopy(crypto.address, index, crypto.name)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                              title="Copy address"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-white/80" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Copy Button */}
                        <Button
                          onClick={() => handleCopy(crypto.address, index, crypto.name)}
                          className={`w-full h-11 rounded-lg font-semibold text-xs transition-all shadow-lg hover:shadow-xl ${crypto.buttonColor} text-white`}
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Address
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 bg-white/5 border border-white/10 rounded-lg p-4 space-y-2"
              >
                <p className="text-xs text-white/60 text-center">
                  ⚠️ Make sure you're sending on the correct network (TRC20 or BEP20)
                </p>
                <p className="text-xs text-white/60 text-center">
                  Thank you for supporting <span className="brand-jinkx">JinkX</span>! 🙏
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}

