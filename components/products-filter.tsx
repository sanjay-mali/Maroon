"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/hooks/use-categories";

export default function ProductsFilter() {
  const [priceRange, setPriceRange] = useState([500, 10000]);
  const { categories, loading: loadingCategories } = useCategories();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category");

  const colorOptions = [
    { id: "black", name: "Black", value: "#000000" },
    { id: "white", name: "White", value: "#FFFFFF" },
    { id: "red", name: "Red", value: "#FF0000" },
    { id: "pink", name: "Pink", value: "#FFC0CB" },
    { id: "blue", name: "Blue", value: "#0000FF" },
    { id: "green", name: "Green", value: "#00FF00" },
    { id: "yellow", name: "Yellow", value: "#FFFF00" },
    { id: "purple", name: "Purple", value: "#800080" },
    { id: "gray", name: "Gray", value: "#808080" },
    { id: "orange", name: "Orange", value: "#FFA500" },
  ];
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  const selectedColors = (searchParams.get("color") || "")
    .split(",")
    .filter(Boolean);
  const selectedSizes = (searchParams.get("size") || "")
    .split(",")
    .filter(Boolean);
  const minPrice = Number(searchParams.get("minPrice")) || 500;
  const maxPrice = Number(searchParams.get("maxPrice")) || 10000;

  const handleCategoryChange = (name: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("category", name);
    router.push(`/products?${params.toString()}`);
  };

  const handleColorChange = (color: string) => {
    const params = new URLSearchParams(window.location.search);
    let colors = (params.get("color") || "").split(",").filter(Boolean);
    if (colors.includes(color)) {
      colors = colors.filter((c) => c !== color);
    } else {
      colors.push(color);
    }
    if (colors.length) {
      params.set("color", colors.join(","));
    } else {
      params.delete("color");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSizeChange = (size: string) => {
    const params = new URLSearchParams(window.location.search);
    let sizes = (params.get("size") || "").split(",").filter(Boolean);
    if (sizes.includes(size)) {
      sizes = sizes.filter((s) => s !== size);
    } else {
      sizes.push(size);
    }
    if (sizes.length) {
      params.set("size", sizes.join(","));
    } else {
      params.delete("size");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handlePriceChange = (range: number[]) => {
    const params = new URLSearchParams(window.location.search);
    params.set("minPrice", String(range[0]));
    params.set("maxPrice", String(range[1]));
    router.push(`/products?${params.toString()}`);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("color");
    params.delete("size");
    params.delete("minPrice");
    params.delete("maxPrice");
    // Do not clear category
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-lg">Filters</span>
        <button
          className="text-sm text-primary underline hover:text-primary-dark"
          onClick={handleClearFilters}
          type="button"
        >
          Clear Filters
        </button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={["category", "price", "color", "size"]}
      >
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {loadingCategories ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ))
              ) : (
                categories.map((cat) => (
                  <div key={cat.$id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedCategory === cat.name}
                      onCheckedChange={() => handleCategoryChange(cat.name)}
                      id={`category-${cat.$id}`}
                    />
                    <Label htmlFor={`category-${cat.$id}`}>{cat.name}</Label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                min={500}
                max={20000}
                step={500}
                value={[minPrice, maxPrice]}
                onValueChange={handlePriceChange}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">₹{minPrice.toLocaleString()}</span>
                <span className="text-sm">₹{maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.id}
                  className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer flex items-center justify-center ${
                    selectedColors.includes(color.id)
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={color.name}
                  onClick={() => handleColorChange(color.id)}
                  type="button"
                >
                  {selectedColors.includes(color.id) && (
                    <span className="text-xs text-white">✓</span>
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {sizeOptions.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() => handleSizeChange(size)}
                    id={`size-${size}`}
                  />
                  <Label htmlFor={`size-${size}`}>{size}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
