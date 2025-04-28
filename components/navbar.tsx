"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { toast } = useToast()

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
                <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/sarees" className="text-lg font-medium hover:text-primary transition-colors">
                  Sarees
                </Link>
                <Link href="/lehengas" className="text-lg font-medium hover:text-primary transition-colors">
                  Lehengas
                </Link>
                <Link href="/kurtis" className="text-lg font-medium hover:text-primary transition-colors">
                  Kurtis
                </Link>
                <Link href="/sale" className="text-lg font-medium text-red-600 hover:text-red-700 transition-colors">
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
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/sarees" className="text-sm font-medium hover:text-primary transition-colors">
              Sarees
            </Link>
            <Link href="/lehengas" className="text-sm font-medium hover:text-primary transition-colors">
              Lehengas
            </Link>
            <Link href="/kurtis" className="text-sm font-medium hover:text-primary transition-colors">
              Kurtis
            </Link>
            <Link href="/accessories" className="text-sm font-medium hover:text-primary transition-colors">
              Accessories
            </Link>
            <Link href="/sale" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              Sale
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <div className="absolute inset-0 bg-white z-20 flex items-center px-4">
                <Input type="search" placeholder="Search for products..." className="flex-1 mr-2" autoFocus />
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white rounded-full text-[10px] flex items-center justify-center">
                  3
                </span>
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link href="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
