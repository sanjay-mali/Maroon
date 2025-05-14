// Utils for handling wishlist data in Appwrite

/**
 * Parse wishlist data from Appwrite
 * @param wishlistData Wishlist data from Appwrite (can be array or JSON string)
 * @returns Array of product IDs
 */
export function parseWishlist(wishlistData: any): string[] {
  if (!wishlistData) {
    return [];
  }

  // If it's already an array of strings, return it
  if (
    Array.isArray(wishlistData) &&
    (wishlistData.length === 0 || typeof wishlistData[0] === "string")
  ) {
    return wishlistData;
  }

  // If it's a JSON string, parse it
  if (typeof wishlistData === "string") {
    try {
      const parsed = JSON.parse(wishlistData);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing wishlist data:", error);
      return [];
    }
  }

  // Default to empty array for any other case
  return [];
}

/**
 * Stringify wishlist for storage in Appwrite
 * @param wishlist Array of product IDs
 * @returns JSON string
 */
export function stringifyWishlist(wishlist: string[]): string {
  return JSON.stringify(wishlist);
}
