// Utils for handling address data in Appwrite
import { UserAddress } from "@/types/user";

/**
 * Parse addresses from Appwrite database
 * Handles both string (JSON) and array formats
 */
export function parseAddresses(addressData: any): UserAddress[] {
  if (!addressData) {
    return [];
  }

  // If it's already an array of objects, return it
  if (Array.isArray(addressData) && 
      addressData.length > 0 && 
      typeof addressData[0] === 'object') {
    return addressData;
  }

  // If it's a JSON string, parse it
  if (typeof addressData === 'string') {
    try {
      const parsed = JSON.parse(addressData);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing address data:", error);
      return [];
    }
  }

  // Default to empty array for any other case
  return [];
}

/**
 * Stringify addresses for storage in Appwrite
 */
export function stringifyAddresses(addresses: UserAddress[]): string {
  return JSON.stringify(addresses);
}
