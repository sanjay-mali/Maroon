"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ArrowUpDown, MoreHorizontal, Eye, Download, Clock, Truck, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

// Dummy data for orders
const orders = [
  {
    id: "ORD12345",
    customer: "Priya Sharma",
    email: "priya.sharma@example.com",
    date: "2023-04-28",
    amount: 4998,
    status: "processing",
    items: 2,
    payment: "Credit Card",
  },
  {
    id: "ORD12344",
    customer: "Ananya Patel",
    email: "ananya.patel@example.com",
    date: "2023-04-28",
    amount: 1999,
    status: "shipped",
    items: 1,
    payment: "UPI",
  },
  {
    id: "ORD12343",
    customer: "Neha Gupta",
    email: "neha.gupta@example.com",
    date: "2023-04-27",
    amount: 6497,
    status: "delivered",
    items: 3,
    payment: "Credit Card",
  },
  {
    id: "ORD12342",
    customer: "Kavita Singh",
    email: "kavita.singh@example.com",
    date: "2023-04-27",
    amount: 2999,
    status: "cancelled",
    items: 1,
    payment: "Cash on Delivery",
  },
  {
    id: "ORD12341",
    customer: "Meera Reddy",
    email: "meera.reddy@example.com",
    date: "2023-04-26",
    amount: 5998,
    status: "delivered",
    items: 2,
    payment: "Debit Card",
  },
  {
    id: "ORD12340",
    customer: "Ritu Desai",
    email: "ritu.desai@example.com",
    date: "2023-04-26",
    amount: 3499,
    status: "processing",
    items: 1,
    payment: "UPI",
  },
  {
    id: "ORD12339",
    customer: "Anjali Mehta",
    email: "anjali.mehta@example.com",
    date: "2023-04-25",
    amount: 8997,
    status: "shipped",
    items: 3,
    payment: "Credit Card",
  },
  {
    id: "ORD12338",
    customer: "Divya Joshi",
    email: "divya.joshi@example.com",
    date: "2023-04-25",
    amount: 1299,
    status: "delivered",
    items: 1,
    payment: "Debit Card",
  },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {getStatusIcon(status)}
            <span className="ml-1 capitalize">Processing</span>
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {getStatusIcon(status)}
            <span className="ml-1 capitalize">Shipped</span>
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {getStatusIcon(status)}
            <span className="ml-1 capitalize">Delivered</span>
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {getStatusIcon(status)}
            <span className="ml-1 capitalize">Cancelled</span>
          </Badge>
        )
      default:
        return null
    }
  }

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    toast({
      title: "Order status updated",
      description: `Order ${orderId} has been marked as ${newStatus}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search by order ID, customer name, or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Amount
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No orders found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{order.customer}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.payment}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/orders/${order.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, "processing")}
                              disabled={order.status === "processing"}
                            >
                              <Clock className="h-4 w-4 mr-2 text-amber-500" />
                              Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, "shipped")}
                              disabled={order.status === "shipped"}
                            >
                              <Truck className="h-4 w-4 mr-2 text-blue-500" />
                              Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, "delivered")}
                              disabled={order.status === "delivered"}
                            >
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, "cancelled")}
                              disabled={order.status === "cancelled"}
                            >
                              <XCircle className="h-4 w-4 mr-2 text-red-500" />
                              Cancelled
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium">{filteredOrders.length}</span> of{" "}
              <span className="font-medium">{orders.length}</span> orders
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
