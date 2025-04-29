import HeroBanner from "@/components/hero-banner"
import CategorySection from "@/components/category-section"
import FeaturedProducts from "@/components/featured-products"
import BestSellers from "@/components/best-sellers"
import TrustBadges from "@/components/trust-badges"
import NewArrivals from "@/components/new-arrivals"
import PromoBanner from "@/components/promo-banner"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Maroon - Buy Trendy Western Wear for Women Online",
  description:
    "Shop the latest collection of women's western wear including T-shirts, pants, skirts, and more. Premium quality, trendy designs.",
}

export default function Home() {
  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <p>India's Biggest Women's Fashion Sale Live Now!</p>
      </div>

      {/* Hero Banner */}
      <HeroBanner />

      {/* Trust Badges */}
      <section className="py-8 border-b">
        <TrustBadges />
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title">Shop By Category</h2>
          <p className="section-subtitle">Explore our curated collection of premium women's western wear</p>
          <CategorySection />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <h2 className="section-title">Featured Collection</h2>
          <p className="section-subtitle">Handpicked designs for the modern woman</p>
          <FeaturedProducts />
        </div>
      </section>

      {/* Promo Banner */}
      <PromoBanner />

      {/* Best Sellers */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle">Our most loved pieces that are flying off the shelves</p>
          <BestSellers />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <h2 className="section-title">New Arrivals</h2>
          <p className="section-subtitle">Fresh designs to elevate your wardrobe</p>
          <NewArrivals />
        </div>
      </section>
    </>
  )
}
