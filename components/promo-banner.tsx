import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PromoBanner() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Festive Season Sale</h2>
            <p className="text-lg mb-6 max-w-xl">
              Get up to 50% off on selected items. Limited time offer. Shop now and elevate your festive wardrobe.
            </p>
            <Button asChild className="bg-white text-primary hover:bg-gray-100">
              <Link href="/sale">Shop Now</Link>
            </Button>
          </div>
          <div className="text-4xl md:text-6xl font-bold">50% OFF</div>
        </div>
      </div>
    </section>
  )
}
