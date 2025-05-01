import ProductList from "@/components/product-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewArrivals() {
  return (
    <div className="space-y-8">
      <ProductList filter="new" limit={8} />
      <div className="flex justify-center mt-8">
        <Button asChild variant="outline" className="btn-outline">
          <Link href="/new-arrivals">View All New Arrivals</Link>
        </Button>
      </div>
    </div>
  )
}
