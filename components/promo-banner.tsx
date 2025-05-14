"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/embla-carousel.css";
import { useBanners } from "@/hooks/use-banners";

export default function PromoBanner() {
  const { banners, loading } = useBanners({ type: "sale" });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const onSelect = () => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  };

  // Set up Embla Carousel when it's ready
  useEffect(() => {
    if (emblaApi) {
      setScrollSnaps(emblaApi.scrollSnapList());
      emblaApi.on("select", onSelect);
      onSelect();
    }
    return () => {
      if (emblaApi) {
        emblaApi.off("select", onSelect);
      }
    };
  }, [emblaApi]);

  if (loading) {
    return (
      <section className="py-16 bg-primary text-primary-foreground">
        <Skeleton className="h-64 w-full" />
      </section>
    );
  }

  // If no promo banners, don't render anything
  if (banners.length === 0) {
    return null;
  }

  // If only one banner, render it directly
  if (banners.length === 1) {
    const banner = banners[0];
    return (
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {banner.title || "Summer Fashion Sale"}
              </h2>
              <p className="text-lg mb-6 max-w-xl">
                {banner.description ||
                  "Get up to 50% off on selected women's western wear. Limited time offer. Shop now and refresh your wardrobe."}
              </p>
              <Button
                asChild
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Link href={banner.link || "/sale"}>Shop Now</Link>
              </Button>
            </div>
            <div className="text-4xl md:text-6xl font-bold">
              {banner.subtitle || "50% OFF"}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If multiple banners, render them as a carousel
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container-custom">
        <div className="embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {banners.map((banner) => (
                <div key={banner.$id} className="embla__slide">
                  <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {banner.title || "Summer Fashion Sale"}
                      </h2>
                      <p className="text-lg mb-6 max-w-xl">
                        {banner.description ||
                          "Get up to 50% off on selected women's western wear. Limited time offer. Shop now and refresh your wardrobe."}
                      </p>
                      <Button
                        asChild
                        className="bg-white text-primary hover:bg-gray-100"
                      >
                        <Link href={banner.link || "/sale"}>Shop Now</Link>
                      </Button>
                    </div>
                    <div className="text-4xl md:text-6xl font-bold">
                      {banner.subtitle || "50% OFF"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          {banners.length > 1 && (
            <div className="flex justify-center mt-6 gap-4">
              <Button
                onClick={scrollPrev}
                variant="outline"
                size="icon"
                className="rounded-full bg-white text-primary hover:bg-gray-200"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={scrollNext}
                variant="outline"
                size="icon"
                className="rounded-full bg-white text-primary hover:bg-gray-200"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}

          {/* Dots indicator */}
          {banners.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedIndex ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
