import { Client, Databases, ID, Query, Storage } from "appwrite";

export class DBService {
  client = new Client();
  database;
  storage;
  databaseId = "680f58ff0022c60de3f1";
  productsCollectionId = "680f5ebe002589967ce1";
  categoriesCollectionId = "680f5ed400232721c3a9";
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
}

const dbService = new DBService();

export default dbService;
