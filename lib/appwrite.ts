import { config } from "@/config/config";
import { Client, Databases, Storage, Account, Query, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("680f3962002aecf25632");

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

export { client };

export const databaseId = "680f58ff0022c60de3f1";

export const accountsCollectionId = "680f5f03001192ec53ad";
export const productsCollectionId = "680f5ebe002589967ce1";
export const categoriesCollectionId = "680f5ed400232721c3a9";
export const usersCollectionId = "680f5ee500152b699ab8";
export const ordersCollectionId = "680f5ef5001ce239d55d";
export const storageId = "680f59ea002f06770208";

// Auth Service
export async function createAccount({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  try {
    const userAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    if (userAccount) {
      return Login({ email, password });
    } else {
      return userAccount;
    }
  } catch (error) {
    throw error;
  }
}

export async function Login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    // Create email/password session
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function Logout() {
  try {
    return await account.deleteSessions();
  } catch (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const user = await account.get();
    return user;
  } catch (error: any) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export const deleteUser = async (userId: string) => {
  try {
    await account.deleteSession(userId);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getTotalProducts = async (): Promise<number> => {
  try {
    const { total } = await databases.listDocuments(
      databaseId,
      productsCollectionId
    );
    return total;
  } catch (error) {
    console.error("Error getting total products:", error);
    return 0;
  }
};

export const getTotalRevenue = async () => {
  try {
    const { documents } = await databases.listDocuments(
      databaseId,
      ordersCollectionId
    );
    const totalRevenue = documents.reduce((sum, order) => {
      const orderData = order as any;
      return sum + (orderData.totalAmount || 0);
    }, 0);
    return totalRevenue;
  } catch (error) {
    console.error("Error getting total revenue:", error);
    return 0;
  }
};

export const getTotalOrders = async () => {
  try {
    const { total } = await databases.listDocuments(
      databaseId,
      ordersCollectionId
    );
    return total;
  } catch (error) {
    console.error("Error getting total orders:", error);
    return 0;
  }
};

export const getTotalActiveUsers = async () => {
  return 0;
};

export const getLowStockProducts = async (): Promise<any[]> => {
  try {
    const { documents } = await databases.listDocuments(
      databaseId,
      productsCollectionId,
      [Query.lessThan("stock", 5)]
    );
    return documents.map((product: any) => ({
      id: product.$id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    }));
  } catch (error) {
    console.error("Error getting low stock products:", error);
    return [];
  }
};

export const getAllProducts = async (): Promise<any[] | any> => {
  try {
    const { documents } = await databases.listDocuments(
      databaseId,
      productsCollectionId
    );
    return documents.map((product: any) => ({
      id: product.$id,
      images: product.images,
      ...product,
    }));
  } catch (error) {
    console.error("Error getting all products:", error);
  }
};

export const getProductById = async (
  productId: string
): Promise<any | null> => {
  try {
    const product = (await databases.getDocument(
      databaseId,
      productsCollectionId,
      productId
    )) as any;
    return {
      id: product.$id,
      images: product.images,
      ...product,
    };
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return null;
  }
};

export const getAdminProfile = async () => {
  return {
    name: "Admin",
    email: "admin@example.com",
  };
};

export const updateAdminName = async (name: string) => {
  try {
    alert(`name updated: ${name}`);
  } catch (error) {
    console.error("Error updating name:", error);
  }
};

export const updateAdminEmail = async (email: string) => {
  try {
    alert(`email updated: ${email}`);
  } catch (error) {
    console.error("Error updating email:", error);
    return false;
  }
};

export const updateAdminPassword = async (password: string) => {
  try {
    alert(`password updated: ${password}`);
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    await databases.deleteDocument(databaseId, productsCollectionId, productId);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addProduct = async (productData: any) => {
  try {
    await databases.createDocument(
      databaseId,
      productsCollectionId,
      ID.unique(),
      { ...productData }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return false;
  }
};

export const updateProduct = async (productId: string, productData: any) => {
  try {
    await databases.updateDocument(
      databaseId,
      productsCollectionId,
      productId,
      productData
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
};

export const getAllCategories = async () => {
  try {
    const { documents } = await databases.listDocuments(
      databaseId,
      categoriesCollectionId
    );
    return documents.map((category: any) => ({
      id: category.$id,
      name: category.name,
      ...category,
    }));
  } catch (error) {
    console.error("Error getting all categories:", error);
    return null;
  }
};

export const getCategoryById = async (categoryId: string) => {
  try {
    const category = (await databases.getDocument(
      databaseId,
      categoriesCollectionId,
      categoryId
    )) as any;
    return {
      id: category.$id,
      name: category.name,
    };
  } catch (error) {
    console.error("Error getting category by ID:", error);
    return null;
  }
};

export const addCategory = async (name: string) => {
  try {
    await databases.createDocument(
      databaseId,
      categoriesCollectionId,
      ID.unique(),
      { name }
    );
    return true;
  } catch (error) {
    console.error("Error adding category:", error);
    return false;
  }
};

export const updateCategory = async (categoryId: string, name: string) => {
  try {
    await databases.updateDocument(
      databaseId,
      categoriesCollectionId,
      categoryId,
      { name }
    );
    return true;
  } catch (error) {
    console.error("Error updating category:", error);
    return false;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    await databases.deleteDocument(
      databaseId,
      categoriesCollectionId,
      categoryId
    );
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};

export const uploadImages = async (files: File[]) => {
  try {
    const uploadedImages: string[] = [];
    for (const file of files) {
      try {
        const storageResponse = await storage.createFile(
          storageId,
          ID.unique(),
          file
        );
        const previewUrl = storage.getFilePreview(
          storageId,
          storageResponse.$id
        );
        uploadedImages.push(previewUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    return uploadedImages;
  } catch (error) {
    console.error("Error uploading images:", error);
    return [];
  }
};

export const getAllOrders = async () => {
  try {
    const { documents } = await databases.listDocuments(
      databaseId,
      ordersCollectionId
    );
    return documents.map((order: any) => ({
      id: order.$id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
      ...order,
    }));
  } catch (error) {
    console.error("Error getting all orders:", error);
    return null;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const order = (await databases.getDocument(
      databaseId,
      ordersCollectionId,
      orderId
    )) as any;
    return {
      id: order.$id,
      status: order.status,
      ...order,
    };
  } catch (error) {
    console.error("Error getting order by ID:", error);
    return null;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    await databases.updateDocument(databaseId, ordersCollectionId, orderId, {
      status,
    });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
};

export const addProductToWishlist = async (
  userId: string,
  productId: string
) => {
  try {
    const user = await databases.getDocument(
      databaseId,
      usersCollectionId,
      userId
    );
    const userWishlist = user.wishlist || [];
    if (!userWishlist.includes(productId)) {
      userWishlist.push(productId);
      await databases.updateDocument(databaseId, usersCollectionId, userId, {
        wishlist: userWishlist,
      });
    }
    return true;
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return false;
  }
};

export const removeProductFromWishlist = async (
  userId: string,
  productId: string
) => {
  try {
    const user = await databases.getDocument(
      databaseId,
      usersCollectionId,
      userId
    );
    let userWishlist = user.wishlist || [];
    userWishlist = userWishlist.filter((id: string) => id !== productId);

    await databases.updateDocument(databaseId, usersCollectionId, userId, {
      wishlist: userWishlist,
    });
    return true;
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    return false;
  }
};

export const getWishlist = async (userId: string) => {
  try {
    const user = await databases.getDocument(
      databaseId,
      usersCollectionId,
      userId
    );
    const userWishlist = user.wishlist || [];
    const products = await Promise.all(
      userWishlist.map(async (productId: string) => {
        return await getProductById(productId);
      })
    );
    return products.filter((product) => product !== null);
  } catch (error) {
    console.error("Error getting wishlist:", error);
    return [];
  }
};

export const getAllUsers = async () => {
  try {
    const { documents } = await databases.listDocuments(
      databaseId,
      usersCollectionId
    );
    return documents.map((user: any) => ({
      id: user.$id,
      email: user.email,
      ...user,
    }));
  } catch (error) {
    console.error("Error getting all users:", error);
    return null;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await databases.getDocument(
      databaseId,
      usersCollectionId,
      userId
    );
    return { id: user.$id, email: user.email, ...user };
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};

export const blockUser = async (userId: string) => {
  try {
    await databases.updateDocument(databaseId, usersCollectionId, userId, {
      isActive: false,
    });
    return true;
  } catch (error) {
    console.error("Error blocking user:", error);
    return false;
  }
};

export const unblockUser = async (userId: string) => {
  try {
    await databases.updateDocument(databaseId, usersCollectionId, userId, {
      isActive: true,
    });
    return true;
  } catch (error) {
    console.error("Error unblocking user:", error);
    return false;
  }
};

export const getAllAddresses = async () => {
  try {
    const { documents } = await databases.listDocuments(
      databaseId,
      usersCollectionId
    );
    return documents
      .map((user: any) =>
        (user.addresses || []).map((address: any) => ({
          userId: user.$id,
          ...address,
        }))
      )
      .flat();
  } catch (error) {
    console.error("Error getting all addresses:", error);
    return null;
  }
};

export const getAddressById = async (
  addressId: string
): Promise<any | null> => {
  try {
    const addresses = await databases.listDocuments(
      databaseId,
      usersCollectionId,
      [Query.search("addresses", addressId)]
    );
    if (addresses.documents.length > 0) {
      const address = addresses.documents[0].addresses.find(
        (address: any) => address.$id === addressId
      );
      return address;
    }
    return null;
  } catch (error) {
    console.error("Error getting address by ID:", error);
    return null;
  }
};
