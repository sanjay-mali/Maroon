"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Dummy data for the dashboard
const stats = [
  {
    title: "Total Revenue",
    value: "₹1,25,489",
    change: "+12.5%",
    trend: "up",
    icon: CreditCard,
  },
  {
    title: "Total Orders",
    value: "1,245",
    change: "+8.2%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Total Products",
    value: "356",
    change: "+24.5%",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    title: "Active Users",
    value: "2,845",
    change: "+18.7%",
    trend: "up",
    icon: Users,
  },
]

const lowStockProducts = [
  {
    id: "1",
    name: "Floral Print Maxi Dress",
    stock: 3,
    threshold: 10,
    price: "₹2,999",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "High-Waisted Skinny Jeans",
    stock: 5,
    threshold: 15,
    price: "₹1,999",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Oversized Boyfriend Shirt",
    stock: 2,
    threshold: 10,
    price: "₹1,499",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Faux Leather Jacket",
    stock: 4,
    threshold: 8,
    price: "₹3,499",
    image: "/placeholder.svg?height=40&width=40",
  },
]

const recentOrders = [
  {
    id: "ORD12345",
    customer: "Priya Sharma",
    date: "2 hours ago",
    amount: "₹4,998",
    status: "processing",
    items: 2,
  },
  {
    id: "ORD12344",
    customer: "Ananya Patel",
    date: "5 hours ago",
    amount: "₹1,999",
    status: "shipped",
    items: 1,
  },
  {
    id: "ORD12343",
    customer: "Neha Gupta",
    date: "8 hours ago",
    amount: "₹6,497",
    status: "delivered",
    items: 3,
  },
  {
    id: "ORD12342",
    customer: "Kavita Singh",
    date: "1 day ago",
    amount: "₹2,999",
    status: "cancelled",
    items: 1,
  },
  {
    id: "ORD12341",
    customer: "Meera Reddy",
    date: "1 day ago",
    amount: "₹5,998",
    status: "delivered",
    items: 2,
  },
]

const topSellingProducts = [
  {
    id: "1",
    name: "Floral Print Maxi Dress",
    sold: 145,
    revenue: "₹4,34,855",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "High-Waisted Skinny Jeans",
    sold: 132,
    revenue: "₹2,63,868",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Oversized Boyfriend Shirt",
    sold: 118,
    revenue: "₹1,76,882",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Faux Leather Jacket",
    sold: 98,
    revenue: "₹3,42,902",
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminDashboard() {
  const [chartPeriod, setChartPeriod] = useState("week")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Reports
          </Button>
          <Button size="sm">Refresh Data</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {stat.change} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Sales Overview</CardTitle>
            <Tabs defaultValue={chartPeriod} onValueChange={setChartPeriod}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            {chartPeriod === "day"
              ? "Sales data for today"
              : chartPeriod === "week"
                ? "Sales data for this week"
                : "Sales data for this month"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            {/* Placeholder for chart */}
            <div className="text-center">
              <TrendingUp className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Sales chart visualization would appear here with real data integration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Products and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Low Stock Products
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/products">View All</Link>
              </Button>
            </div>
            <CardDescription>Products that are running low on inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Stock: <span className="font-medium text-red-500">{product.stock}</span> / {product.threshold}
                      </p>
                      <Progress value={(product.stock / product.threshold) * 100} className="h-1 w-20" />
                    </div>
                  </div>
                  <div className="text-sm font-medium">{product.price}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/orders">View All</Link>
              </Button>
            </div>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{order.id}</p>
                      <Badge
                        variant={
                          order.status === "processing"
                            ? "outline"
                            : order.status === "shipped"
                              ? "secondary"
                              : order.status === "delivered"
                                ? "default"
                                : "destructive"
                        }
                        className="capitalize"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {order.customer} • {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.amount}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{order.items} items</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status and Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Overview of current order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/20 mb-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <h4 className="text-xl font-bold">48</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Processing</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-2">
                  <Truck className="h-5 w-5 text-blue-500" />
                </div>
                <h4 className="text-xl font-bold">32</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shipped</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <h4 className="text-xl font-bold">156</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Delivered</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20 mb-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <h4 className="text-xl font-bold">12</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Products with the highest sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-6 text-center font-medium text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.sold} units sold</p>
                  </div>
                  <div className="text-sm font-medium">{product.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
