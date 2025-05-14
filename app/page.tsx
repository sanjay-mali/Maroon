import HeroBanner from "@/components/hero-banner";
import CategorySection from "@/components/category-section";
import FeaturedProducts from "@/components/featured-products";
import NewArrivals from "@/components/new-arrivals";
import PromoBanner from "@/components/promo-banner";
import AnnouncementMarquee from "@/components/announcement-marquee";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maroon - Buy Trendy Western Wear for Women Online",
  description:
    "Shop the latest collection of women's western wear including T-shirts, pants, skirts, and more. Premium quality, trendy designs.",
};

export default function Home() {
  return (
    <>
      {/* Announcement Bar */}
      <AnnouncementMarquee />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title">Shop By Category</h2>
          <p className="section-subtitle">
            Explore our curated collection of premium women's western wear
          </p>
          <CategorySection />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <h2 className="section-title">Featured Collection</h2>
          <p className="section-subtitle">
            Handpicked designs for the modern woman
          </p>
          <FeaturedProducts />
        </div>
      </section>

      {/* Promo Banner */}
      <PromoBanner />

      {/* New Arrivals */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <h2 className="section-title">New Arrivals</h2>
          <p className="section-subtitle">
            Fresh designs to elevate your wardrobe
          </p>
          <NewArrivals />
        </div>
      </section>
    </>
  );
}
