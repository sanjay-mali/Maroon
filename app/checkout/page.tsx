"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import ShippingAddressForm, {
  AddressFormValues,
} from "@/components/shipping-address-form";
import RazorpayCheckout from "@/components/razorpay-checkout";
import { motion } from "framer-motion";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import CartSummary from "@/components/cart-summary";
import EmptyCart from "@/components/empty-cart";
import dbService, { addOrderToUser } from "@/appwrite/userDbService";
import authService from "@/appwrite/authService";
import { UserAddress } from "@/types/user";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { parseAddresses } from "@/lib/addressUtils";
import { UserLoginForm } from "@/components/user-login-form";

export default function CheckoutPage() {
  const [step, setStep] = useState<"choose" | "address" | "payment">("choose");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAddressSubmit, setLoadingAddressSubmit] = useState(false);
  const [shippingAddress, setShippingAddress] =
    useState<AddressFormValues | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { toast } = useToast();
  const { cart, total, clearCart } = useCart();
  const { isLoggedIn } = useAuth(); // isLoggedIn is an async function
  const router = useRouter();

  // Add local state for login status
  const [isLoggedInState, setIsLoggedInState] = useState<boolean | null>(null);

  // Fetch login status on mount
  useEffect(() => {
    let mounted = true;
    async function checkLogin() {
      try {
        const loggedIn = await isLoggedIn();
        if (mounted) setIsLoggedInState(loggedIn);
      } catch {
        if (mounted) setIsLoggedInState(false);
      }
    }
    checkLogin();
    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);
  // Fetch user's saved addresses if logged in
  useEffect(() => {
    async function fetchUserAddresses() {
      if (!isLoggedInState) {
        setIsLoading(false);
        setShowAddressForm(true);
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        if (user) {
          const addresses = await dbService.getUserAddresses(user.$id);
          const parsedAddresses = parseAddresses(addresses);
          setSavedAddresses(parsedAddresses);

          if (parsedAddresses.length > 0) {
            const defaultAddress =
              parsedAddresses.find((addr) => addr.isDefault) ||
              parsedAddresses[0];
            setSelectedAddressId(defaultAddress.id);

            setShippingAddress({
              fullName: defaultAddress.fullName,
              email: user.email,
              phone: defaultAddress.phone,
              addressLine1: defaultAddress.addressLine1,
              addressLine2: defaultAddress.addressLine2 || "",
              city: defaultAddress.city,
              state: defaultAddress.state,
              postalCode: defaultAddress.postalCode,
              country: defaultAddress.country,
              saveAddress: false,
            });
          } else {
            setShowAddressForm(true);
          }
        } else {
          setShowAddressForm(true);
        }
      } catch (error) {
        console.error("Error fetching user addresses:", error);
        setShowAddressForm(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoggedInState !== null) {
      fetchUserAddresses();
    }
  }, [isLoggedInState]);

  // If user logs in successfully, move to address step
  useEffect(() => {
    if (isLoggedInState && step === "choose") {
      setStep("address");
      setShowLoginForm(false);
    }
  }, [isLoggedInState, step]);

  // Handle saved address selection
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = savedAddresses.find(
      (addr) => addr.id === addressId
    );

    if (selectedAddress) {
      setShippingAddress({
        fullName: selectedAddress.fullName,
        email: "",
        phone: selectedAddress.phone,
        addressLine1: selectedAddress.addressLine1,
        addressLine2: selectedAddress.addressLine2 || "",
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
        saveAddress: false,
      });
    }
  };

  // New function to handle "Continue to Payment" click
  const handleContinueToPayment = async () => {
    // Only save address for logged-in users
    if (isLoggedInState && selectedAddressId) {
      try {
        const user = await authService.getCurrentUser();
        // Find the selected address object
        const selectedAddress = savedAddresses.find(
          (addr) => addr.id === selectedAddressId
        );
        if (user && selectedAddress) {
          // Save the address to Appwrite user collection
          await dbService.addUserAddress(user.$id, {
            fullName: selectedAddress.fullName,
            addressLine1: selectedAddress.addressLine1,
            addressLine2: selectedAddress.addressLine2,
            city: selectedAddress.city,
            state: selectedAddress.state,
            postalCode: selectedAddress.postalCode,
            country: selectedAddress.country,
            phone: selectedAddress.phone,
            isDefault: selectedAddress.isDefault || false,
          });
        }
      } catch (error) {
        console.error("Error saving address for user:", error);
        toast({
          title: "Error",
          description: "Could not save address for your account.",
          variant: "destructive",
        });
        return; // Don't proceed if saving fails
      }
    }
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle address form submission
  const handleAddressSubmit = async (values: AddressFormValues) => {
    try {
      setLoadingAddressSubmit(true);

      if (isLoggedInState && values.saveAddress) {
        const user = await authService.getCurrentUser();
        if (user) {
          await dbService.addUserAddress(user.$id, {
            fullName: values.fullName,
            addressLine1: values.addressLine1,
            addressLine2: values.addressLine2,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,
            country: values.country,
            phone: values.phone,
            isDefault: savedAddresses.length === 0,
          });

          toast({
            title: "Address saved",
            description: "Your address has been saved for future use",
          });
        }
      }

      setShippingAddress(values);
      setStep("payment");

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your address",
        variant: "destructive",
      });
    } finally {
      setLoadingAddressSubmit(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentData: any) => {
    if (!shippingAddress) {
      toast({
        title: "Error",
        description: "Shipping address is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const user = isLoggedInState ? await authService.getCurrentUser() : null;
      const userId = user ? user.$id : null;

      const itemsData = JSON.stringify(
        cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          discount_price: item.discount_price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          image: item.image,
        }))
      );

      const shippingAddressData = JSON.stringify({
        fullName: shippingAddress.fullName,
        email: shippingAddress.email || (user ? user.email : ""),
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      });

      const paymentDetailsData = JSON.stringify({
        paymentId: paymentData.razorpay_payment_id,
        orderId: paymentData.razorpay_order_id,
        signature: paymentData.razorpay_signature,
        method: "razorpay",
      });

      const subtotal = cart.reduce(
        (sum, item) =>
          sum + (item.discount_price || item.price) * item.quantity,
        0
      );
      const shipping = 0;
      const tax = total * 0.18;

      const amountData = JSON.stringify({
        subtotal,
        shipping,
        tax,
        total,
      });

      const orderData = {
        userId: userId,
        itemsJson: itemsData,
        itemsCount: cart.length,
        shippingAddressJson: shippingAddressData,
        paymentDetailsJson: paymentDetailsData,
        amountJson: amountData,
        status: "Processing",
        createdAt: new Date().toISOString(),
      };

      const order = await dbService.createOrder(orderData);

      if (userId) {
        try {
          await addOrderToUser(userId, order.$id);
        } catch (orderErr) {
          console.error("Error updating user order history:", orderErr);
        }
      }

      clearCart();

      router.replace(`/success?orderId=${order.$id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description:
          "There was a problem creating your order. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: any) => {
    toast({
      title: "Payment Failed",
      description:
        error.message || "There was a problem processing your payment",
      variant: "destructive",
    });
    setStep("payment");
  };

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
      <div className="mb-8">
        <Link
          href="/cart"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {/* Choose Checkout Type Step */}
          {step === "choose" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-6">
                How would you like to checkout?
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  className="w-full md:w-auto"
                  onClick={() => setStep("address")}
                >
                  Guest Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={() => setShowLoginForm(true)}
                >
                  Log in
                </Button>
              </div>
              {showLoginForm && (
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Log in to your account</h3>
                  <UserLoginForm />
                </div>
              )}
            </motion.div>
          )}

          {/* Address Step */}
          {step === "address" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : savedAddresses.length > 0 && !showAddressForm ? (
                <div className="space-y-6">
                  <RadioGroup
                    value={selectedAddressId || ""}
                    onValueChange={handleAddressSelect}
                  >
                    <div className="space-y-4">
                      {savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-start space-x-2"
                        >
                          <RadioGroupItem
                            value={address.id}
                            id={`address-${address.id}`}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`address-${address.id}`}
                              className="flex flex-col cursor-pointer"
                            >
                              <Card
                                className={`p-4 border ${
                                  selectedAddressId === address.id
                                    ? "border-primary"
                                    : "border-gray-200"
                                }`}
                              >
                                <div className="flex justify-between">
                                  <div className="font-medium">
                                    {address.fullName}
                                  </div>
                                  {address.isDefault && (
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                      Default
                                    </span>
                                  )}
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
                                  {address.city}, {address.state}{" "}
                                  {address.postalCode}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {address.country}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {address.phone}
                                </div>
                              </Card>
                            </Label>
                          </div>
                        </div>
                      ))}

                      <div className="mt-6">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setShowAddressForm(true)}
                          className="flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Address
                        </Button>
                      </div>
                    </div>
                  </RadioGroup>

                  {selectedAddressId && (
                    <div className="mt-6">
                      <Button
                        onClick={handleContinueToPayment}
                        className="w-full"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <ShippingAddressForm
                  onSubmit={handleAddressSubmit}
                  defaultValues={shippingAddress || undefined}
                  isLoading={loadingAddressSubmit}
                />
              )}
            </motion.div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-6">Payment</h2>

              {/* Shipping address summary */}
              <div className="mb-6 p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Shipping Address</h3>
                  <button
                    onClick={() => setStep("address")}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div>
                  <p className="text-sm text-gray-700">
                    {shippingAddress?.fullName}
                  </p>
                  <p className="text-sm text-gray-700">
                    {shippingAddress?.addressLine1}
                  </p>
                  {shippingAddress?.addressLine2 && (
                    <p className="text-sm text-gray-700">
                      {shippingAddress.addressLine2}
                    </p>
                  )}
                  <p className="text-sm text-gray-700">
                    {shippingAddress?.city}, {shippingAddress?.state}{" "}
                    {shippingAddress?.postalCode}
                  </p>
                  <p className="text-sm text-gray-700">
                    {shippingAddress?.country}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    {shippingAddress?.email} | {shippingAddress?.phone}
                  </p>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <h3 className="font-medium mb-4">Payment Method</h3>

                <div className="p-4 border rounded-md">
                  <div className="flex items-center">
                    <input
                      id="razorpay"
                      name="paymentMethod"
                      type="radio"
                      className="h-4 w-4 text-primary border-gray-300"
                      defaultChecked
                    />
                    <label
                      htmlFor="razorpay"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Razorpay (Credit/Debit Card, UPI, Netbanking)
                    </label>
                  </div>

                  <div className="mt-6">
                    <RazorpayCheckout
                      userInfo={{
                        name: shippingAddress?.fullName,
                        email: shippingAddress?.email,
                        phone: shippingAddress?.phone,
                      }}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <CartSummary isCheckoutPage />
          </div>
        </div>
      </div>
    </main>
  );
}
