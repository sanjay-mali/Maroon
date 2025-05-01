"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import dbService from "@/appwrite/database";

export default function CategorySection() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Expanded warm and mixed color palette
  const colorPalette = [
    "#FFB347", // warm orange
    "#FF6961", // warm red
    "#FFD580", // light warm yellow
    "#FF8C42", // deep orange
    "#FFADAD", // soft pink
    "#FFC300", // gold
    "#FF6F61", // coral
    "#FFB085", // peach
    "#F67280", // watermelon
    "#F8B195", // light pink
    "#F9D423", // yellow
    "#F6E27A", // pale yellow
    "#F7CAC9", // blush
    "#F7786B", // salmon
    "#F5B7B1", // light rose
    "#F1948A", // rose
    "#F7B267", // apricot
    "#F4845F", // orange coral
    "#F27059", // orange red
    "#F25F5C", // red coral
    "#B5EAD7", // mint
    "#C7CEEA", // lavender
    "#B2C2BF", // cool gray
    "#BFD8B8", // light green
    "#B5B9FF", // periwinkle
    "#B2A4FF", // light purple
    "#B5EAD7", // mint
    "#B2F7EF", // aqua
    "#B2B1CF", // muted purple
  ];

  // Helper to get a color for each card
  const getColor = (idx: number) => colorPalette[idx % colorPalette.length];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await dbService.getAllCategories(1, 12);
        if (result && result.documents) {
          setCategories(result.documents);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="flex overflow-x-auto py-2 px-1 scrollbar-thin justify-center gap-10 scrollbar-thumb-gray-300">
      {categories.map((category, idx) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className="category-card flex-shrink-0"
          style={{ minWidth: 80, maxWidth: 90 }}
        >
          <div
            className="aspect-square flex items-center justify-center rounded-md shadow-sm transition-transform duration-300 hover:scale-105 border border-white/30"
            style={{ background: getColor(idx), minHeight: 60, maxWidth: 90 }}
          >
            <h3
              className="text-xs font-bold text-center px-1"
              style={{
                color: "#222",
                textShadow: "0 1px 4px rgba(255,255,255,0.7)",
              }}
            >
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
