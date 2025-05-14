"use client";

import { useEffect, useState, useRef } from "react";
import dbService from "@/appwrite/database";
import { Loader2 } from "lucide-react";

interface Announcement {
  $id: string;
  text: string;
  link?: string;
  isActive: boolean;
}

export default function AnnouncementMarquee() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const result = await dbService.getAnnouncements();
        if (result?.documents?.length > 0) {
          setAnnouncements(result.documents as Announcement[]);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // If no active announcements found, return null
  if (!loading && announcements.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="announcement-bar bg-primary text-white py-2">
        <div className="container-custom flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If only one announcement, show it without marquee
  if (announcements.length === 1) {
    const announcement = announcements[0];
    return (
      <div className="announcement-bar bg-primary text-white py-2">
        <div className="container-custom text-center">
          {announcement.link ? (
            <a
              href={announcement.link}
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {announcement.text}
            </a>
          ) : (
            <p>{announcement.text}</p>
          )}
        </div>
      </div>
    );
  }

  // Multiple announcements - create marquee
  return (
    <div className="announcement-bar bg-primary text-white py-2 overflow-hidden">
      <div className="relative" ref={marqueeRef}>
        <div className="flex whitespace-nowrap animate-marquee">
          {announcements.map((announcement) => (
            <div key={announcement.$id} className="mx-8">
              {announcement.link ? (
                <a
                  href={announcement.link}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {announcement.text}
                </a>
              ) : (
                <span>{announcement.text}</span>
              )}
            </div>
          ))}
          {/* Duplicate announcements to create seamless loop */}
          {announcements.map((announcement) => (
            <div key={`${announcement.$id}-dup`} className="mx-8">
              {announcement.link ? (
                <a
                  href={announcement.link}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {announcement.text}
                </a>
              ) : (
                <span>{announcement.text}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
