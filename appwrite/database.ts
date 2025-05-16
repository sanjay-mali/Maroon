import { config } from "@/config/config";
import { Client, Databases, ID, Query, Storage } from "appwrite";

export class DBService {
  client = new Client();
  database;
  storage;
  databaseId = "680f58ff0022c60de3f1";
  productsCollectionId = "680f5ebe002589967ce1";
  categoriesCollectionId = "680f5ed400232721c3a9";
  ordersCollectionId = "680f5ef5001ce239d55d";
  usersCollectionId = "680f5ee500152b699ab8";
  storageId = "680f59ea002f06770208";
  bannersCollectionId = "6819d90000299c92d966";
  announcementsCollectionId = "68233e9700242bd9a521";

  constructor() {
    this.client
      .setEndpoint("https://nyc.cloud.appwrite.io/v1")
      .setProject("680f3962002aecf25632");

    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  // Utility to filter allowed fields for each collection
  static allowedFields: Record<string, string[]> = {
    [DBService.prototype.productsCollectionId]: [
      "name",
      "description",
      "categories",
      "price",
      "images",
      "discount_price",
      "stock",
      "is_published",
      "is_draft",
      "is_featured",
      "sizes",
      "colors",
      "is_new",
      "is_disabled",
    ],
    [DBService.prototype.categoriesCollectionId]: [
      "name",
      "description",
      "imageId",
    ],
    [DBService.prototype.ordersCollectionId]: [
      "userId",
      "totalAmount",
      "status",
      "items",
      "createdAt",
      "updatedAt",
    ],
    [DBService.prototype.usersCollectionId]: [
      "name",
      "email",
      "isActive",
      "role",
      "wishlist",
      "addresses",
      "reviews",
      "orders",
      "createdAt",
      "updatedAt",
      "phone",
      "avatar",
    ],
    [DBService.prototype.bannersCollectionId]: [
      "title",
      "subtitle",
      "description",
      "imageId",
      "imageUrl",
      "link",
      "type",
      "startDate",
      "endDate",
      "isActive",
    ],
    [DBService.prototype.announcementsCollectionId]: [
      "title",
      "content",
      "createdAt",
      "updatedAt",
    ],
  };

  static filterAllowedFields(collectionId: string, data: any) {
    const allowed = DBService.allowedFields[collectionId];
    if (!allowed) return data;
    const filtered: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) filtered[key] = data[key];
    }
    return filtered;
  }

  async createDocument(data: any, collectionId = this.bannersCollectionId) {
    const filtered = DBService.filterAllowedFields(collectionId, data);
    try {
      return await this.database.createDocument(
        this.databaseId,
        collectionId,
        ID.unique(),
        filtered
      );
    } catch (error) {
      console.error("Appwrite service :: createDocument :: error", error);
      throw error;
    }
  }

  async updateDocument(
    documentId: string,
    data: any,
    collectionId = this.bannersCollectionId
  ) {
    const filtered = DBService.filterAllowedFields(collectionId, data);
    try {
      return await this.database.updateDocument(
        this.databaseId,
        collectionId,
        documentId,
        filtered
      );
    } catch (error) {
      console.error("Appwrite service :: updateDocument :: error", error);
      throw error;
    }
  }

  async deleteDocument(
    documentId: string,
    collectionId = this.bannersCollectionId
  ) {
    try {
      return await this.database.deleteDocument(
        this.databaseId,
        collectionId,
        documentId
      );
    } catch (error) {
      console.error("Appwrite service :: deleteDocument :: error", error);
      throw error;
    }
  }

  // Products

  async addNewProduct({
    name,
    description,
    categories,
    price,
    images,
    discount_price,
    stock,
    is_published = false,
    is_draft = true,
    is_featured = false,
    sizes,
    colors,
    is_new = false,
    is_disabled = false,
  }: {
    name: string;
    description: string;
    categories: string[];
    price: number;
    images: string[];
    discount_price?: number;
    stock?: number;
    is_published?: boolean;
    is_draft?: boolean;
    is_featured?: boolean;
    sizes?: string[];
    colors?: string[];
    is_new?: boolean;
    is_disabled?: boolean;
  }) {
    try {
      return await this.database.createDocument(
        this.databaseId,
        this.productsCollectionId,
        ID.unique(),
        {
          name,
          description,
          categories,
          price,
          images,
          discount_price,
          stock,
          is_published,
          is_draft,
          is_featured,
          sizes,
          colors,
          is_new,
          is_disabled,
        }
      );
    } catch (error) {
      console.error("Error adding new product:", error);
      throw error;
    }
  }

  // get all products that are not disabled
  async getAllProductsNotDisabled(page = 1, limit = 10) {
    try {
      return await this.database.listDocuments(
        this.databaseId,
        this.productsCollectionId,
        [
          Query.equal("is_disabled", false),
          Query.limit(limit),
          Query.offset((page - 1) * limit),
        ]
      );
    } catch (error) {
      console.error("Error getting all products:", error);
      throw error;
    }
  }

  // Get featured products with server-side filtering
  async getFeaturedProducts(page = 1, limit = 10) {
    try {
      return await this.database.listDocuments(
        this.databaseId,
        this.productsCollectionId,
        [
          Query.equal("is_disabled", false),
          Query.equal("is_featured", true),
          Query.limit(limit),
          Query.offset((page - 1) * limit),
        ]
      );
    } catch (error) {
      console.error("Error getting featured products:", error);
      throw error;
    }
  }

  // Get new products with server-side filtering
  async getNewProducts(page = 1, limit = 10) {
    try {
      return await this.database.listDocuments(
        this.databaseId,
        this.productsCollectionId,
        [
          Query.equal("is_disabled", false),
          Query.equal("is_new", true),
          Query.limit(limit),
          Query.offset((page - 1) * limit),
        ]
      );
    } catch (error) {
      console.error("Error getting new products:", error);
      throw error;
    }
  }

  async getAllProducts(page = 1, limit = 10) {
    try {
      return await this.database.listDocuments(
        this.databaseId,
        this.productsCollectionId,
        [Query.limit(limit), Query.offset((page - 1) * limit)]
      );
    } catch (error) {
      console.error("Error getting all products:", error);
      throw error;
    }
  }

  async getProductById(id: string) {
    try {
      return await this.database.getDocument(
        this.databaseId,
        this.productsCollectionId,
        id
      );
    } catch (error) {
      console.error("Error getting product by ID:", error);
      throw error;
    }
  }

  async updateProduct(
    id: string,
    {
      name,
      description,
      categories,
      price,
      images,
      discount_price,
      stock,
      is_published = false,
      is_draft = true,
      is_featured = false,
      sizes,
      colors,
      is_new = false,
    }: {
      name: string;
      description: string;
      categories: string[];
      price: number;
      images: string[];
      discount_price?: number;
      stock?: number;
      is_published?: boolean;
      is_draft?: boolean;
      is_featured?: boolean;
      sizes?: string[];
      colors?: string[];
      is_new?: boolean;
    }
  ) {
    try {
      return await this.database.updateDocument(
        this.databaseId,
        this.productsCollectionId,
        id,
        {
          name,
          description,
          categories,
          price,
          images,
          discount_price,
          stock,
          is_published,
          is_draft,
          is_featured,
          sizes,
          colors,
          is_new,
        }
      );
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      return await this.database.deleteDocument(
        this.databaseId,
        this.productsCollectionId,
        id
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Get products count by category ID
  async getProductCountByCategory(categoryId: string) {
    try {
      const result = await this.database.listDocuments(
        this.databaseId,
        this.productsCollectionId,
        [Query.equal("categories", categoryId)]
      );
      return result.total;
    } catch (error) {
      console.error(
        `Error getting product count for category ${categoryId}:`,
        error
      );
      return 0;
    }
  }

  // Get products by category ID (array field)
  async getProductsByCategory(categoryId: string, page = 1, limit = 24) {
    try {
      return await this.database.listDocuments(
        this.databaseId,
        this.productsCollectionId,
        [
          Query.equal("is_disabled", false),
          Query.equal("categories", categoryId),
          Query.limit(limit),
          Query.offset((page - 1) * limit),
        ]
      );
    } catch (error) {
      console.error("Error getting products by category:", error);
      throw error;
    }
  }

  // Categories

  async addNewCategory({
    name,
    description = "",
    imageId = "",
  }: {
    name: string;
    description: string;
    imageId?: string;
  }) {
    try {
      const data: any = {
        name: name,
        description: description,
      };

      if (description) {
        data.description = description;
      }

      if (imageId) {
        data.imageId = imageId;
      }

      return await this.database.createDocument(
        this.databaseId,
        this.categoriesCollectionId,
        ID.unique(),
        data
      );
    } catch (error) {
      console.error("Error adding new category:", error);
      throw error;
    }
  }

  async getAllCategories(page = 1, limit = 10) {
    try {
      const categories = await this.database.listDocuments(
        this.databaseId,
        this.categoriesCollectionId,
        [Query.limit(limit), Query.offset((page - 1) * limit)]
      );

      // Enhanced categories with product counts and image URLs
      const enhancedCategories = await Promise.all(
        categories.documents.map(async (category: any) => {
          const productCount = await this.getProductCountByCategory(
            category.$id
          );

          // Generate image URL if image exists
          let imageUrl = null;
          if (category.imageId) {
            imageUrl = this.storage.getFilePreview(
              this.storageId,
              category.imageId
            );
          }

          return {
            id: category.$id,
            name: category.name, // Try both field names
            description: category.description || "",
            productCount,
            imageUrl,
            imageId: category.imageId || null,
            ...category,
          };
        })
      );

      return {
        documents: enhancedCategories,
        total: categories.total,
      };
    } catch (error) {
      console.error("Error getting all categories:", error);
      throw error;
    }
  }

  async getCategoryById(id: string) {
    try {
      const category = await this.database.getDocument(
        this.databaseId,
        this.categoriesCollectionId,
        id
      );

      // Get product count for this category
      const productCount = await this.getProductCountByCategory(id);

      // Generate image URL if image exists
      let imageUrl = null;
      if (category.imageId) {
        imageUrl = this.storage.getFilePreview(
          this.storageId,
          category.imageId
        );
      }

      return {
        id: category.$id,
        name: category.name, // Try both field names
        description: category.description || "",
        productCount,
        imageUrl,
        imageId: category.imageId || null,
        ...category,
      };
    } catch (error) {
      console.error("Error getting category by ID:", error);
      throw error;
    }
  }

  async updateCategory(
    id: string,
    name: string,
    description: string = "",
    imageId?: string
  ) {
    try {
      // Use title instead of name to match the database schema
      const data: any = { name: name, description };

      // Only update image if provided
      if (imageId !== undefined) {
        data.imageId = imageId;
      }

      return await this.database.updateDocument(
        this.databaseId,
        this.categoriesCollectionId,
        id,
        data
      );
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      return await this.database.deleteDocument(
        this.databaseId,
        this.categoriesCollectionId,
        id
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  // Upload image to storage and return preview URL only
  async uploadImage(file: File): Promise<string> {
    try {
      const response = await this.storage.createFile(
        this.storageId,
        ID.unique(),
        file
      );
      return this.storage.getFilePreview(this.storageId, response.$id);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  async uploadImages(files: File[]): Promise<string[]> {
    try {
      const results: string[] = [];
      for (const file of files) {
        const url = await this.uploadImage(file);
        results.push(url);
      }
      return results;
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      throw error;
    }
  }

  async deleteImage(fileId: string) {
    try {
      return await this.storage.deleteFile(this.storageId, fileId);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }

  async getImage(fileId: string) {
    try {
      return this.storage.getFilePreview(this.storageId, fileId);
    } catch (error) {
      console.error("Error getting image:", error);
      throw error;
    }
  }

  // Enhanced image handling
  async uploadAndGetImageUrl(
    file: File
  ): Promise<{ fileId: string; imageUrl: string }> {
    try {
      // Upload file to storage
      const uploadedFile = await this.storage.createFile(
        this.storageId,
        ID.unique(),
        file
      );

      // Generate preview URL
      const imageUrl = this.storage
        .getFilePreview(this.storageId, uploadedFile.$id)
        .toString();

      return {
        fileId: uploadedFile.$id,
        imageUrl: imageUrl,
      };
    } catch (error) {
      console.error("Error uploading and getting image URL:", error);
      throw error;
    }
  }

  async deleteImageWithId(fileId: string) {
    try {
      await this.storage.deleteFile(this.storageId, fileId);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }

  async createOrder(orderData: any) {
    try {
      return await this.database.createDocument(
        this.databaseId,
        this.ordersCollectionId,
        ID.unique(),
        orderData
      );
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getOrderById(orderId: any) {
    try {
      return await this.database.getDocument(
        this.databaseId,
        this.ordersCollectionId,
        orderId
      );
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  async getAllOrders() {
    try {
      return await this.database.listDocuments(
        this.databaseId,
        this.ordersCollectionId
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: any, status: any) {
    try {
      return await this.database.updateDocument(
        this.databaseId,
        this.ordersCollectionId,
        orderId,
        { status }
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  // User Management
  async createUser(userData: {
    userId: string;
    name: string;
    email: string;
    isActive?: boolean;
    role?: "customer" | "admin";
  }) {
    try {
      return await this.database.createDocument(
        this.databaseId,
        this.usersCollectionId,
        userData.userId,
        {
          name: userData.name,
          email: userData.email,
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          role: userData.role || "customer",
          wishlist: [],
          addresses: [],
          reviews: [],
          orders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getAllUsers(page = 1, limit = 20) {
    try {
      return await this.database.listDocuments(
        this.databaseId,
        this.usersCollectionId,
        [Query.limit(limit), Query.offset((page - 1) * limit)]
      );
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      return await this.database.getDocument(
        this.databaseId,
        this.usersCollectionId,
        userId
      );
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  async updateUser(
    userId: string,
    userData: Partial<{
      name: string;
      email: string;
      phone: string;
      avatar: string;
      isActive: boolean;
      role: "customer" | "admin";
    }>
  ) {
    try {
      const data = {
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      return await this.database.updateDocument(
        this.databaseId,
        this.usersCollectionId,
        userId,
        data
      );
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      return await this.database.deleteDocument(
        this.databaseId,
        this.usersCollectionId,
        userId
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async blockUser(userId: string) {
    try {
      return await this.updateUser(userId, { isActive: false });
    } catch (error) {
      console.error("Error blocking user:", error);
      throw error;
    }
  }
  async unblockUser(userId: string) {
    try {
      return await this.updateUser(userId, { isActive: true });
    } catch (error) {
      console.error("Error unblocking user:", error);
      throw error;
    }
  }

  // User Address Management
  async addUserAddress(
    userId: string,
    addressData: {
      fullName: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone: string;
      isDefault?: boolean;
    }
  ) {
    try {
      const user = await this.getUserById(userId);
      let addresses = [];

      // Parse existing addresses if they exist
      if (user.addresses) {
        try {
          // Handle both string and array formats for backward compatibility
          if (typeof user.addresses === "string") {
            addresses = JSON.parse(user.addresses);
          } else if (Array.isArray(user.addresses)) {
            addresses = user.addresses;
          }
        } catch (e) {
          // If parsing fails, assume it's an empty array
          addresses = [];
        }
      }

      // Create a new address with ID
      const newAddress = {
        id: ID.unique(),
        ...addressData,
        isDefault:
          addressData.isDefault !== undefined
            ? addressData.isDefault
            : addresses.length === 0,
        createdAt: new Date().toISOString(),
      };

      // If this is the default address, make other addresses non-default
      if (newAddress.isDefault) {
        addresses = addresses.map((addr: any) => {
          return { ...addr, isDefault: false };
        });
      }

      // Add the new address to the array
      addresses.push(newAddress);

      // Update the user document with stringified addresses
      // Store as a JSON string since Appwrite doesn't support nested objects
      return await this.database.updateDocument(
        this.databaseId,
        this.usersCollectionId,
        userId,
        {
          addresses: JSON.stringify(addresses),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error("Error adding user address:", error);
      throw error;
    }
  }
  async getUserAddresses(userId: string) {
    try {
      const user = await this.getUserById(userId);

      // Handle case where addresses is stored as a JSON string
      if (user.addresses && typeof user.addresses === "string") {
        try {
          return JSON.parse(user.addresses);
        } catch (e) {
          console.error("Error parsing addresses JSON:", e);
          return [];
        }
      }

      // Handle case where addresses is already an array
      if (Array.isArray(user.addresses)) {
        return user.addresses;
      }

      // Default to empty array if no addresses found
      return [];
    } catch (error) {
      console.error("Error getting user addresses:", error);
      throw error;
    }
  }
  // User Wishlist Management
  async addToWishlist(userId: string, productId: string) {
    try {
      const user = await this.getUserById(userId);
      let wishlist = [];

      // Parse existing wishlist if it exists
      if (user.wishlist) {
        try {
          // Handle both string and array formats for backward compatibility
          if (typeof user.wishlist === "string") {
            wishlist = JSON.parse(user.wishlist);
          } else if (Array.isArray(user.wishlist)) {
            wishlist = user.wishlist;
          }
        } catch (e) {
          // If parsing fails, assume it's an empty array
          wishlist = [];
        }
      }

      // Only add if not already in wishlist
      if (!wishlist.includes(productId)) {
        wishlist.push(productId);

        return await this.database.updateDocument(
          this.databaseId,
          this.usersCollectionId,
          userId,
          {
            wishlist: JSON.stringify(wishlist),
            updatedAt: new Date().toISOString(),
          }
        );
      }

      return user;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  }
  async removeFromWishlist(userId: string, productId: string) {
    try {
      const user = await this.getUserById(userId);
      let wishlist = [];

      // Parse existing wishlist if it exists
      if (user.wishlist) {
        try {
          // Handle both string and array formats for backward compatibility
          if (typeof user.wishlist === "string") {
            wishlist = JSON.parse(user.wishlist);
          } else if (Array.isArray(user.wishlist)) {
            wishlist = user.wishlist;
          }
        } catch (e) {
          wishlist = [];
        }
      }

      // Filter out the product to remove
      const updatedWishlist = wishlist.filter((id: string) => id !== productId);

      return await this.database.updateDocument(
        this.databaseId,
        this.usersCollectionId,
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
  async getWishlist(userId: string) {
    try {
      const user = await this.getUserById(userId);

      // Handle case where wishlist is stored as a JSON string
      if (user.wishlist && typeof user.wishlist === "string") {
        try {
          return JSON.parse(user.wishlist);
        } catch (e) {
          console.error("Error parsing wishlist JSON:", e);
          return [];
        }
      }

      // Handle case where wishlist is already an array
      if (Array.isArray(user.wishlist)) {
        return user.wishlist;
      }

      // Default to empty array if no wishlist found
      return [];
    } catch (error) {
      console.error("Error getting wishlist:", error);
      throw error;
    }
  }
  // User order tracking
  async addOrderToUserHistory(userId: string, orderId: string) {
    try {
      const user = await this.getUserById(userId);
      let orders = [];

      // Parse existing orders if they exist
      if (user.orders) {
        try {
          // Handle both string and array formats for backward compatibility
          if (typeof user.orders === "string") {
            orders = JSON.parse(user.orders);
          } else if (Array.isArray(user.orders)) {
            orders = user.orders;
          }
        } catch (e) {
          // If parsing fails, assume it's an empty array
          orders = [];
        }
      }

      // Add the new order
      orders.push(orderId);

      return await this.database.updateDocument(
        this.databaseId,
        this.usersCollectionId,
        userId,
        {
          orders: JSON.stringify(orders),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error("Error adding order to user history:", error);
      throw error;
    }
  }
  async getUserOrderCount(userId: string) {
    try {
      const user = await this.getUserById(userId);

      // Handle case where orders is stored as a JSON string
      if (user.orders && typeof user.orders === "string") {
        try {
          const parsedOrders = JSON.parse(user.orders);
          return Array.isArray(parsedOrders) ? parsedOrders.length : 0;
        } catch (e) {
          console.error("Error parsing orders JSON:", e);
          return 0;
        }
      }

      // Handle case where orders is already an array
      if (Array.isArray(user.orders)) {
        return user.orders.length;
      }

      // Default to 0 if no orders found
      return 0;
    } catch (error) {
      console.error("Error getting user order count:", error);
      return 0;
    }
  }

  // Banners
  async listDocuments(queries: string[] = [], orderBy?: { orderBy?: string }) {
    try {
      const queryArray = queries.map((q) => {
        const [key, value] = q.split(/([<>]=?)/);

        // Handle boolean values
        if (value === "true" || value === "false") {
          return Query.equal(key, value === "true");
        }

        // Handle date comparisons
        if (q.includes("<=")) {
          const [field, date] = q.split("<=");
          return Query.lessThanEqual(field, date);
        }
        if (q.includes(">=")) {
          const [field, date] = q.split(">=");
          return Query.greaterThanEqual(field, date);
        }

        // Handle equals comparison (default case)
        const [field, equalValue] = q.split("=");
        return Query.equal(field, equalValue);
      });

      if (orderBy?.orderBy) {
        queryArray.push(Query.orderAsc(orderBy.orderBy));
      }

      return await this.database.listDocuments(
        this.databaseId,
        "6819d90000299c92d966",
        queryArray
      );
    } catch (error) {
      console.error("Appwrite service :: listDocuments :: error", error);
      throw error;
    }
  }

  // Banner Methods
  async getBanners(type?: "hero" | "sale") {
    try {
      const queries = [
        Query.equal("isActive", true),
        Query.orderDesc("$createdAt"),
      ];

      // Add type filter if specified
      if (type) {
        queries.push(Query.equal("type", type));
      }

      return await this.database.listDocuments(
        this.databaseId,
        this.bannersCollectionId,
        queries
      );
    } catch (error) {
      console.error("Error fetching banners:", error);
      throw error;
    }
  }
  // Announcement Methods
  async getAnnouncements() {
    try {
      return await this.database.listDocuments(
        this.databaseId,
        this.announcementsCollectionId,
        [Query.equal("isActive", true), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error("Error fetching announcements:", error);
      throw error;
    }
  }

  async getAllAnnouncements() {
    try {
      return await this.database.listDocuments(
        this.databaseId,
        this.announcementsCollectionId,
        [Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error("Error fetching all announcements:", error);
      throw error;
    }
  }

  async createAnnouncement(data: any) {
    try {
      return await this.createDocument(data, this.announcementsCollectionId);
    } catch (error) {
      console.error("Error creating announcement:", error);
      throw error;
    }
  }

  async updateAnnouncement(documentId: string, data: any) {
    try {
      return await this.updateDocument(
        documentId,
        data,
        this.announcementsCollectionId
      );
    } catch (error) {
      console.error("Error updating announcement:", error);
      throw error;
    }
  }

  async deleteAnnouncement(documentId: string) {
    try {
      return await this.deleteDocument(
        documentId,
        this.announcementsCollectionId
      );
    } catch (error) {
      console.error("Error deleting announcement:", error);
      throw error;
    }
  }
}

const dbService = new DBService();

export default dbService;
