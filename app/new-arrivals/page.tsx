import ProductList from "@/components/product-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewArrivalsPage() {
  return (
    <div className="container-custom py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">New Arrivals</h1>
        <Button asChild variant="outline">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
      <ProductList filter="new" limit={1000} />
    </div>
  );
}
