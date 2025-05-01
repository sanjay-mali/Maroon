import ProductList from "@/components/product-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FeaturedProducts() {
  return (
    <div className="space-y-8">
      <ProductList filter="featured" limit={8} />
      <div className="flex justify-center mt-8">
        <Button asChild variant="outline" className="btn-outline">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </div>
  )
}
