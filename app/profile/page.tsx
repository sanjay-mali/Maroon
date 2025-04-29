"use client";
import Image from "next/image";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileSidebar from "@/components/profile-sidebar";
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import authService from "@/appwrite/authService";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authService.getCurrentUser();
      console.log("user", user);
      if (user) {
        setUserData(user);
      } else {
        router.push("/login");
      }
    };
    fetchUser();
  }, []);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">My Account</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full">
                    <Settings size={14} />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{userData?.name}</h2>
                  <p className="text-gray-600">{userData?.email}</p>
                  {userData?.mobileNumber && (
                    <p className="text-gray-600">{userData?.mobileNumber}</p>
                  )}
                </div>
                <div className="sm:ml-auto">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1 ">
                      Full Name
                    </label>
                    <div className="font-medium">{userData?.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1 ">
                      Email Address
                    </label>
                    <div className="font-medium">{userData?.email}</div>
                  </div>
                  {userData?.mobileNumber && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Phone Number
                      </label>
                      <div className="font-medium">
                        {userData?.mobileNumber}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t mt-6 pt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Default Shipping Address
                </h3>
                <div className="border rounded-lg p-4">
                  <div className="font-medium mb-1">{userData?.name}</div>
                  <div className="text-gray-600 mb-1">
                    123 Main Street, Apt 4B
                  </div>
                  <div className="text-gray-600 mb-1">New York, NY 10001</div>
                  <div className="text-gray-600"></div>
                  <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                    Change Default Address
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
