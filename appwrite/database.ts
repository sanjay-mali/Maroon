import { Client, Databases, ID, Query, Storage } from "appwrite";

export class DBService {
  client = new Client();
  database;
  storage;

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
        "680f58ff0022c60de3f1",
        "680f5ebe002589967ce1",
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
    }
  }

  // get all products that are not disabled
  async getAllProductsNotDisabled() {
    try {
      return await this.database.listDocuments(
        "680f58ff0022c60de3f1",
        "680f5ebe002589967ce1",
        [Query.equal("is_disabled", false)]
      );
    } catch (error) {
      console.error("Error getting all products:", error);
    }
  }
  async getAllProducts() {
    try {
      return await this.database.listDocuments(
        "680f58ff0022c60de3f1",
        "680f5ebe002589967ce1"
      );
    } catch (error) {
      console.error("Error getting all products:", error);
    }
  }

  async getProductById(id: string) {
    try {
      return await this.database.getDocument(
        "680f58ff0022c60de3f1",
        "680f5ebe002589967ce1",
        id,
        [Query.equal("is_disabled", false)]
      );
    } catch (error) {
      console.error("Error getting product by ID:", error);
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
        "680f58ff0022c60de3f1",
        "680f5ebe002589967ce1",
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
    }
  }

  async deleteProduct(id: string) {
    try {
      return await this.database.deleteDocument(
        "680f58ff0022c60de3f1",
        "680f5ebe002589967ce1",
        id
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  // Categories

  async addNewCategory(name: string, description: string) {
    try {
      return await this.database.createDocument(
        "680f58ff0022c60de3f1",
        "680f5ed400232721c3a9",
        ID.unique(),
        {
          name,
          description,
        }
      );
    } catch (error) {
      console.error("Error adding new category:", error);
    }
  }

  async getAllCategories() {
    try {
      return await this.database.listDocuments(
        "680f58ff0022c60de3f1",
        "680f5ed400232721c3a9"
      );
    } catch (error) {
      console.error("Error getting all categories:", error);
    }
  }

  async getCategoryById(id: string) {
    try {
      return await this.database.getDocument(
        "680f58ff0022c60de3f1",
        "680f5ed400232721c3a9",
        id
      );
    } catch (error) {
      console.error("Error getting category by ID:", error);
    }
  }

  async updateCategory(id: string, name: string, description: string) {
    try {
      return await this.database.updateDocument(
        "680f58ff0022c60de3f1",
        "680f5ed400232721c3a9",
        id,
        {
          name,
          description,
        }
      );
    } catch (error) {
      console.error("Error updating category:", error);
    }
  }

  async deleteCategory(id: string) {
    try {
      return await this.database.deleteDocument(
        "680f58ff0022c60de3f1",
        "680f5ed400232721c3a9",
        id
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  // Upload image to storage
  async uploadImage(file: File) {
    try {
      return await this.storage.createFile(
        "680f59ea002f06770208",
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  async deleteImage(fileId: string) {
    try {
      return await this.storage.deleteFile("680f59ea002f06770208", fileId);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  async getImage(fileId: string) {
    try {
      return this.storage.getFilePreview("680f59ea002f06770208", fileId);
    } catch (error) {
      console.error("Error getting image:", error);
    }
  }
}

const dbService = new DBService();

export default dbService;
