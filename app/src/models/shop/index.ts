// Define the Product type to match your Product model
export interface Product {
  _id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  salePrice: number;
  totalStock: number;
  averageReview: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  address: string;
  city: string;
  phone: string;
  pincode: string;
  notes: string;
}

// Define types for the cartSlice
export interface CartItem {
  productId: string;
  image: string;
  title: string;
  price: number;
  salePrice: number;
  quantity: number;
}

export interface CartItems {
  items: CartItem[]; // Array of cart items,
  userID: string;
  _id: string;
}

export interface AddressInfo {
  _id: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes: string;
}

export interface FeatureImage {
  image: string;
}
