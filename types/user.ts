export interface UserAddress {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date | string;
}

export interface UserReview {
  id: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  createdAt: Date | string;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  items: any[];
  createdAt: Date | string;
}

export interface UserData {
  // Basic profile
  name: string;
  email: string;
  phone?: string;
  avatar?: string;

  // Status
  isActive: boolean;
  role: "customer" | "admin";

  // Collections
  wishlist: string[]; // Array of product IDs
  addresses: UserAddress[];
  reviews: UserReview[];
  orders: string[]; // Array of order IDs

  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserCreationData {
  userId: string;
  name: string;
  email: string;
  isActive: boolean;
  role: "customer" | "admin";
}
