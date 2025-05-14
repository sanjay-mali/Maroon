"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, MapPin, Package, Heart, CreditCard, LogOut } from "lucide-react";
import authService from "@/appwrite/authService";

const navItems = [
  {
    href: "/profile",
    label: "My Account",
    icon: User,
  },
  {
    href: "/profile/orders",
    label: "My Orders",
    icon: Package,
  },
  {
    href: "/profile/addresses",
    label: "My Addresses",
    icon: MapPin,
  },
  {
    href: "/wishlist",
    label: "My Wishlist",
    icon: Heart,
  },
  {
    href: "/profile/payment",
    label: "Payment Methods",
    icon: CreditCard,
  },
];

export default function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.Logout();
    router.replace("/login");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full text-left"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
