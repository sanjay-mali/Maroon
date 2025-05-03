"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import dbService from "@/appwrite/database";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { itemCount } = useCart();
  const router =
    typeof window !== "undefined"
      ? require("next/navigation").useRouter()
      : null;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Navigate to products page with search param when debouncedValue changes
  useEffect(() => {
    if (debouncedValue && isSearchOpen) {
      if (router)
        router.push(`/products?search=${encodeURIComponent(debouncedValue)}`);
    }
  }, [debouncedValue, isSearchOpen]);

  // Fetch matching products for suggestions
  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      if (debouncedValue.trim().length === 0) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      try {
        // Fetch all products and filter client-side (or use a dedicated search endpoint if available)
        const res = await dbService.getAllProductsNotDisabled(1, 10);
        const docs = res?.documents || [];
        const filtered = docs.filter((p: any) =>
          p.name?.toLowerCase().includes(debouncedValue.toLowerCase())
        );
        if (active) {
          setSearchResults(filtered);
          setShowDropdown(true);
        }
      } catch {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };
    if (isSearchOpen && debouncedValue) fetchResults();
    else setShowDropdown(false);
    return () => {
      active = false;
    };
  }, [debouncedValue, isSearchOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await dbService.getAllCategories(1, 20);
        if (result && result.documents) {
          setCategories(result.documents);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex justify-center mb-8">
                <Link href="/">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tag.jpg-laCUVXrnSbLBKUx1H4JbSJuUipZowa.jpeg"
                    alt="Maroon Logo"
                    width={180}
                    height={80}
                    className="h-auto"
                  />
                </Link>
              </div>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Home
                </Link>
                {categories.length === 0
                  ? Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton
                          key={i}
                          className="h-6 w-32 rounded bg-gray-200"
                        />
                      ))
                  : categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${encodeURIComponent(
                          cat.name
                        )}`}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                <Link
                  href="/sale"
                  className="text-lg font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Sale
                </Link>
                <div className="border-t my-4 pt-4">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <User className="h-5 w-5" />
                    Login / Register
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tag.jpg-laCUVXrnSbLBKUx1H4JbSJuUipZowa.jpeg"
              alt="Maroon Logo"
              width={180}
              height={80}
              className="h-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            {categories.length === 0
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-5 w-20 rounded bg-gray-200"
                    />
                  ))
              : categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
            <Link
              href="/sale"
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Sale
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <div className="absolute inset-0 bg-white z-20 flex flex-col items-stretch px-4 pt-4">
                <div className="relative w-full">
                  <div className="flex items-center">
                    <Input
                      type="search"
                      placeholder="Search for products..."
                      className="flex-1 mr-2"
                      autoFocus
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onFocus={() => setShowDropdown(!!searchResults.length)}
                      onBlur={() =>
                        setTimeout(() => setShowDropdown(false), 150)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchValue) {
                          if (router)
                            router.push(
                              `/products?search=${encodeURIComponent(
                                searchValue
                              )}`
                            );
                          setIsSearchOpen(false);
                          setShowDropdown(false);
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setShowDropdown(false);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  {showDropdown && searchResults.length > 0 && (
                    <div
                      className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-lg max-h-80 overflow-y-auto"
                      style={{ top: "100%", zIndex: 50 }}
                    >
                      {searchResults.map((product: any) => (
                        <Link
                          key={product.$id || product.id}
                          href={`/products/${product.$id || product.id}`}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setShowDropdown(false);
                          }}
                        >
                          <Image
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded object-cover border"
                          />
                          <span className="truncate font-medium">
                            {product.name}
                          </span>
                        </Link>
                      ))}
                      <div className="border-t">
                        <button
                          className="w-full text-left px-4 py-2 text-primary hover:bg-gray-50 font-semibold"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            if (router)
                              router.push(
                                `/products?search=${encodeURIComponent(
                                  searchValue
                                )}`
                              );
                            setIsSearchOpen(false);
                            setShowDropdown(false);
                          }}
                        >
                          See all results for "{searchValue}"
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full text-[10px] flex items-center justify-center"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      key="cart-count"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="sr-only">Cart ({itemCount} items)</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:flex"
            >
              <Link href="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
