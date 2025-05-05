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

  constructor() {
    this.client
      .setEndpoint("https://nyc.cloud.appwrite.io/v1")
      .setProject("680f3962002aecf25632");

    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
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
      const addresses = user.addresses || [];

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
        addresses.forEach((addr) => {
          const parsedAddr = typeof addr === "string" ? JSON.parse(addr) : addr;
          parsedAddr.isDefault = false;
          return JSON.stringify(parsedAddr);
        });
      }

      // Add the new address as a JSON string
      addresses.push(JSON.stringify(newAddress));

      // Update the user document
      return await this.database.updateDocument(
        this.databaseId,
        this.usersCollectionId,
        userId,
        {
          addresses,
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
      return user.addresses || [];
    } catch (error) {
      console.error("Error getting user addresses:", error);
      throw error;
    }
  }

  // User Wishlist Management
  async addToWishlist(userId: string, productId: string) {
    try {
      const user = await this.getUserById(userId);
      let wishlist = user.wishlist || [];

      // Only add if not already in wishlist
      if (!wishlist.includes(productId)) {
        wishlist.push(productId);

        return await this.database.updateDocument(
          this.databaseId,
          this.usersCollectionId,
          userId,
          {
            wishlist,
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
      const wishlist = (user.wishlist || []).filter((id) => id !== productId);

      return await this.database.updateDocument(
        this.databaseId,
        this.usersCollectionId,
        userId,
        {
          wishlist,
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
      return user.wishlist || [];
    } catch (error) {
      console.error("Error getting wishlist:", error);
      throw error;
    }
  }

  // User order tracking
  async addOrderToUserHistory(userId: string, orderId: string) {
    try {
      const user = await this.getUserById(userId);
      const orders = user.orders || [];
      orders.push(orderId);

      return await this.database.updateDocument(
        this.databaseId,
        this.usersCollectionId,
        userId,
        {
          orders,
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
      return (user.orders || []).length;
    } catch (error) {
      console.error("Error getting user order count:", error);
      return 0;
    }
  }
}

const dbService = new DBService();

export default dbService;
