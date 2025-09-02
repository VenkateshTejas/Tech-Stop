// services/product-service.js
import { Product } from "../../models/Product.js";

/**
 * Get filtered products based on category, brand, and sorting options.
 * @param {Object} filters - Query filters (category, brand).
 * @param {Object} sort - Sorting options.
 * @returns {Promise<Array>} - List of filtered products.
 */
export const getFilteredProductsService = async (filters, sort) => {
  return await Product.find(filters).sort(sort);
};

/**
 * Get product details by ID.
 * @param {string} id - Product ID.
 * @returns {Promise<Object>} - Product details.
 */
export const getProductDetailsService = async (id) => {
  return await Product.findById(id);
};
