"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Package,
  Users,
  MapPin,
  Settings,
  LogOut,
  Menu,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Products", href: "/admin/products", icon: ShoppingBag },
    { title: "Categories", href: "/admin/categories", icon: Tag },
    { title: "Orders", href: "/admin/orders", icon: Package },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Addresses", href: "/admin/addresses", icon: MapPin },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    router.push("/login");
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
        {/* Sidebar for large screens */}
        <aside className="hidden lg:flex flex-col w-64 border-r bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 border-b dark:border-gray-700">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tag.jpg-laCUVXrnSbLBKUx1H4JbSJuUipZowa.jpeg"
                alt="Maroon Logo"
                width={120}
                height={50}
                className="h-auto"
              />
            </Link>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b dark:border-gray-700">
                    <Link href="/admin" className="flex items-center gap-2">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tag.jpg-laCUVXrnSbLBKUx1H4JbSJuUipZowa.jpeg"
                        alt="Maroon Logo"
                        width={120}
                        height={50}
                        className="h-auto"
                      />
                      <span className="font-bold text-lg">Admin</span>
                    </Link>
                  </div>
                  <nav className="flex-1 overflow-auto py-4">
                    <ul className="space-y-1 px-2">
                      {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              {item.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                  <div className="p-4 border-t dark:border-gray-700">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="font-semibold">Maroon Admin</div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </header>

          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
