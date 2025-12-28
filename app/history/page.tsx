"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/components/Nav"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Copy as CopyIcon, Check, ShoppingBag, CreditCard } from "lucide-react"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface PurchaseRow {
  id: string
  productTitle: string
  license: string
  price: number
  created_at: string
}

interface TopupRow {
  id: string
  amount: number
  method: string | null
  reference: string | null
  status: string | null
  created_at: string
}

type TabType = "purchase" | "topup"

// Copy Button Component with Animation
function CopyButton({ license }: { license: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(license)
      setCopied(true)
      toast.success("License copied", {
        description: "License key has been copied to your clipboard.",
      })
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      toast.error("Failed to copy", {
        description: "Please try again.",
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded relative"
      onClick={handleCopy}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check className="h-4 w-4 text-green-400" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CopyIcon className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

function createPurchaseColumns(): ColumnDef<PurchaseRow, any>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: any }) => (
        <span className="text-white/80 font-mono">
          {row.original.id.substring(0, 8)}
        </span>
      ),
    },
    {
      accessorKey: "productTitle",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-white">{row.original.productTitle}</span>,
    },
    {
      accessorKey: "license",
      header: "License",
      cell: ({ row }: { row: any }) => <span className="text-white/80 break-all">{row.original.license}</span>,
    },
    {
      accessorKey: "price",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => (
        <span className="text-green-400">
          ฿{Number(row.original.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => <span className="text-white/70 text-xs">{new Date(row.original.created_at).toLocaleString()}</span>,
    },
    {
      id: "actions",
      header: "Copy",
      cell: ({ row }: { row: any }) => <CopyButton license={row.original.license} />,
      enableHiding: false,
    },
    {
      // hidden column ใช้สำหรับ search อย่างเดียว
      id: "searchText",
      accessorFn: (row) =>
        `${row.id} ${row.productTitle} ${row.license} ${new Date(row.created_at).toLocaleString()}`.toLowerCase(),
      enableHiding: false,
    },
  ]
}

function createTopupColumns(): ColumnDef<TopupRow, any>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: any }) => (
        <span className="text-white/80 font-mono">
          {row.original.id.substring(0, 8)}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => (
        <span className="text-green-400">
          ฿{Number(row.original.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }: { row: any }) => {
        const method = row.original.method || ""
        let displayMethod = "-"
        if (method === "truemoney-angpao") {
          displayMethod = "TrueMoney Gift"
        } else if (method === "coupon") {
          displayMethod = "Coupon"
        } else if (method === "truemoney-card") {
          displayMethod = "TrueMoney Card"
        } else if (method) {
          displayMethod = method
        }
        return (
          <Badge variant="outline" className="!rounded border-white/20 bg-white/5 text-white">
            {displayMethod}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status || "unknown"
        const statusColors: Record<string, string> = {
          success: "bg-green-500/20 border-green-500/50 text-green-400",
          failed: "bg-red-500/20 border-red-500/50 text-red-400",
          pending: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
        }
        const colorClass = statusColors[status.toLowerCase()] || "bg-gray-500/20 border-gray-500/50 text-gray-400"
        return (
          <Badge variant="outline" className={`!rounded ${colorClass}`}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => <span className="text-white/70 text-xs">{new Date(row.original.created_at).toLocaleString()}</span>,
    },
    {
      // hidden column ใช้สำหรับ search อย่างเดียว
      id: "searchText",
      accessorFn: (row) =>
        `${row.id} ${row.amount} ${row.method ?? ""} ${row.status ?? ""} ${new Date(row.created_at).toLocaleString()}`.toLowerCase(),
      enableHiding: false,
    },
  ]
}

function DataTable<TData>({
  data,
  columns,
}: {
  data: TData[]
  columns: ColumnDef<TData, any>[]
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    searchText: false,
  })
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-3 py-4">
        <Input
          placeholder="Search..."
          value={(table.getColumn("searchText")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("searchText")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllLeafColumns()
                .filter((column) => column.id !== "searchText" && column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => {
              const size = Number(value)
              setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))
            }}
          >
            <SelectTrigger className="h-9 w-28 rounded-md border border-white/20 bg-black/40 px-2 text-sm text-white">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 text-white border border-white/20">
              {[5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-white/10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-white/70">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getRowModel().rows.length} row(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialTab = (searchParams.get("tab") === "topup" ? "topup" : "purchase") as TabType

  const [tab, setTab] = useState<TabType>(initialTab)
  const [purchase, setPurchase] = useState<PurchaseRow[]>([])
  const [topup, setTopup] = useState<TopupRow[]>([])
  const [loadingPurchase, setLoadingPurchase] = useState(false)
  const [loadingTopup, setLoadingTopup] = useState(false)

  // keep URL in sync when tab changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.replace(`/history?${params.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  useEffect(() => {
    if (!session?.user) return

    const fetchPurchase = async () => {
      try {
        setLoadingPurchase(true)
        const res = await fetch("/api/history/purchase")
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load purchase history")
        }
        setPurchase(data || [])
      } catch (err) {
        toast.error("Failed to load purchase history", {
          description: "Please try again later.",
        })
      } finally {
        setLoadingPurchase(false)
      }
    }

    const fetchTopup = async () => {
      try {
        setLoadingTopup(true)
        const res = await fetch("/api/history/topup")
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load topup history")
        }
        setTopup(data || [])
      } catch (err) {
        toast.error("Failed to load topup history", {
          description: "Please try again later.",
        })
      } finally {
        setLoadingTopup(false)
      }
    }

    fetchPurchase()
    fetchTopup()
  }, [session?.user])

  if (!session?.user) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-background overflow-x-hidden w-full">
        <Navbar />
        <main className="flex-1 pt-24">
          <div className="container mx-auto">
            <div className="text-center text-white/70">
              Please login to view your history.
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
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              History
            </h1>
            <p className="text-white/70 text-sm md:text-base">
              View your topup and purchase history.
            </p>
          </motion.div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
            <TabsList className="mb-4">
              <TabsTrigger value="purchase" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Purchase History
              </TabsTrigger>
              <TabsTrigger value="topup" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Topup History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="purchase">
              {loadingPurchase ? (
                <div className="text-white/70 py-8 text-center">Loading purchase history...</div>
              ) : (
                <DataTable
                  data={purchase}
                  columns={createPurchaseColumns()}
                />
              )}
            </TabsContent>

            <TabsContent value="topup">
              {loadingTopup ? (
                <div className="text-white/70 py-8 text-center">Loading topup history...</div>
              ) : (
                <DataTable
                  data={topup}
                  columns={createTopupColumns()}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}



