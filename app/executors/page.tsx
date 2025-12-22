"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/Nav"
import { Search, Filter, X, Monitor, Apple, Smartphone, ExternalLink, MessageCircle, ShoppingCart, Check, Clock, Box, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface RobloxVersion {
  Windows?: string
  WindowsDate?: string
  Mac?: string
  MacDate?: string
  Android?: string
  AndroidDate?: string
  iOS?: string
  iOSDate?: string
}

interface Exploit {
  _id: string
  title: string
  version: string
  updatedDate: string
  uncStatus: boolean
  free: boolean
  detected: boolean
  rbxversion: string
  updateStatus: boolean
  websitelink?: string
  discordlink?: string
  purchaselink?: string
  platform: string
  extype: string
  index: number
  cost?: string
  decompiler?: boolean
  multiInject?: boolean
  suncPercentage?: number
  uncPercentage?: number
  keysystem?: boolean
  elementCertified?: boolean
  sunc?: {
    suncScrap?: string
    suncKey?: string
  }
}

export default function ExecutorsPage() {
  const [versions, setVersions] = useState<RobloxVersion>({})
  const [exploits, setExploits] = useState<Exploit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"alphabetical" | "compatibility" | "recently">("alphabetical")
  const [pricingFilter, setPricingFilter] = useState<string[]>([])
  const [platformFilter, setPlatformFilter] = useState<string[]>([])
  const [detectionFilter, setDetectionFilter] = useState<string[]>([])
  const [selectedExploit, setSelectedExploit] = useState<Exploit | null>(null)
  const [suncTestExploit, setSuncTestExploit] = useState<Exploit | null>(null)
  const [suncTestData, setSuncTestData] = useState<any>(null)
  const [suncTestLoading, setSuncTestLoading] = useState(false)
  const [suncTestSearch, setSuncTestSearch] = useState("")
  
  // Blocklist of executor names to hide
  const blocklist = ["Lovreware"]

  // Fetch Roblox versions
  useEffect(() => {
    fetch("/api/versions")
      .then((res) => res.json())
      .then((data) => setVersions(data))
      .catch((err) => {
        toast.error("Failed to fetch Roblox versions")
      })
  }, [])

  // Fetch exploits
  useEffect(() => {
    setLoading(true)
    fetch("/api/exploits")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        // Handle different response formats
        let exploitsArray: Exploit[] = []
        
        if (Array.isArray(data)) {
          exploitsArray = data
        } else if (typeof data === 'object' && data !== null) {
          // If it's an object, try to extract array from it
          exploitsArray = Object.values(data).filter((item): item is Exploit => 
            typeof item === 'object' && item !== null && 'title' in item
          ) as Exploit[]
        }
        
        // Filter only exploits with suncPercentage >= 97%
        const filtered = exploitsArray.filter((e: Exploit) => {
          const percentage = e.suncPercentage ?? 0
          return percentage >= 97
        })
        
        // If no exploits with >=97%, show all exploits for debugging
        if (filtered.length === 0 && exploitsArray.length > 0) {
          setExploits(exploitsArray)
        } else {
          setExploits(filtered)
        }
        setLoading(false)
      })
      .catch((err) => {
        toast.error("Failed to fetch executors")
        setExploits([])
        setLoading(false)
      })
  }, [])

  // Helper functions for date parsing
  const parseDate = (dateStr: string): Date | null => {
    try {
      // Parse date format like "07/24/2025 at 3:47 PM UTC"
      let date: Date
      if (dateStr.includes(" at ")) {
        const [datePart, timePart] = dateStr.split(" at ")
        const [month, day, year] = datePart.split("/")
        const timeMatch = timePart.match(/(\d+):(\d+)\s*(AM|PM)/i)
        if (timeMatch) {
          let hours = parseInt(timeMatch[1])
          const minutes = parseInt(timeMatch[2])
          const ampm = timeMatch[3].toUpperCase()
          if (ampm === "PM" && hours !== 12) hours += 12
          if (ampm === "AM" && hours === 12) hours = 0
          date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), hours, minutes))
        } else {
          date = new Date(dateStr)
        }
      } else {
        date = new Date(dateStr)
      }
      
      if (isNaN(date.getTime())) {
        return null
      }
      return date
    } catch {
      return null
    }
  }

  const getDaysAgo = (dateStr: string): number => {
    const date = parseDate(dateStr)
    if (!date) return Infinity
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    return Math.floor(diffMs / (1000 * 60 * 60 * 24))
  }

  const getTimeAgo = (dateStr: string) => {
    const date = parseDate(dateStr)
    if (!date) return "Unknown"
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return "Today"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    const diffWeeks = Math.floor(diffDays / 7)
    if (diffWeeks === 1) return "1 week ago"
    if (diffWeeks < 4) return `${diffWeeks} weeks ago`
    const diffMonths = Math.floor(diffDays / 30)
    if (diffMonths === 0) return "Less than a month ago"
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`
  }

  // Filter and sort exploits
  const filteredExploits = useMemo(() => {
    let filtered = exploits.filter((exploit) => {
      // Blocklist filter
      if (blocklist.some(blocked => exploit.title.toLowerCase().includes(blocked.toLowerCase()))) {
        return false
      }

      // Filter out exploits updated >= 1 month ago
      const daysAgo = getDaysAgo(exploit.updatedDate)
      if (daysAgo >= 30) {
        return false
      }

      // Search filter
      if (searchQuery && !exploit.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Pricing filter
      if (pricingFilter.length > 0) {
        if (pricingFilter.includes("Free") && !exploit.free) return false
        if (pricingFilter.includes("Free (Key System)") && !exploit.keysystem) return false
        if (pricingFilter.includes("Paid") && exploit.free) return false
      }

      // Platform filter
      if (platformFilter.length > 0 && !platformFilter.includes(exploit.platform)) {
        return false
      }

      // Detection filter
      if (detectionFilter.length > 0) {
        if (detectionFilter.includes("Undetected") && exploit.detected) return false
        if (detectionFilter.includes("Detected") && !exploit.detected) return false
        if (detectionFilter.includes("Client Mod Bypass") && !exploit.uncStatus) return false
      }

      return true
    })

    // Sort by sUNC percentage (highest first), then by recently updated
    filtered.sort((a, b) => {
      const aSunc = a.suncPercentage ?? 0
      const bSunc = b.suncPercentage ?? 0
      
      // Primary sort: sUNC percentage (descending)
      if (bSunc !== aSunc) {
        return bSunc - aSunc
      }
      
      // Secondary sort: recently updated (newest first)
      const aDate = parseDate(a.updatedDate)
      const bDate = parseDate(b.updatedDate)
      if (aDate && bDate) {
        return bDate.getTime() - aDate.getTime()
      }
      if (aDate) return -1
      if (bDate) return 1
      return 0
    })

    return filtered
  }, [exploits, searchQuery, sortBy, pricingFilter, platformFilter, detectionFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredExploits.length
    const working = filteredExploits.filter((e) => e.updateStatus).length
    const free = filteredExploits.filter((e) => e.free).length
    const paid = filteredExploits.filter((e) => !e.free).length
    return { total, working, free, paid }
  }, [filteredExploits])

  // Group exploits by platform
  const exploitsByPlatform = useMemo(() => {
    const grouped: Record<string, Exploit[]> = {}
    filteredExploits.forEach((exploit) => {
      const platform = exploit.platform || "Other"
      if (!grouped[platform]) {
        grouped[platform] = []
      }
      grouped[platform].push(exploit)
    })
    return grouped
  }, [filteredExploits])

  const platformOrder = ["Windows", "Mac", "Android", "iOS", "Other"]

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
        timeZoneName: "short",
      })
    } catch {
      return dateStr
    }
  }

  const getPricingLabel = (exploit: Exploit) => {
    if (exploit.keysystem) return "Free (Key System)"
    if (exploit.free) return "Free"
    return exploit.cost || "Paid"
  }

  const toggleFilter = (
    filterArray: string[],
    setFilter: (arr: string[]) => void,
    value: string
  ) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter((v) => v !== value))
    } else {
      setFilter([...filterArray, value])
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">Supported Executors</h1>
            <p className="text-white/70 text-lg">
              Browse and filter through all supported Roblox script executors. <span className="text-zinc-500 text-sm">API by WhatExpsAre.Online</span>
            </p>
          </motion.div>

          {/* Roblox Versions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 text-white">Roblox Versions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {versions.Windows && (
                <Card className="bg-white/5 border-white/10 rounded">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-white/80" />
                        <div>
                          <p className="text-white font-medium">Windows Version</p>
                          <p className="text-white/60 text-sm">
                            Last Updated: {versions.WindowsDate || "N/A"}
                          </p>
                          <p className="text-white/80 text-sm font-mono mt-1">
                            {versions.Windows}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {versions.Mac && (
                <Card className="bg-white/5 border-white/10 rounded">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Apple className="w-5 h-5 text-white/80" />
                        <div>
                          <p className="text-white font-medium">Mac Version</p>
                          <p className="text-white/60 text-sm">
                            Last Updated: {versions.MacDate || "N/A"}
                          </p>
                          <p className="text-white/80 text-sm font-mono mt-1">{versions.Mac}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>

          {/* Summary Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="bg-white/5 border-white/10 rounded">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-white/60 text-sm">Total</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 rounded">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{stats.working}</p>
                <p className="text-white/60 text-sm">Working</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 rounded">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{stats.free}</p>
                <p className="text-white/60 text-sm">Free</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 rounded">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-400">{stats.paid}</p>
                <p className="text-white/60 text-sm">Paid</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 mb-6"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search executors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
              />
            </div>
            <Button
              onClick={() => setShowFilters(true)}
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </motion.div>

          {/* Executors List by Platform */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center py-12 text-white/60"
            >
              Loading...
            </motion.div>
          ) : Object.keys(exploitsByPlatform).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center py-12 text-white/60"
            >
              No executors found
            </motion.div>
          ) : (
            platformOrder
              .filter((platform) => exploitsByPlatform[platform]?.length > 0)
              .map((platform, platformIdx) => {
                const platformExploits = exploitsByPlatform[platform]
                const PlatformIcon =
                  platform === "Windows"
                    ? Monitor
                    : platform === "Mac"
                      ? Apple
                      : platform === "Android" || platform === "iOS"
                        ? Smartphone
                        : Monitor

                return (
                  <motion.div
                    key={platform}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + platformIdx * 0.1 }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <PlatformIcon className="w-5 h-5 text-white/80" />
                      <h2 className="text-xl font-semibold text-white">
                        {platform} Executors ({platformExploits.length})
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {platformExploits.map((exploit, idx) => (
                        <motion.div
                          key={exploit._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Card 
                            className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors rounded cursor-pointer"
                            onClick={() => setSelectedExploit(exploit)}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h3 className="text-lg font-semibold text-white">
                                      {exploit.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <span className="relative flex h-3 w-3">
                                        <span
                                          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                                            exploit.updateStatus
                                              ? "bg-green-400"
                                              : "bg-red-400"
                                          }`}
                                        />
                                        <span
                                          className={`relative inline-flex rounded-full h-3 w-3 ${
                                            exploit.updateStatus ? "bg-green-500" : "bg-red-500"
                                          }`}
                                        />
                                      </span>
                                      <span
                                        className={`text-xs font-medium ${
                                          exploit.updateStatus ? "text-green-400" : "text-red-400"
                                        }`}
                                      >
                                        {exploit.updateStatus ? "Online" : "Offline"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-xs">
                                      version: {exploit.version}
                                    </Badge>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-xs bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30 rounded"
                                      onClick={async (e) => {
                                        e.stopPropagation()
                                        if (exploit.sunc?.suncScrap && exploit.sunc?.suncKey) {
                                          setSuncTestExploit(exploit)
                                          setSuncTestLoading(true)
                                          setSuncTestData(null)
                                          setSuncTestSearch("")
                                          
                                          try {
                                            const response = await fetch(
                                              `/api/sunc-test?scrap=${exploit.sunc.suncScrap}&key=${exploit.sunc.suncKey}`
                                            )
                                            if (response.ok) {
                                              const data = await response.json()
                                              setSuncTestData(data)
                                            } else {
                                              toast.error("Failed to fetch sUNC test data")
                                            }
                                          } catch (error) {
                                            toast.error("Error fetching sUNC test results")
                                          } finally {
                                            setSuncTestLoading(false)
                                          }
                                        } else {
                                          toast.warning("No sUNC data available for this executor")
                                        }
                                      }}
                                    >
                                      sUNC
                                    </Button>
                                    <Badge
                                      className={`px-2 py-0.5 rounded text-xs ${
                                        exploit.free
                                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                          : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                      }`}
                                    >
                                      {getPricingLabel(exploit)}
                                    </Badge>
                                    <Badge
                                      className={`px-2 py-0.5 rounded text-xs ${
                                        getDaysAgo(exploit.updatedDate) < 7
                                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                          : getDaysAgo(exploit.updatedDate) < 14
                                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                      }`}
                                    >
                                      Last Updated: {getTimeAgo(exploit.updatedDate)}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                                  {exploit.websitelink && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        window.open(exploit.websitelink, "_blank")
                                      }}
                                    >
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Website
                                    </Button>
                                  )}
                                  {exploit.discordlink && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-[#5865F2] hover:bg-[#4752C4] text-white border border-[#5865F2] rounded"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        window.open(exploit.discordlink, "_blank")
                                      }}
                                    >
                                      <MessageCircle className="w-4 h-4 mr-2" />
                                      Discord
                                    </Button>
                                  )}
                                  {exploit.purchaselink && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        window.open(exploit.purchaselink, "_blank")
                                      }}
                                    >
                                      <ShoppingCart className="w-4 h-4 mr-2" />
                                      Purchase
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              })
          )}
        </div>
      </main>

      {/* Filters Modal */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="bg-background border-white/10 text-white max-w-2xl rounded">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <p className="text-white/60 text-sm">Filter your search results by criteria.</p>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Sort */}
            <div>
              <p className="text-sm font-medium mb-3">Sort by name A-Z</p>
              <div className="flex gap-2">
                {(["alphabetical", "compatibility", "recently"] as const).map((sort) => (
                  <Button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    variant={sortBy === sort ? "default" : "outline"}
                    className={
                      sortBy === sort
                        ? "bg-white text-background hover:bg-white/90 hover:text-background"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                    }
                  >
                    {sort === "alphabetical"
                      ? "Alphabetical"
                      : sort === "compatibility"
                        ? "Compatibility"
                        : "Recently Updated"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <p className="text-sm font-medium mb-3">Pricing</p>
              <div className="flex flex-wrap gap-2">
                {["Free", "Free (Key System)", "Paid"].map((pricing) => (
                  <Button
                    key={pricing}
                    onClick={() =>
                      toggleFilter(pricingFilter, setPricingFilter, pricing)
                    }
                    variant="outline"
                    className={
                      pricingFilter.includes(pricing)
                        ? "bg-white text-background hover:bg-white/90 hover:text-background"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                    }
                  >
                    {pricing}
                  </Button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <p className="text-sm font-medium mb-3">Platform</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Windows", icon: Monitor },
                  { name: "Mac", icon: Apple },
                  { name: "Android", icon: Smartphone },
                  { name: "iOS", icon: Smartphone },
                ].map((platform) => (
                  <Button
                    key={platform.name}
                    onClick={() =>
                      toggleFilter(platformFilter, setPlatformFilter, platform.name)
                    }
                    variant="outline"
                    className={
                      platformFilter.includes(platform.name)
                        ? "bg-white text-background hover:bg-white/90 hover:text-background"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                    }
                  >
                    <platform.icon className="w-4 h-4 mr-2" />
                    {platform.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Detection */}
            <div>
              <p className="text-sm font-medium mb-3">Detection</p>
              <div className="flex flex-wrap gap-2">
                {["Undetected", "Detected", "Client Mod Bypass"].map((detection) => (
                  <Button
                    key={detection}
                    onClick={() =>
                      toggleFilter(detectionFilter, setDetectionFilter, detection)
                    }
                    variant="outline"
                    className={
                      detectionFilter.includes(detection)
                        ? "bg-white text-background hover:bg-white/90 hover:text-background"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                    }
                  >
                    {detection}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exploit Details Dialog */}
      <Dialog open={!!selectedExploit} onOpenChange={(open) => !open && setSelectedExploit(null)}>
        <DialogContent className="bg-background border-white/10 text-white max-w-2xl rounded">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">{selectedExploit?.title}</DialogTitle>
              {selectedExploit && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                        selectedExploit.updateStatus
                          ? "bg-green-400"
                          : "bg-red-400"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${
                        selectedExploit.updateStatus ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      selectedExploit.updateStatus ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {selectedExploit.updateStatus ? "Online" : "Offline"}
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>
          
          {selectedExploit && (
            <div className="space-y-4 mt-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/60 mb-1">Platform</p>
                  <p className="text-white">{selectedExploit.platform}</p>
                </div>
                <div>
                  <p className="text-white/60 mb-1">Type</p>
                  <p className="text-white">{selectedExploit.extype}</p>
                </div>
              </div>

              {/* Status Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/60 mb-1">Detection Status</p>
                  <Badge
                    className={`px-2 py-0.5 rounded text-xs ${
                      selectedExploit.detected
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-green-500/20 text-green-400 border border-green-500/30"
                    }`}
                  >
                    {selectedExploit.detected ? "Detected" : "Undetected"}
                  </Badge>
                </div>
                <div>
                  <p className="text-white/60 mb-1">sUNC Status</p>
                  <Badge
                    className={`px-2 py-0.5 rounded text-xs ${
                      selectedExploit.uncStatus
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}
                  >
                    {selectedExploit.uncStatus ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>

              {/* sUNC Percentage */}
              {selectedExploit.suncPercentage !== undefined && (
                <div>
                  <p className="text-white/60 mb-2 text-sm">sUNC Percentage</p>
                  <div className="h-3 w-full bg-white/10 rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        selectedExploit.suncPercentage >= 100
                          ? "bg-green-500"
                          : selectedExploit.suncPercentage >= 97
                            ? "bg-yellow-500"
                            : "bg-orange-500"
                      }`}
                      style={{ width: `${selectedExploit.suncPercentage}%` }}
                    />
                  </div>
                  <p className="text-white/80 text-sm mt-1">{selectedExploit.suncPercentage}%</p>
                </div>
              )}

              {/* Features */}
              <div>
                <p className="text-white/60 mb-2 text-sm">Features</p>
                <div className="flex flex-wrap gap-2">
                  {selectedExploit.decompiler && (
                    <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-xs">
                      Decompiler
                    </Badge>
                  )}
                  {selectedExploit.multiInject && (
                    <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded text-xs">
                      Multi Inject
                    </Badge>
                  )}
                  {selectedExploit.elementCertified && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded text-xs">
                      Element Certified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* sUNC Test Results Dialog */}
      <Dialog open={!!suncTestExploit} onOpenChange={(open) => !open && setSuncTestExploit(null)}>
        <DialogContent className="bg-background border-white/10 text-white max-w-3xl rounded max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              sUNC Test Results - {suncTestExploit?.title}
            </DialogTitle>
          </DialogHeader>
          
          {suncTestLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-white/60" />
            </div>
          ) : suncTestData ? (
            <div className="space-y-6 mt-4">
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10 rounded">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <p className="text-2xl font-bold text-green-400">
                        {suncTestData.tests?.passed?.length || 0}
                      </p>
                    </div>
                    <p className="text-white/60 text-sm">Passed</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 rounded">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <X className="w-5 h-5 text-red-400" />
                      <p className="text-2xl font-bold text-red-400">
                        {suncTestData.tests?.failed?.length || 0}
                      </p>
                    </div>
                    <p className="text-white/60 text-sm">Failed</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 rounded">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-white/80" />
                      <p className="text-2xl font-bold text-white">
                        {suncTestData.timeTaken?.toFixed(2) || "0.00"}s
                      </p>
                    </div>
                    <p className="text-white/60 text-sm">Duration</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 rounded">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Box className="w-5 h-5 text-white/80" />
                      <p className="text-2xl font-bold text-white">
                        {suncTestData.version || "N/A"}
                      </p>
                    </div>
                    <p className="text-white/60 text-sm">Version</p>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Circle */}
              <div className="flex justify-center">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={
                        ((suncTestData.tests?.passed?.length || 0) /
                          ((suncTestData.tests?.passed?.length || 0) +
                            (suncTestData.tests?.failed?.length || 0))) *
                          100 >=
                        95
                          ? "#22c55e"
                          : "#eab308"
                      }
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${
                        ((suncTestData.tests?.passed?.length || 0) /
                          ((suncTestData.tests?.passed?.length || 0) +
                            (suncTestData.tests?.failed?.length || 0))) *
                        352
                      } 352`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-white">
                      {Math.round(
                        ((suncTestData.tests?.passed?.length || 0) /
                          ((suncTestData.tests?.passed?.length || 0) +
                            (suncTestData.tests?.failed?.length || 0))) *
                          100
                      )}
                      %
                    </p>
                    <p className="text-xs text-white/60">
                      {suncTestData.tests?.passed?.length || 0}/
                      {(suncTestData.tests?.passed?.length || 0) +
                        (suncTestData.tests?.failed?.length || 0)}{" "}
                      passed
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search functions..."
                  value={suncTestSearch}
                  onChange={(e) => setSuncTestSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Functions List */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {suncTestData.tests?.passed
                  ?.filter((func: string) =>
                    func.toLowerCase().includes(suncTestSearch.toLowerCase())
                  )
                  .map((func: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-white/5 rounded hover:bg-white/10 transition-colors"
                    >
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-white/80 font-mono">{func}</span>
                    </div>
                  ))}
                {suncTestData.tests?.failed
                  ?.filter((func: string) =>
                    func.toLowerCase().includes(suncTestSearch.toLowerCase())
                  )
                  .map((func: string, idx: number) => (
                    <div
                      key={`failed-${idx}`}
                      className="flex items-center gap-2 p-2 bg-white/5 rounded hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="text-sm text-white/80 font-mono">{func}</span>
                    </div>
                  ))}
                {suncTestData.tests?.passed?.filter((func: string) =>
                  func.toLowerCase().includes(suncTestSearch.toLowerCase())
                ).length === 0 &&
                  suncTestData.tests?.failed?.filter((func: string) =>
                    func.toLowerCase().includes(suncTestSearch.toLowerCase())
                  ).length === 0 && (
                    <div className="text-center py-8 text-white/60 text-sm">
                      No functions found
                    </div>
                  )}
              </div>

              {/* View Full Results Button */}
              {suncTestExploit?.sunc?.suncScrap && suncTestExploit?.sunc?.suncKey && (
                <div className="pt-4 border-t border-white/10">
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded"
                    onClick={() => {
                      const scrap = suncTestExploit.sunc?.suncScrap
                      const key = suncTestExploit.sunc?.suncKey
                      if (scrap && key) {
                        window.open(
                          `https://rubis.app/view/?scrap=${scrap}&key=${key}`,
                          "_blank"
                        )
                      }
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Results on Rubis
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-white/60">
              No test data available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

