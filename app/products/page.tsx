import { Suspense } from "react";
import ProductsPageFallback from "@/components/products-page-fallback";
import ProductsPageClient from "@/components/products-page-client";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageClient />
    </Suspense>
  );
}
