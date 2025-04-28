import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OffersBanner() {
  return (
    <div className="bg-gray-100 rounded-lg p-6 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-2">Summer Sale</h3>
          <p className="text-gray-600 mb-4">Get up to 50% off on selected items. Limited time offer.</p>
          <Button asChild>
            <Link href="/products?sale=true">Shop Now</Link>
          </Button>
        </div>
        <div className="text-4xl md:text-6xl font-bold text-gray-800">50% OFF</div>
      </div>
    </div>
  )
}
