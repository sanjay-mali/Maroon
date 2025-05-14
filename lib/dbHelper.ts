// Helper functions for database operations

import { ID } from "appwrite";
import { UserAddress } from "@/types/user";

/**
 * Helper class for database operations that need JSON serialization/deserialization
 */
export class DbHelper {
  /**
   * Parse addresses from database result
   * @param addresses Address data from the database
   * @returns Parsed address objects
   */
  static parseAddresses(addresses: any): UserAddress[] {
    if (!addresses) {
      return [];
    }
    
    // Handle string format (JSON)
    if (typeof addresses === 'string') {
      try {
        const parsed = JSON.parse(addresses);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Error parsing addresses string:", error);
        return [];
      }
    }
    
    // Already an array
    if (Array.isArray(addresses)) {
      return addresses;
    }
    
    return [];
  }
  
  /**
   * Add an address to a user's address list
   * @param existingAddresses Existing addresses (array or string)
   * @param newAddress New address to add
   * @returns Updated addresses as JSON string
   */  static addAddress(existingAddresses: any, newAddress: any): UserAddress[] {
    // Parse existing addresses
    const addresses = this.parseAddresses(existingAddresses);
    
    // Create new address with ID
    const addressWithId = {
      id: ID.unique(),
      ...newAddress,
      createdAt: new Date().toISOString(),
    };
    
    // If this should be default, update others
    if (newAddress.isDefault) {
      addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Add new address
    addresses.push(addressWithId);
    
    // Return array directly (not JSON string)
    return addresses;
  }
  
  /**
   * Parse wishlist from database result
   * @param wishlist Wishlist data from database
   * @returns Array of product IDs
   */
  static parseWishlist(wishlist: any): string[] {
    if (!wishlist) {
      return [];
    }
    
    // Handle string format (JSON)
    if (typeof wishlist === 'string') {
      try {
        const parsed = JSON.parse(wishlist);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Error parsing wishlist string:", error);
        return [];
      }
    }
    
    // Already an array
    if (Array.isArray(wishlist)) {
      return wishlist;
    }
    
    return [];
  }
  
  /**
   * Add product to wishlist
   * @param existingWishlist Existing wishlist (array or string)
   * @param productId Product ID to add
   * @returns Updated wishlist as JSON string
   */  static addToWishlist(existingWishlist: any, productId: string): string[] {
    const wishlist = this.parseWishlist(existingWishlist);
    
    // Only add if not already in wishlist
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
    }
    
    return wishlist;
  }
  
  /**
   * Remove product from wishlist
   * @param existingWishlist Existing wishlist (array or string)
   * @param productId Product ID to remove
   * @returns Updated wishlist as JSON string
   */  static removeFromWishlist(existingWishlist: any, productId: string): string[] {
    const wishlist = this.parseWishlist(existingWishlist);
    const updatedWishlist = wishlist.filter(id => id !== productId);
    return updatedWishlist;
  }
  
  /**
   * Parse orders from database result
   * @param orders Orders data from database
   * @returns Array of order IDs
   */
  static parseOrders(orders: any): string[] {
    if (!orders) {
      return [];
    }
    
    // Handle string format (JSON)
    if (typeof orders === 'string') {
      try {
        const parsed = JSON.parse(orders);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Error parsing orders string:", error);
        return [];
      }
    }
    
    // Already an array
    if (Array.isArray(orders)) {
      return orders;
    }
    
    return [];
  }
  
  /**
   * Add order to user's order history
   * @param existingOrders Existing orders (array or string)
   * @param orderId Order ID to add
   * @returns Updated orders as JSON string
   */  static addToOrders(existingOrders: any, orderId: string): string[] {
    const orders = this.parseOrders(existingOrders);
    orders.push(orderId);
    return orders;
  }
}
