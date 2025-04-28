import type { Metadata } from "next"
import ProductsGrid from "@/components/products-grid"
import ProductsFilter from "@/components/products-filter"
import ProductsSort from "@/components/products-sort"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "All Products | Maroon - Love for Fashion",
  description:
    "Browse our collection of premium ethnic wear including sarees, lehengas, kurtis and more. Find the perfect outfit for every occasion.",
}

export default function ProductsPage() {
  return (
    <>
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              <ProductsFilter />
            </div>
          </div>

          {/* Mobile filter button */}
          <div className="md:hidden mb-4">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Filter size={16} />
              <span>Filter Products</span>
            </Button>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>
              <ProductsSort />
            </div>

            <ProductsGrid />

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-1">
                <Button variant="outline" size="icon" disabled>
                  &lt;
                </Button>
                <Button variant="outline" size="icon" className="bg-gray-100">
                  1
                </Button>
                <Button variant="outline" size="icon">
                  2
                </Button>
                <Button variant="outline" size="icon">
                  3
                </Button>
                <Button variant="outline" size="icon">
                  &gt;
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
