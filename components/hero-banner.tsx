"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/embla-carousel.css";
import { useBanners } from "@/hooks/use-banners";

export default function HeroBanner() {
  const { banners, loading } = useBanners({ type: "hero" });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
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
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Background image placeholder */}
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full object-cover" />
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4">
          <div className="text-center max-w-4xl w-full">
            {/* Title skeleton */}
            <Skeleton className="mx-auto mb-4 h-12 md:h-16 lg:h-20 w-3/4 rounded" />

            {/* Subtitle skeleton */}
            <Skeleton className="mx-auto mb-6 h-8 md:h-10 w-1/2 rounded" />

            {/* Description skeleton */}
            <Skeleton className="mx-auto mb-8 h-6 md:h-8 w-2/3 rounded" />

            {/* Button skeleton */}
            <Skeleton className="mx-auto h-14 w-40 rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (!loading && banners.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <div className="embla w-full h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {banners &&
            banners.map((banner, index) => (
              <div
                key={banner.$id}
                className="embla__slide relative h-full flex-[0_0_100%]"
              >
                <Image
                  src={
                    banner.imageUrl || "/placeholder.svg?height=1080&width=1920"
                  }
                  alt={banner.title || "Women's Fashion Collection"}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4">
                  <div className="text-center max-w-4xl">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                      {banner.title}
                    </h1>
                    {banner.subtitle && (
                      <div className="text-xl md:text-3xl font-bold mb-6 text-accent">
                        {banner.subtitle}
                      </div>
                    )}
                    {banner.description && (
                      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                        {banner.description}
                      </p>
                    )}
                    <Button
                      size="lg"
                      className="btn-primary text-lg px-8 py-6"
                      asChild
                    >
                      <Link href={banner.link || "/products"}>SHOP NOW</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full z-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full z-10"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === selectedIndex ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
