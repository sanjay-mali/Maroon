import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProductsSort() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      <Select defaultValue="featured">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="newest">Newest Arrivals</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="rating">Customer Rating</SelectItem>
          <SelectItem value="discount">Discount</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
