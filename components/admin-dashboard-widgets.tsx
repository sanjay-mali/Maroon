import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowUpRight, ArrowDownRight, Clock, Truck, CheckCircle, XCircle } from "lucide-react";

// Stats Card
export function StatsCard({ title, value, icon: Icon, trend, change, isLoading }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{isLoading ? "—" : value}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        {!isLoading && (
          <div className="mt-4 flex items-center">
            {trend === "up" ? (
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}>{change} from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Low Stock Product Item
export function LowStockProductItem({ product, formatCurrency }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        <img src={product.images?.[0] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Stock: <span className="font-medium text-red-500">{product.stock}</span> / 10
          </p>
          <Progress value={(product.stock / 10) * 100} className="h-1 w-20" />
        </div>
      </div>
      <div className="text-sm font-medium">{formatCurrency(product.discount_price || product.price)}</div>
    </div>
  );
}

// Recent Order Item
export function RecentOrderItem({ order, formatCurrency, formatRelativeDate }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge
            variant={
              order.status?.toLowerCase() === "processing"
                ? "outline"
                : order.status?.toLowerCase() === "shipped"
                ? "secondary"
                : order.status?.toLowerCase() === "delivered"
                ? "default"
                : "destructive"
            }
            className="capitalize"
          >
            {order.status || "Processing"}
          </Badge>
          <p className="text-xs text-gray-500">#{order.$id.slice(0, 6)}</p>
        </div>
        {order.items && order.items.length > 0 ? (
          <div className="space-y-0.5">
            {order.items.slice(0, 2).map((item: any, idx: number) => (
              <p key={idx} className="text-sm font-medium truncate">{item.name}</p>
            ))}
            {order.items.length > 2 && (
              <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
            )}
          </div>
        ) : (
          <p className="text-sm font-medium">Order items unavailable</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {order.shippingAddress?.fullName || "Customer"} • {formatRelativeDate(order.createdAt)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{formatCurrency(order.amount?.total || 0)}</p>
        <p className="text-xs text-gray-500 mt-1">{order.items?.length || order.itemsCount || 0} items</p>
      </div>
    </div>
  );
}

// Order Status Card
export function OrderStatusCard({ icon, count, label, color, isLoading }: any) {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className={`p-2 rounded-full ${color} mb-2`}>{icon}</div>
      <h4 className="text-xl font-bold">{isLoading ? "—" : count}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

// Top Selling Product Item
export function TopSellingProductItem({ product, index, formatCurrency }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-6 text-center font-medium text-gray-500 dark:text-gray-400">#{index + 1}</div>
      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        <img src={product.images?.[0] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{product.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.sold} units sold</p>
      </div>
      <div className="text-sm font-medium">{formatCurrency(product.revenue)}</div>
    </div>
  );
}