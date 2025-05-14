"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Edit, Star } from "lucide-react";
import ProfileSidebar from "@/components/profile-sidebar";
import ShippingAddressForm from "@/components/shipping-address-form";
import { UserAddress } from "@/types/user";
import dbService from "@/appwrite/userDbService";
import authService from "@/appwrite/authService";
import { parseAddresses } from "@/lib/addressUtils";

export default function ProfileAddresses() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null
  );
  const { authStatus } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch user's saved addresses
  useEffect(() => {
    async function fetchAddresses() {
      if (!authStatus) {
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        const user = await authService.getCurrentUser();
        if (user) {
          // Use our utility to parse addresses (handles both JSON string and array formats)
          const userAddresses = await dbService.getUserAddresses(user.$id);
          setAddresses(parseAddresses(userAddresses));
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast({
          title: "Error",
          description: "Could not fetch your saved addresses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAddresses();
  }, [authStatus, router, toast]);

  // Handle edit address
  const handleEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      setIsLoading(true);
      const user = await authService.getCurrentUser();
      if (user) {
        // Filter out this address and save the updated list
        const updatedAddresses = addresses.filter(
          (addr) => addr.id !== addressId
        );

        // Update in database as JSON string
        await dbService.updateUser(user.$id, {
          addresses: JSON.stringify(updatedAddresses),
          updatedAt: new Date().toISOString(),
        });

        setAddresses(updatedAddresses);

        toast({
          title: "Success",
          description: "Address deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: "Error",
        description: "Could not delete the address",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle setting an address as default
  const handleSetDefault = async (addressId: string) => {
    try {
      setIsLoading(true);
      const user = await authService.getCurrentUser();
      if (user) {
        // Update the addresses with the new default
        const updatedAddresses = addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }));

        // Update in database as JSON string
        await dbService.updateUser(user.$id, {
          addresses: JSON.stringify(updatedAddresses),
          updatedAt: new Date().toISOString(),
        });

        setAddresses(updatedAddresses);

        toast({
          title: "Success",
          description: "Default address updated",
        });
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast({
        title: "Error",
        description: "Could not update default address",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle address form submission
  const handleAddressSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) return;

      if (editingAddress) {
        // Update existing address
        const updatedAddresses = addresses.map((addr) =>
          addr.id === editingAddress.id
            ? {
                ...addr,
                fullName: values.fullName,
                addressLine1: values.addressLine1,
                addressLine2: values.addressLine2 || "",
                city: values.city,
                state: values.state,
                postalCode: values.postalCode,
                country: values.country,
                phone: values.phone,
              }
            : addr
        );

        // If this is marked as default, update all addresses
        if (values.saveAddress) {
          updatedAddresses.forEach((addr) => {
            addr.isDefault = addr.id === editingAddress.id;
          });
        }

        // Update in database as JSON string
        await dbService.updateUser(user.$id, {
          addresses: JSON.stringify(updatedAddresses),
          updatedAt: new Date().toISOString(),
        });

        setAddresses(updatedAddresses);

        toast({
          title: "Success",
          description: "Address updated successfully",
        });
      } else {
        // Add new address
        await dbService.addUserAddress(user.$id, {
          fullName: values.fullName,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2 || "",
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          country: values.country,
          phone: values.phone,
          isDefault: values.saveAddress,
        });

        // Refresh addresses
        const userAddresses = await dbService.getUserAddresses(user.$id);
        setAddresses(parseAddresses(userAddresses));

        toast({
          title: "Success",
          description: "Address added successfully",
        });
      }

      // Reset form state
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Error",
        description: "Could not save the address",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Addresses</h2>
              {!showAddressForm && (
                <Button
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressForm(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Address
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : showAddressForm ? (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h3>
                <ShippingAddressForm
                  onSubmit={handleAddressSubmit}
                  defaultValues={
                    editingAddress
                      ? {
                          fullName: editingAddress.fullName,
                          email: "", // Email is not usually stored with address
                          phone: editingAddress.phone,
                          addressLine1: editingAddress.addressLine1,
                          addressLine2: editingAddress.addressLine2 || "",
                          city: editingAddress.city,
                          state: editingAddress.state,
                          postalCode: editingAddress.postalCode,
                          country: editingAddress.country,
                          saveAddress: editingAddress.isDefault,
                        }
                      : undefined
                  }
                  isLoading={isLoading}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddress(null);
                  }}
                  className="mt-4"
                >
                  Cancel
                </Button>
              </div>
            ) : addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <Card key={address.id} className="p-4 relative">
                    <div className="flex justify-between">
                      <div className="font-medium flex items-center">
                        {address.fullName}
                        {address.isDefault && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!address.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                            className="text-amber-500"
                          >
                            <Star size={16} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAddress(address)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-500"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {address.addressLine1}
                    </div>
                    {address.addressLine2 && (
                      <div className="text-sm text-gray-600">
                        {address.addressLine2}
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.postalCode}
                    </div>
                    <div className="text-sm text-gray-600">
                      {address.country}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Phone: {address.phone}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>You don't have any saved addresses yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
