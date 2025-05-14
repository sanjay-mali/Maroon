"use client";
import Head from "next/head";
import ProductsGrid from "@/components/products-grid";
import ProductsFilter from "@/components/products-filter";
import ProductsSort from "@/components/products-sort";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dbService from "@/appwrite/database";

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("category");
  const [categories, setCategories] = useState<any[]>([]);
  const [pageTitle, setPageTitle] = useState("Women's Western Wear");

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await dbService.getAllCategories(1, 100);
      setCategories(cats.documents || []);
      if (categoryName) {
        const decodedName = decodeURIComponent(categoryName)
          .trim()
          .toLowerCase();
        const match = cats.documents.find(
          (cat: any) => cat.name.trim().toLowerCase() === decodedName
        );
        setPageTitle(match ? match.name : "Products");
      } else {
        setPageTitle("Women's Western Wear");
      }
    };
    fetchCategories();
  }, [categoryName]);

  return (
    <>
      <Head>
        <title>{pageTitle} | Maroon Fashion</title>
        <meta
          name="description"
          content={`Browse our collection of premium women's western wear including tops, dresses, bottoms and more. Find the perfect outfit for every occasion.`}
        />
      </Head>
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
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Filter size={16} />
              <span>Filter Products</span>
            </Button>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">{pageTitle}</h1>
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
    </>
  );
}
