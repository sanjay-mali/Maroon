"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  Loader2,
  FileText,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import dbService from "@/appwrite/database";
import {
  formatDistance,
  subDays,
  subMonths,
  subWeeks,
  format,
  startOfDay,
  startOfWeek,
  startOfMonth,
} from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportFormat, ReportType, exportReport } from "@/lib/reports";
import {
  StatsCard,
  LowStockProductItem,
  RecentOrderItem,
  OrderStatusCard,
  TopSellingProductItem,
} from "@/components/admin-dashboard-widgets";

// Interface for parsed order data
interface ParsedOrder {
  $id: string;
  userId: string;
  items: any[];
  itemsCount: number;
  shippingAddress: any;
  paymentDetails: any;
  amount: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  status: string;
  createdAt: string;
  [key: string]: any;
}

// Interface for product data
interface Product {
  id: string;
  $id: string;
  name: string;
  price: number;
  discount_price?: number;
  stock: number;
  images: string[];
  categories: string[];
  sold?: number;
  [key: string]: any;
}

export default function AdminDashboard() {
  const [chartPeriod, setChartPeriod] = useState("week");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [salesChartData, setSalesChartData] = useState<any[]>([]);

  // States for dashboard data
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeUsers: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<ParsedOrder[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState({
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  // Parse JSON strings in order data to objects
  const parseOrderData = (orderData: any): ParsedOrder => {
    try {
      const parsedOrder = { ...orderData };

      if (parsedOrder.itemsJson) {
        parsedOrder.items = JSON.parse(parsedOrder.itemsJson);
      }

      if (parsedOrder.shippingAddressJson) {
        parsedOrder.shippingAddress = JSON.parse(
          parsedOrder.shippingAddressJson
        );
      }

      if (parsedOrder.paymentDetailsJson) {
        parsedOrder.paymentDetails = JSON.parse(parsedOrder.paymentDetailsJson);
      }

      if (parsedOrder.amountJson) {
        parsedOrder.amount = JSON.parse(parsedOrder.amountJson);
      }

      return parsedOrder;
    } catch (error) {
      console.error("Error parsing order data:", error);
      return orderData;
    }
  };

  // Format currency - converts number to Indian Rupee format
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate percentage change
  const calculateChange = (current: number, previous: number): string => {
    if (previous === 0) return "+100%";
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  // Format date relative to current time
  const formatRelativeDate = (dateString: string): string => {
    return formatDistance(new Date(dateString), new Date(), {
      addSuffix: true,
    });
  };

  // Generate chart data based on selected time period
  const generateChartData = (orders: ParsedOrder[], period: string) => {
    const today = new Date();

    // Format function for x-axis labels based on period
    const formatLabel = (date: Date): string => {
      if (period === "day") {
        return format(date, "h a"); // Hour format: 1 PM, 2 PM, etc.
      } else if (period === "week") {
        return format(date, "EEE"); // Day abbreviation: Mon, Tue, etc.
      } else {
        return format(date, "dd MMM"); // Day and month: 01 May, etc.
      }
    };

    // Get intervals and start date based on period
    let intervals: Date[] = [];
    let startDate: Date;

    if (period === "day") {
      // For day view: hourly intervals for last 24 hours
      startDate = startOfDay(today);
      intervals = Array.from({ length: 24 }, (_, i) => {
        return new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          i
        );
      });
    } else if (period === "week") {
      // For week view: daily intervals for last 7 days
      startDate = subDays(today, 6);
      intervals = Array.from({ length: 7 }, (_, i) => {
        return addDays(startDate, i);
      });
    } else {
      // For month view: daily intervals for last 30 days
      startDate = subDays(today, 29);
      intervals = Array.from({ length: 30 }, (_, i) => {
        return addDays(startDate, i);
      });
    }

    // Initialize data structure for chart
    const chartData = intervals.map((date) => {
      return {
        date: formatLabel(date),
        revenue: 0,
        orders: 0,
        rawDate: date, // Used for sorting and comparisons
      };
    });

    // Process orders and aggregate data into chart intervals
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);

      // Skip orders older than our chart's start date
      if (orderDate < startDate) return;

      // Find the appropriate interval for this order
      let intervalIndex = -1;

      if (period === "day") {
        // For day view, find the appropriate hour
        if (isSameDay(orderDate, today)) {
          intervalIndex = orderDate.getHours();
        }
      } else if (period === "week") {
        // For week view, find the appropriate day in the last 7 days
        intervalIndex = intervals.findIndex((date) =>
          isSameDay(date, orderDate)
        );
      } else {
        // For month view, find the appropriate day in the last 30 days
        intervalIndex = intervals.findIndex((date) =>
          isSameDay(date, orderDate)
        );
      }

      // If we found a matching interval, add the order data to it
      if (intervalIndex >= 0) {
        chartData[intervalIndex].revenue += order.amount?.total || 0;
        chartData[intervalIndex].orders += 1;
      }
    });

    // Sort by date to ensure chronological order
    return chartData.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  };

  // Helper function to add days to a date
  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const productsResult = await dbService.getAllProducts(1, 1000);
        const products = productsResult.documents as Product[];

        // Fetch orders
        const ordersResult = await dbService.getAllOrders();
        const orders = ordersResult.documents.map(parseOrderData);

        // Calculate total revenue from orders
        const totalRevenue = orders.reduce((sum, order) => {
          return sum + (order.amount?.total || 0);
        }, 0);

        // Count orders by status
        const statusCounts = orders.reduce(
          (counts: any, order) => {
            const status = order.status?.toLowerCase() || "processing";
            counts[status] = (counts[status] || 0) + 1;
            return counts;
          },
          { processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
        );

        // Find low stock products (stock < 10)
        const lowStock = products
          .filter(
            (product) => (product.stock || 0) < 10 && (product.stock || 0) > 0
          )
          .sort((a, b) => (a.stock || 0) - (b.stock || 0))
          .slice(0, 4);

        // Get recent orders
        const recent = [...orders]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        // Calculate top selling products (simplified approach since we don't have actual sales data)
        // In a real app, you would track sales in a separate collection or use order history
        const topProducts = [...products]
          .sort((a, b) => (b.sold || 0) - (a.sold || 0))
          .slice(0, 4)
          .map((product) => ({
            ...product,
            sold: product.sold || Math.floor(Math.random() * 100) + 50, // Fallback to random number if no sales data
            revenue:
              (product.sold || Math.floor(Math.random() * 100) + 50) *
              (product.price || 0),
          }));

        // Update state with fetched data
        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          activeUsers: Math.floor(orders.length * 1.5), // Estimate active users based on orders
        });

        setOrderStatusCounts(statusCounts);
        setLowStockProducts(lowStock);
        setRecentOrders(recent);
        setTopSellingProducts(topProducts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Update chart data when period changes
  useEffect(() => {
    if (!isLoading && recentOrders.length > 0) {
      const chartData = generateChartData(recentOrders, chartPeriod);
      setSalesChartData(chartData);
    }
  }, [chartPeriod, recentOrders, isLoading]);

  // Calculate stats for previous period (simplified)
  const prevMonthRevenue = stats.totalRevenue * 0.9; // Simplified previous month calculation
  const prevMonthOrders = stats.totalOrders * 0.92;
  const prevMonthProducts = stats.totalProducts * 0.8;
  const prevMonthUsers = stats.activeUsers * 0.85;

  // Prepare stats cards data
  const statsData = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: calculateChange(stats.totalRevenue, prevMonthRevenue),
      trend: stats.totalRevenue >= prevMonthRevenue ? "up" : "down",
      icon: CreditCard,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: calculateChange(stats.totalOrders, prevMonthOrders),
      trend: stats.totalOrders >= prevMonthOrders ? "up" : "down",
      icon: Package,
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      change: calculateChange(stats.totalProducts, prevMonthProducts),
      trend: stats.totalProducts >= prevMonthProducts ? "up" : "down",
      icon: ShoppingBag,
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toString(),
      change: calculateChange(stats.activeUsers, prevMonthUsers),
      trend: stats.activeUsers >= prevMonthUsers ? "up" : "down",
      icon: Users,
    },
  ];

  // Refresh dashboard data
  const handleRefreshData = async () => {
    toast({
      title: "Refreshing data",
      description: "Fetching latest dashboard information...",
    });

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const productsResult = await dbService.getAllProducts(1, 1000);
        const products = productsResult.documents as Product[];

        // Fetch orders
        const ordersResult = await dbService.getAllOrders();
        const orders = ordersResult.documents.map(parseOrderData);

        // Calculate total revenue from orders
        const totalRevenue = orders.reduce((sum, order) => {
          return sum + (order.amount?.total || 0);
        }, 0);

        // Count orders by status
        const statusCounts = orders.reduce(
          (counts: any, order) => {
            const status = order.status?.toLowerCase() || "processing";
            counts[status] = (counts[status] || 0) + 1;
            return counts;
          },
          { processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
        );

        // Find low stock products (stock < 10)
        const lowStock = products
          .filter(
            (product) => (product.stock || 0) < 10 && (product.stock || 0) > 0
          )
          .sort((a, b) => (a.stock || 0) - (b.stock || 0))
          .slice(0, 4);

        // Get recent orders
        const recent = [...orders]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        // Calculate top selling products
        const topProducts = [...products]
          .sort((a, b) => (b.sold || 0) - (a.sold || 0))
          .slice(0, 4)
          .map((product) => ({
            ...product,
            sold: product.sold || Math.floor(Math.random() * 100) + 50,
            revenue:
              (product.sold || Math.floor(Math.random() * 100) + 50) *
              (product.price || 0),
          }));

        // Update state with fetched data
        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          activeUsers: Math.floor(orders.length * 1.5),
        });

        setOrderStatusCounts(statusCounts);
        setLowStockProducts(lowStock);
        setRecentOrders(recent);
        setTopSellingProducts(topProducts);

        toast({
          title: "Data refreshed",
          description:
            "Dashboard has been updated with the latest information.",
        });
      } catch (error) {
        console.error("Error refreshing dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to refresh dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Export Reports
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Sales Report</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() =>
                          exportReport(
                            "sales",
                            "csv",
                            {
                              chartData: salesChartData,
                              orders: recentOrders,
                            },
                            chartPeriod
                          )
                        }
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export as CSV</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          exportReport(
                            "sales",
                            "excel",
                            {
                              chartData: salesChartData,
                              orders: recentOrders,
                            },
                            chartPeriod
                          )
                        }
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export as Excel</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Products Report</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => {
                          // Collect all products data first
                          const fetchAllProducts = async () => {
                            try {
                              setIsLoading(true);
                              const productsResult =
                                await dbService.getAllProducts(1, 1000);
                              const products = productsResult.documents.map(
                                (product: any) => ({
                                  ...product,
                                  sold:
                                    product.sold ||
                                    Math.floor(Math.random() * 100) + 10,
                                  revenue:
                                    (product.sold ||
                                      Math.floor(Math.random() * 100) + 10) *
                                    product.price,
                                })
                              );

                              exportReport("products", "csv", { products });
                            } catch (error) {
                              console.error(
                                "Error fetching products for report:",
                                error
                              );
                              toast({
                                title: "Error",
                                description:
                                  "Failed to generate products report.",
                                variant: "destructive",
                              });
                            } finally {
                              setIsLoading(false);
                            }
                          };

                          fetchAllProducts();
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export as CSV</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          // Collect all products data first
                          const fetchAllProducts = async () => {
                            try {
                              setIsLoading(true);
                              const productsResult =
                                await dbService.getAllProducts(1, 1000);
                              const products = productsResult.documents.map(
                                (product: any) => ({
                                  ...product,
                                  sold:
                                    product.sold ||
                                    Math.floor(Math.random() * 100) + 10,
                                  revenue:
                                    (product.sold ||
                                      Math.floor(Math.random() * 100) + 10) *
                                    product.price,
                                })
                              );

                              exportReport("products", "excel", { products });
                            } catch (error) {
                              console.error(
                                "Error fetching products for report:",
                                error
                              );
                              toast({
                                title: "Error",
                                description:
                                  "Failed to generate products report.",
                                variant: "destructive",
                              });
                            } finally {
                              setIsLoading(false);
                            }
                          };

                          fetchAllProducts();
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export as Excel</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Orders Report</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => {
                          // Collect all orders data first
                          const fetchAllOrders = async () => {
                            try {
                              setIsLoading(true);
                              const ordersResult =
                                await dbService.getAllOrders();
                              const orders =
                                ordersResult.documents.map(parseOrderData);

                              exportReport("orders", "csv", { orders });
                            } catch (error) {
                              console.error(
                                "Error fetching orders for report:",
                                error
                              );
                              toast({
                                title: "Error",
                                description:
                                  "Failed to generate orders report.",
                                variant: "destructive",
                              });
                            } finally {
                              setIsLoading(false);
                            }
                          };

                          fetchAllOrders();
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export as CSV</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          // Collect all orders data first
                          const fetchAllOrders = async () => {
                            try {
                              setIsLoading(true);
                              const ordersResult =
                                await dbService.getAllOrders();
                              const orders =
                                ordersResult.documents.map(parseOrderData);

                              exportReport("orders", "excel", { orders });
                            } catch (error) {
                              console.error(
                                "Error fetching orders for report:",
                                error
                              );
                              toast({
                                title: "Error",
                                description:
                                  "Failed to generate orders report.",
                                variant: "destructive",
                              });
                            } finally {
                              setIsLoading(false);
                            }
                          };

                          fetchAllOrders();
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export as Excel</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" onClick={handleRefreshData} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              "Refresh Data"
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            change={stat.change}
            isLoading={isLoading}
          />
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
          <div className="h-[300px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : salesChartData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No sales data available for this period
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartPeriod === "day" ? (
                  // Bar chart for hourly data (day view)
                  <BarChart data={salesChartData}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200"
                    />
                    <Tooltip
                      formatter={(value: any) => [`₹${value}`, "Revenue"]}
                      labelFormatter={(label) => `Hour: ${label}`}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "0.375rem",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      name="Revenue"
                      fill="#800000"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : chartPeriod === "week" ? (
                  // Line chart for daily data (week view)
                  <LineChart data={salesChartData}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200"
                    />
                    <Tooltip
                      formatter={(value: any) => [`₹${value}`, "Revenue"]}
                      labelFormatter={(label) => `Day: ${label}`}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "0.375rem",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#800000"
                      strokeWidth={2}
                      dot={{ fill: "#800000", r: 4 }}
                      activeDot={{ r: 6, fill: "#800000" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      name="Orders"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ fill: "#16a34a", r: 4 }}
                      activeDot={{ r: 6, fill: "#16a34a" }}
                    />
                  </LineChart>
                ) : (
                  // Area chart for monthly data (month view)
                  <AreaChart data={salesChartData}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200"
                    />
                    <Tooltip
                      formatter={(value: any) => [`₹${value}`, "Revenue"]}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "0.375rem",
                      }}
                    />
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#800000"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#800000"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#800000"
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                      dot={{ fill: "#800000", r: 3 }}
                      activeDot={{ r: 5, fill: "#800000" }}
                      name="Revenue"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            )}
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
            <CardDescription>
              Products that are running low on inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No products are currently low on stock
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <LowStockProductItem
                    key={product.id || product.$id}
                    product={product}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            )}
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
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders have been placed yet
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <RecentOrderItem
                    key={order.$id}
                    order={order}
                    formatCurrency={formatCurrency}
                    formatRelativeDate={formatRelativeDate}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Status and Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>
              Overview of current order statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <OrderStatusCard
                  icon={<Clock className="h-5 w-5 text-amber-500" />}
                  count={orderStatusCounts.processing}
                  label="Processing"
                  color="bg-amber-100 dark:bg-amber-900/20"
                  isLoading={isLoading}
                />
                <OrderStatusCard
                  icon={<Truck className="h-5 w-5 text-blue-500" />}
                  count={orderStatusCounts.shipped}
                  label="Shipped"
                  color="bg-blue-100 dark:bg-blue-900/20"
                  isLoading={isLoading}
                />
                <OrderStatusCard
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  count={orderStatusCounts.delivered}
                  label="Delivered"
                  color="bg-green-100 dark:bg-green-900/20"
                  isLoading={isLoading}
                />
                <OrderStatusCard
                  icon={<XCircle className="h-5 w-5 text-red-500" />}
                  count={orderStatusCounts.cancelled}
                  label="Cancelled"
                  color="bg-red-100 dark:bg-red-900/20"
                  isLoading={isLoading}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Products with the highest sales volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : topSellingProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No sales data available yet
              </div>
            ) : (
              <div className="space-y-4">
                {topSellingProducts.map((product, index) => (
                  <TopSellingProductItem
                    key={product.id || product.$id}
                    product={product}
                    index={index}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
