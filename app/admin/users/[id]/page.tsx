"use client";

import dbService from "@/appwrite/database";
import { UserData } from "@/types/user";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Ban,
  CheckCircle,
  ArrowLeft,
  UserCircle,
  ShoppingBag,
  Heart,
  MapPin,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface DisplayUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  role: "customer" | "admin";
  wishlist: string[];
  addresses: any[];
  orders: string[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<DisplayUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await dbService.getUserById(id as string);
        if (userData) {
          setUser({
            id: userData.$id,
            name: userData.name || "Unknown",
            email: userData.email || "",
            phone: userData.phone,
            avatar: userData.avatar,
            isActive: userData.isActive,
            role: userData.role || "customer",
            wishlist: userData.wishlist || [],
            addresses: userData.addresses || [],
            orders: userData.orders || [],
            reviews: userData.reviews || [],
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user data",
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchUser();
    }
  }, [id, toast]);

  const handleBlock = async () => {
    if (!user) return;
    try {
      await dbService.blockUser(user.id);
      setUser({ ...user, isActive: false });
      toast({
        title: "Success",
        description: "User blocked successfully",
      });
    } catch (error) {
      console.error("Error blocking user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to block user",
      });
    }
  };

  const handleUnblock = async () => {
    if (!user) return;
    try {
      await dbService.unblockUser(user.id);
      setUser({ ...user, isActive: true });
      toast({
        title: "Success",
        description: "User unblocked successfully",
      });
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unblock user",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    try {
      return format(new Date(dateString), "PPP p");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-10 pb-10">
            <p className="text-xl text-gray-600">User not found</p>
            <p className="text-sm text-gray-500 mt-2">
              The user might have been deleted or doesn't exist
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">User Details</h1>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Left Sidebar - User Profile */}
        <div className="md:col-span-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Profile</CardTitle>
              <CardDescription>User account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4 pb-4 border-b">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.phone && (
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  )}
                </div>
                <Badge
                  className="mt-2"
                  variant={user.isActive ? "default" : "destructive"}
                >
                  {user.isActive ? "Active" : "Blocked"}
                </Badge>
              </div>

              <dl className="space-y-4 mt-6">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="text-sm font-medium">
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="text-sm text-gray-900 break-all">{user.id}</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Joined</dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(user.createdAt)}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">
                    Last Updated
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(user.updatedAt)}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">
                    Last Active
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(user.lastActive)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 pt-6 border-t">
                {user.isActive ? (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleBlock}
                  >
                    <Ban className="h-4 w-4 mr-2" /> Block User
                  </Button>
                ) : (
                  <Button className="w-full" onClick={handleUnblock}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Unblock User
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Tabs with User Data */}
        <div className="md:col-span-8">
          <Card>
            <Tabs defaultValue="overview">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>User Activity</CardTitle>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                    <TabsTrigger value="addresses">Addresses</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>View and manage user activity</CardDescription>
              </CardHeader>

              <CardContent>
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          <CardTitle className="text-lg">Orders</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {user.orders.length}
                        </div>
                        <p className="text-sm text-gray-500">
                          Total orders placed
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-2" />
                          <CardTitle className="text-lg">Wishlist</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {user.wishlist.length}
                        </div>
                        <p className="text-sm text-gray-500">
                          Items in wishlist
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <CardTitle className="text-lg">Addresses</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {user.addresses.length}
                        </div>
                        <p className="text-sm text-gray-500">Saved addresses</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          <CardTitle className="text-lg">Reviews</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {user.reviews.length}
                        </div>
                        <p className="text-sm text-gray-500">Product reviews</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="orders">
                  {user.orders.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      This user hasn't placed any orders yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.orders.map((orderId) => (
                        <div
                          key={orderId}
                          className="flex justify-between items-center p-4 border rounded-md"
                        >
                          <div>
                            <p className="font-medium">
                              Order #{orderId.substring(0, 8)}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/admin/orders/${orderId}`}>View Order</a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="wishlist">
                  {user.wishlist.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      This user's wishlist is empty.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.wishlist.map((productId) => (
                        <div
                          key={productId}
                          className="flex justify-between items-center p-4 border rounded-md"
                        >
                          <div>
                            <p className="font-medium">
                              Product #{productId.substring(0, 8)}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/admin/products/${productId}`}>
                              View Product
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="addresses">
                  {user.addresses.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      This user hasn't added any addresses yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.addresses.map((address) => (
                        <div key={address.id} className="p-4 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{address.fullName}</p>
                              <p className="text-sm text-gray-500">
                                {address.phone}
                              </p>
                            </div>
                            {address.isDefault && (
                              <Badge variant="outline">Default</Badge>
                            )}
                          </div>
                          <div className="mt-2 text-sm">
                            <p>{address.addressLine1}</p>
                            {address.addressLine2 && (
                              <p>{address.addressLine2}</p>
                            )}
                            <p>{`${address.city}, ${address.state} ${address.postalCode}`}</p>
                            <p>{address.country}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reviews">
                  {user.reviews.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      This user hasn't submitted any reviews yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.reviews.map((review) => (
                        <div key={review.id} className="p-4 border rounded-md">
                          <div className="flex justify-between">
                            <div className="font-medium">{review.title}</div>
                            <div className="flex">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            {review.content}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            For product #{review.productId.substring(0, 8)} •
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
