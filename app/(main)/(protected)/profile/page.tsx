"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import ProfileSidebar from "@/components/profile-sidebar";
import { Card } from "@/components/ui/card";
import authService from "@/appwrite/authService";
import dbService from "@/appwrite/userDbService";
import { parseAddresses } from "@/lib/addressUtils";
import { parseWishlist } from "@/lib/wishlistUtils";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authStatus } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      if (!authStatus) {
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        // Get authenticated user
        const authUser = await authService.getCurrentUser();
        if (authUser) {
          setUser(authUser);

          // Get additional user data
          const dbUser = await dbService.getUserById(authUser.$id);

          // Use our utilities to parse complex data stored as JSON
          const parsedAddresses = parseAddresses(dbUser.addresses);
          const parsedWishlist = parseWishlist(dbUser.wishlist);

          setUserData({
            ...dbUser,
            addresses: parsedAddresses,
            wishlist: parsedWishlist,
            // Parse orders if needed (similar to addresses and wishlist)
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Could not fetch your account information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [authStatus, router, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <ProfileSidebar />
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : user && userData ? (
            <div className="space-y-6">
              {/* Account Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Account Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p>{user.name || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{user.email}</p>
                  </div>
                </div>
              </Card>

              {/* Account Summary */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg bg-gray-50">
                    <p className="text-3xl font-bold text-primary">
                      {userData.orders
                        ? typeof userData.orders === "string"
                          ? JSON.parse(userData.orders).length
                          : userData.orders.length
                        : 0}
                    </p>
                    <p className="text-sm text-gray-500">Orders</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-gray-50">
                    <p className="text-3xl font-bold text-primary">
                      {userData.addresses?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500">Saved Addresses</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-gray-50">
                    <p className="text-3xl font-bold text-primary">
                      {userData.wishlist?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500">Wishlist Items</p>
                  </div>
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="/profile/orders"
                    className="text-primary hover:underline"
                  >
                    View My Orders
                  </a>
                  <a
                    href="/profile/addresses"
                    className="text-primary hover:underline"
                  >
                    Manage Addresses
                  </a>
                  <a href="/wishlist" className="text-primary hover:underline">
                    View My Wishlist
                  </a>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>Could not load account information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
