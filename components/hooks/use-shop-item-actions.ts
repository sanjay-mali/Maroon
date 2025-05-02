import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity?: number; // Only for cart
}

export function useShopItemActions<T extends ShopItem>(
  setItems: React.Dispatch<React.SetStateAction<T[]>>,
  context: "cart" | "wishlist" = "cart"
) {
  const { toast } = useToast();

  const removeItem = useCallback(
    (id: string) => {
      try {
        setItems((items) => items.filter((item) => item.id !== id));
        toast({
          title: "Item removed",
          description:
            context === "cart"
              ? "The item has been removed from your cart."
              : "The item has been removed from your wishlist.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to remove item from ${context}. Please try again.`,
        });
      }
    },
    [setItems, toast, context]
  );

  const moveToCart = useCallback(
    (id: string) => {
      try {
        toast({
          title: "Added to cart",
          description: "The item has been added to your cart.",
        });
        removeItem(id);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to move item to cart. Please try again.",
        });
      }
    },
    [removeItem, toast]
  );

  return { removeItem, moveToCart };
}
