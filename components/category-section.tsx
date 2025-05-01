"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import dbService from "@/appwrite/database";

export default function CategorySection() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className="category-card"
        >
          <div className="aspect-[3/4] relative overflow-hidden">
            <Image
              src={category.imageId || "/placeholder.svg"}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">{category.name}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
