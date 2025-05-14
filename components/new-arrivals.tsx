import ProductList from "@/components/product-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AllProductsSection from "@/components/all-products-section"

export default function NewArrivals() {
  return (
    <div className="space-y-16">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">New Arrivals</h2>
        <ProductList filter="new" limit={8} />
        <div className="flex justify-center mt-8">
          <Button asChild variant="outline" className="btn-outline">
            <Link href="/new-arrivals">View All New Arrivals</Link>
          </Button>
        </div>
      </div>
      
      {/* AllProductsSection handles its own API call and rendering */}
      <AllProductsSection limit={12} />
    </div>
  )
}
