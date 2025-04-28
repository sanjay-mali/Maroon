import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tag.jpg-laCUVXrnSbLBKUx1H4JbSJuUipZowa.jpeg"
                alt="Maroon Logo"
                width={160}
                height={70}
                className="h-auto mb-4"
              />
            </Link>
            <p className="text-gray-600 mb-4">
              Discover exquisite ethnic wear for every occasion. Premium quality, timeless designs.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-primary" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary" aria-label="Youtube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-primary">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-primary">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-primary">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-600 hover:text-primary">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">123 Fashion Street, Design District, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+919876543210" className="text-gray-600 hover:text-primary">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:info@maroon.com" className="text-gray-600 hover:text-primary">
                  info@maroon.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Maroon Fashion. All rights reserved.
          </p>
          <div className="flex gap-4">
            <img src="/placeholder.svg?height=30&width=50" alt="Visa" className="h-6" />
            <img src="/placeholder.svg?height=30&width=50" alt="Mastercard" className="h-6" />
            <img src="/placeholder.svg?height=30&width=50" alt="PayPal" className="h-6" />
            <img src="/placeholder.svg?height=30&width=50" alt="UPI" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  )
}
