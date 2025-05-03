"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  discount_price?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  // Calculate derived values from cart
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.discount_price || item.price) * item.quantity,
    0
  );
  const shipping = subtotal > 2000 ? 0 : 250; // Free shipping over ₹2,000
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart data", error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isClient]);

  // Add item to cart
  const addToCart = (item: CartItem) => {
    setCart((currentCart) => {
      // Check if item already exists in cart
      const existingItemIndex = currentCart.findIndex(
        (cartItem) => 
          cartItem.id === item.id && 
          cartItem.color === item.color && 
          cartItem.size === item.size
      );

      let newCart;

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        newCart = [...currentCart];
        newCart[existingItemIndex].quantity += item.quantity;
      } else {
        // Item doesn't exist, add it
        newCart = [...currentCart, item];
      }

      // Show toast notification
      toast({
        title: "Item added to cart",
        description: `${item.name} has been added to your cart.`,
      });

      return newCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart((currentCart) => {
      const itemToRemove = currentCart.find((item) => item.id === id);
      const newCart = currentCart.filter((item) => item.id !== id);
      
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} has been removed from your cart.`,
        });
      }

      return newCart;
    });
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart((currentCart) => 
      currentCart.map((item) => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shipping,
        tax,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}