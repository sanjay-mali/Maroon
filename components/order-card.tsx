import Link from "next/link"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface OrderCardProps {
  orderId: string
  date: string
  status: "Processing" | "Shipped" | "Delivered"
  items: number
  total: number
}

export default function OrderCard({ orderId, date, status, items, total }: OrderCardProps) {
  return (
    <div className="border rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Order #{orderId}</h3>
            <Badge variant={status === "Delivered" ? "default" : status === "Shipped" ? "secondary" : "outline"}>
              {status}
            </Badge>
          </div>
          <div className="text-sm text-gray-500 mt-1">Placed on {date}</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="font-medium">${total.toFixed(2)}</div>
          </div>

          <Button asChild>
            <Link href={`/profile/orders/${orderId}`}>View Details</Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Package size={16} />
        <span>
          {items} {items === 1 ? "item" : "items"}
        </span>
      </div>
    </div>
  )
}
