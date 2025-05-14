// Database service extension for user-related operations
// This file adds methods to the main database service

import { DbHelper } from "@/lib/dbHelper";
import dbService from "@/appwrite/database";
import { ID } from "appwrite";

// Add user address
export async function addUserAddress(userId: string, addressData: any) {
  try {
    const user = await dbService.getUserById(userId);
    const updatedAddresses = DbHelper.addAddress(user.addresses, addressData);
    // Use the database instance directly to update custom fields
    return await dbService.database.updateDocument(
      dbService.databaseId,
      dbService.usersCollectionId,
      userId,
      {
        addresses: JSON.stringify(updatedAddresses),
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error adding user address:", error);
    throw error;
  }
}

// Get user addresses
export async function getUserAddresses(userId: string) {
  try {
    const user = await dbService.getUserById(userId);
    return DbHelper.parseAddresses(user.addresses);
  } catch (error) {
    console.error("Error getting user addresses:", error);
    throw error;
  }
}

// Add to wishlist
export async function addToWishlist(userId: string, productId: string) {
  try {
    const user = await dbService.getUserById(userId);
    const updatedWishlist = DbHelper.addToWishlist(user.wishlist, productId);
    return await dbService.database.updateDocument(
      dbService.databaseId,
      dbService.usersCollectionId,
      userId,
      {
        wishlist: JSON.stringify(updatedWishlist),
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
}

// Remove from wishlist
export async function removeFromWishlist(userId: string, productId: string) {
  try {
    const user = await dbService.getUserById(userId);
    const updatedWishlist = DbHelper.removeFromWishlist(
      user.wishlist,
      productId
    );
    return await dbService.database.updateDocument(
      dbService.databaseId,
      dbService.usersCollectionId,
      userId,
      {
        wishlist: JSON.stringify(updatedWishlist),
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
}

// Get wishlist
export async function getWishlist(userId: string) {
  try {
    const user = await dbService.getUserById(userId);
    return DbHelper.parseWishlist(user.wishlist);
  } catch (error) {
    console.error("Error getting wishlist:", error);
    throw error;
  }
}

// Add order to user history
export async function addOrderToUser(userId: string, orderId: string) {
  try {
    const user = await dbService.getUserById(userId);
    const updatedOrders = DbHelper.addToOrders(user.orders, orderId);
    return await dbService.database.updateDocument(
      dbService.databaseId,
      dbService.usersCollectionId,
      userId,
      {
        orders: JSON.stringify(updatedOrders),
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error adding order to user history:", error);
    throw error;
  }
}

// Get user order count
export async function getUserOrderCount(userId: string) {
  try {
    const user = await dbService.getUserById(userId);
    const orders = DbHelper.parseOrders(user.orders);
    return orders.length;
  } catch (error) {
    console.error("Error getting user order count:", error);
    return 0;
  }
}

// Extend the dbService object with these methods
Object.assign(dbService, {
  addUserAddress,
  getUserAddresses,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  addOrderToUser,
  getUserOrderCount,
});

export default dbService;
