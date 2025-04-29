import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HeroBanner() {
  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <Image
        src="/placeholder.svg?height=1080&width=1920"
        alt="Women's Fashion Collection"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">Summer Collection 2025</h1>
          <div className="text-xl md:text-3xl font-bold mb-6 text-accent">BUY 2 GET 1 FREE</div>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover the latest trends in women's western wear
          </p>
          <Button size="lg" className="btn-primary text-lg px-8 py-6">
            <Link href="/products">SHOP NOW</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
