import { LayoutDashboard, ShoppingBasket, BadgeCheck } from "lucide-react";
import React from "react";

// Define a type for options in select controls
interface SelectOption {
  id: string;
  label: string;
}

// Define a type for form controls
interface FormControl {
  name: string;
  label: string;
  placeholder: string;
  componentType: "input" | "select" | "textarea";
  type?: string; // For "input" componentType
  options?: SelectOption[]; // For "select" componentType
}

// Define form controls for various forms
export const addProductFormElements: FormControl[] = [
  {
    name: "title",
    label: "Title",
    placeholder: "Enter product title",
    componentType: "input",
    type: "text",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Enter product description",
    componentType: "textarea",
  },
  {
    name: "category",
    label: "Category",
    placeholder: "",
    componentType: "select",
    options: [
      { id: "phones", label: "Phones" },
      { id: "laptops", label: "Laptops" },
      { id: "audibles", label: "Audibles" },
      { id: "tablets", label: "Tablets" },
      { id: "smartwatches", label: "Smart Watches" },
      { id: "accessories", label: "Accessories" },
    ],
  },
  {
    name: "brand",
    label: "Brand",
    placeholder: "",
    componentType: "select",
    options: [
      { id: "apple", label: "Apple" },
      { id: "samsung", label: "Samsung" },
      { id: "oneplus", label: "OnePlus" },
      { id: "xiomi", label: "Xiomi" },
      { id: "Intel", label: "Intel" },
      { id: "asus", label: "Asus" },
    ],
  },
  {
    name: "price",
    label: "Price",
    placeholder: "Enter product price",
    componentType: "input",
    type: "number",
  },
  {
    name: "salePrice",
    label: "Sale Price",
    placeholder: "Enter sale price (optional)",
    componentType: "input",
    type: "number",
  },
  {
    name: "totalStock",
    label: "Total Stock",
    placeholder: "Enter total stock",
    componentType: "input",
    type: "number",
  },
];

// Common forms
export const registerFormControls: FormControl[] = [
  {
    name: "name",
    label: "User Name",
    placeholder: "Enter your Name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your Email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your Password",
    componentType: "input",
    type: "password",
  },
];

export const verifyEmailControls: FormControl[] = [
  {
    name: "code",
    label: "Code",
    placeholder: "Enter your Verification Code",
    componentType: "input",
    type: "text",
  },
];

export const loginFormControls: FormControl[] = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const resetPasswordRequestControls: FormControl[] = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
];

export const resetPasswordControls: FormControl[] = [
  {
    name: "password",
    label: "Password",
    placeholder: "Enter new Password",
    componentType: "input",
    type: "password",
  },
];

// Admin Sidebar Menu
type AdminSidebarMenuItem = {
  id: string;
  name: string;
  path: string;
  icon: React.ElementType;
};

const icons: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  products: ShoppingBasket,
  orders: BadgeCheck,
};

export const adminSidebarMenuIcons: AdminSidebarMenuItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: icons.dashboard,
  },
  {
    id: "products",
    name: "Products",
    path: "/admin/products",
    icon: icons.products,
  },
  {
    id: "orders",
    name: "Orders",
    path: "/admin/orders",
    icon: icons.orders,
  },
];

// Menu Items for Shopping Header
// Define the type for menu items
export interface ShoppingViewHeaderMenuItem {
  id: string; // Unique identifier for the menu item
  label: string; // Display label for the menu item
  path: string; // Path for navigation
}

// Create the array with the defined type
export const shoppingViewHeaderMenuItems: ShoppingViewHeaderMenuItem[] = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "phones",
    label: "Phones",
    path: "/shop/listing",
  },
  {
    id: "laptops",
    label: "Laptops",
    path: "/shop/listing",
  },
  {
    id: "audibles",
    label: "Audibles",
    path: "/shop/listing",
  },
  {
    id: "tablets",
    label: "Tablets",
    path: "/shop/listing",
  },
  {
    id: "smart-watches",
    label: "Watches",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

/**
 * Maps category IDs to their display names.
 */
export const categoryOptionsMap: Record<string, string> = {
  phones: "Phones",
  laptops: "Laptops",
  tablets: "Tablets",
  audibles: "Audibles",
  accessories: "Accessories",
  smartwatches: "Watches",
};

/**
 * Maps brand IDs to their display names.
 */
export const brandOptionsMap: Record<string, string> = {
  apple: "Apple",
  samsung: "Samsung",
  oneplus: "Oneplus",
  xiomi: "Xiomi",
  asus: "Asus",
  Intel: "Intel",
};

/**
 * Defines a structure for individual filter options.
 */
export interface FilterOption {
  /** The unique identifier for the filter option. */
  id: string;
  /** The display label for the filter option. */
  label: string;
}

/**
 * Structure for all available filter options, organized by type (e.g., category, brand).
 */
export const filterOptions: Record<string, FilterOption[]> = {
  category: [
    { id: "phones", label: "Phones" },
    { id: "laptops", label: "Laptops" },
    { id: "audibles", label: "Audibles" },
    { id: "tablets", label: "Tablets" },
    { id: "smartwatches", label: "Smart Watches" },
    { id: "accessories", label: "Accessories" },
  ],
  brand: [
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "oneplus", label: "Oneplus" },
    { id: "xiomi", label: "Xiomi" },
    { id: "Intel", label: "Intel" },
    { id: "asus", label: "Asus" },
  ],
};

/**
 * Defines the structure of a single sorting option.
 */
export interface SortOption {
  /** Unique identifier for the sorting option. */
  id: string;
  /** Display label for the sorting option. */
  label: string;
}

/**
 * List of available sorting options for products.
 */
export const sortOptions: SortOption[] = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

// Address Form defination
// Define the array of form controls with the specific type
export const addressFormControls: FormControl[] = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];

export const orderStatusFormControls: FormControl[] = [
  {
    label: "Order Status",
    name: "status",
    componentType: "select",
    placeholder: "",
    options: [
      { id: "pending", label: "Pending" },
      { id: "inProcess", label: "In Process" },
      { id: "inShipping", label: "In Shipping" },
      { id: "delivered", label: "Delivered" },
      { id: "rejected", label: "Rejected" },
    ],
  },
];
