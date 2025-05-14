"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAnnouncements } from "@/hooks/use-announcements";

export default function AnnouncementBar() {
  const { announcements, loading } = useAnnouncements();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % announcements.length);
    }, 5000); // Change announcement every 5 seconds

    return () => clearInterval(interval);
  }, [announcements.length]);

  if (loading || announcements.length === 0) {
    return (
      <div className="announcement-bar">
        <p>India's Biggest Women's Fashion Sale Live Now!</p>
      </div>
    );
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className="announcement-bar relative">
      <div className="container-custom flex items-center justify-between">
        {announcements.length > 1 && (
          <button
            onClick={() =>
              setCurrentIndex(
                (current) =>
                  (current - 1 + announcements.length) % announcements.length
              )
            }
            className="absolute left-4 text-primary-foreground/80 hover:text-primary-foreground"
            aria-label="Previous announcement"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <p className="flex-1 text-center">{currentAnnouncement.text}</p>
        {announcements.length > 1 && (
          <button
            onClick={() =>
              setCurrentIndex((current) => (current + 1) % announcements.length)
            }
            className="absolute right-4 text-primary-foreground/80 hover:text-primary-foreground"
            aria-label="Next announcement"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
