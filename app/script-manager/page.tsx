"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Nav"
import { RefreshCw, Loader2, Key, Calendar, Activity, Copy, Check, Clock } from "lucide-react"
import { toast } from "sonner"
import { format, differenceInDays } from "date-fns"
import { AnimatePresence } from "framer-motion"

// Using Next.js API routes instead of direct server.js calls

interface LicenseItem {
  id: string
  license: string
  created_at: string
  productTitle: string
  price: number
}

interface KeyDetails {
  user_key: string
  status: string
  last_reset: number | null
  auth_expire: number
  total_executions: number
}

export default function ScriptManagerPage() {
  const { data: session, update } = useSession()
  const [licenses, setLicenses] = useState<LicenseItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLicense, setSelectedLicense] = useState<LicenseItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [keyDetails, setKeyDetails] = useState<KeyDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isResetting, setIsResetting] = useState<string | null>(null) // Track which license is being reset
  const [copiedLicenseId, setCopiedLicenseId] = useState<string | null>(null) // Track which license was copied

  useEffect(() => {
    fetchLicenses()
  }, [session])

  const fetchLicenses = async () => {
    if (!session?.user) return

    try {
      setIsLoading(true)
      const response = await fetch("/api/history/purchase")
      if (!response.ok) {
        throw new Error("Failed to fetch licenses")
      }
      const data = await response.json()
      setLicenses(data || [])
    } catch {
      toast.error("Failed to load licenses", {
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = async (license: LicenseItem) => {
    setSelectedLicense(license)
    setIsDialogOpen(true)
    setIsLoadingDetails(true)
    setKeyDetails(null)

    try {
      const response = await fetch(
        `/api/user-key?user_key=${encodeURIComponent(license.license)}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch key details")
      }

      const data = await response.json()
      if (data.ok) {
        setKeyDetails({
          user_key: data.user_key,
          status: data.status,
          last_reset: data.last_reset,
          auth_expire: data.auth_expire,
          total_executions: data.total_executions,
        })
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error: any) {
      toast.error("Failed to load key details", {
        description: "Please try again later.",
      })
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleResetHWID = async (license: LicenseItem, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!license) return

    try {
      setIsResetting(license.id)
      const response = await fetch("/api/reset-hwid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_key: license.license,
          force: false,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reset HWID")
      }

      const data = await response.json()
      if (data.ok && data.success) {
        // Update session with new reset_token
        const newResetToken = data.remainingResetToken ?? ((session?.user as any)?.reset_token ?? 0) - 1
        if (session?.user && typeof update === "function") {
          await update({
            ...session,
            user: {
              ...(session.user as any),
              reset_token: newResetToken,
            },
          } as any)
        }

        toast.success("HWID reset successfully", {
          description: data.message || "The HWID has been reset. 1 reset token has been deducted.",
        })
        
        // Refresh key details if dialog is open for this license
        if (isDialogOpen && selectedLicense?.id === license.id) {
          const refreshResponse = await fetch(
            `/api/user-key?user_key=${encodeURIComponent(license.license)}`
          )
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json()
            if (refreshData.ok) {
              setKeyDetails({
                user_key: refreshData.user_key,
                status: refreshData.status,
                last_reset: refreshData.last_reset,
                auth_expire: refreshData.auth_expire,
                total_executions: refreshData.total_executions,
              })
            }
          }
        }
      } else {
        throw new Error(data.message || "Failed to reset HWID")
      }
    } catch (error: any) {
      toast.error("Failed to reset HWID", {
        description: "Please try again later.",
      })
    } finally {
      setIsResetting(null)
    }
  }

  const handleCopyLicense = (license: string, licenseId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(license)
    setCopiedLicenseId(licenseId)
    toast.success("License copied", {
      description: "License key has been copied to your clipboard.",
    })
    setTimeout(() => setCopiedLicenseId(null), 2000)
  }

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp || timestamp === 0 || timestamp === -1) return "Never"
    try {
      return format(new Date(timestamp * 1000), "PPp")
    } catch {
      return "Invalid date"
    }
  }

  const getDaysRemaining = (authExpire: number) => {
    if (authExpire === -1) return null
    try {
      const expireDate = new Date(authExpire * 1000)
      const today = new Date()
      const days = differenceInDays(expireDate, today)
      return days
    } catch {
      return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500/20 border-green-500/50 text-green-400"
      case "reset":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
      case "banned":
        return "bg-red-500/20 border-red-500/50 text-red-400"
      default:
        return "bg-gray-500/20 border-gray-500/50 text-gray-400"
    }
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-background overflow-x-hidden w-full">
        <Navbar />
        <main className="flex-1 pt-24">
          <div className="container mx-auto px-4">
            <div className="text-center text-white/70">
              Please login to manage your scripts.
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background overflow-x-hidden w-full">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Script Manager</h1>
            <p className="text-white/70">
              Manage your license keys and reset HWID when needed
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-white/50" />
            </div>
          ) : licenses.length === 0 ? (
            <div className="text-center py-20">
              <Key className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <p className="text-white/70 text-lg">No license keys found</p>
              <p className="text-white/50 text-sm mt-2">
                Purchase a product to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {licenses.map((license, index) => (
                <motion.div
                  key={license.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="bg-white/5 border-white/10 hover:border-white/20 transition-colors cursor-pointer rounded"
                    onClick={() => handleCardClick(license)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
                        <span className="truncate flex-1 mr-2">License Key</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded relative overflow-hidden"
                          onClick={(e) => handleCopyLicense(license.license, license.id, e)}
                        >
                          <AnimatePresence mode="wait">
                            {copiedLicenseId === license.id ? (
                              <motion.div
                                key="check"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <Check className="h-4 w-4 text-green-400" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="copy"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <Copy className="h-4 w-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <code className="block bg-black/30 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white/90 break-all">
                          {license.license}
                        </code>
                      </div>
                      <div className="space-y-2">
                        <p className="text-white font-medium text-sm">
                          {license.productTitle}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">
                            Purchased: {format(new Date(license.created_at), "MMM d, yyyy")}
                          </span>
                          <span className="text-green-400 font-medium">
                            ฿{license.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 flex-1 rounded"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCardClick(license)
                        }}
                      >
                        <Key className="w-4 h-4" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded"
                        onClick={(e) => handleResetHWID(license, e)}
                        disabled={isResetting === license.id}
                      >
                        {isResetting === license.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Resetting...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Reset HWID
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-400" />
              License Key Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about your license key
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-white/50" />
            </div>
          ) : keyDetails ? (
            <div className="space-y-6">
              {/* License Key */}
              <div>
                <label className="text-sm font-medium text-white/70 mb-2 block">
                  License Key
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white/90 font-mono break-all">
                    {keyDetails.user_key}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 relative overflow-hidden"
                    onClick={() => {
                      navigator.clipboard.writeText(keyDetails.user_key)
                      setCopiedLicenseId("dialog")
                      toast.success("Copied to clipboard")
                      setTimeout(() => setCopiedLicenseId(null), 2000)
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {copiedLicenseId === "dialog" ? (
                        <motion.div
                          key="check"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check className="h-4 w-4 text-green-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Copy className="h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </div>

              {/* Grid Layout 2x2 */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-white/70 mb-2 block">
                    Status
                  </label>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(keyDetails.status)} !rounded`}
                  >
                    {keyDetails.status}
                  </Badge>
                </div>

                {/* Total Executions */}
                <div>
                  <label className="text-sm font-medium text-white/70 mb-2 block flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    Total Executions
                  </label>
                  <p className="text-white/90 text-sm font-semibold">{keyDetails.total_executions}</p>
                </div>

                {/* Last Reset */}
                <div>
                  <label className="text-sm font-medium text-white/70 mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    Last Reset
                  </label>
                  <p className="text-white/90 text-sm">
                    {formatTimestamp(keyDetails.last_reset)}
                  </p>
                </div>

                {/* Auth Expire */}
                <div>
                  <label className="text-sm font-medium text-white/70 mb-2 block flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    Auth Expire
                  </label>
                  <div>
                    <p className="text-white/90 text-sm">
                      {keyDetails.auth_expire === -1
                        ? "Never"
                        : formatTimestamp(keyDetails.auth_expire)}
                    </p>
                    {keyDetails.auth_expire !== -1 && (() => {
                      const daysRemaining = getDaysRemaining(keyDetails.auth_expire)
                      if (daysRemaining !== null) {
                        return (
                          <p className={`text-xs mt-1 ${daysRemaining < 7 ? 'text-red-400' : daysRemaining < 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                            ({daysRemaining > 0 ? `${daysRemaining} days remaining` : daysRemaining === 0 ? 'Expires today' : 'Expired'})
                          </p>
                        )
                      }
                      return null
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/70">Failed to load key details</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

