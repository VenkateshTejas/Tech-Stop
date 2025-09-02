import { Product } from "../../models/Product.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { BadRequest } from "../../errors/index.js";

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (tempFilePath) => {
  const result = await cloudinary.uploader.upload(tempFilePath, {
    use_filename: true,
    folder: "07-IMAGE-UPLOAD",
  });

  fs.unlinkSync(tempFilePath); // Clean up temporary file
  return result.secure_url;
};

// Add a new product
export const createProduct = async (productData) => {
  const product = new Product(productData);
  await product.save();
  return product;
};

// Fetch all products
export const getAllProducts = async () => {
  const products = await Product.find({});
  if (!products || products.length === 0) {
    throw new BadRequest("No existing products in the database");
  }
  return products;
};

// Fetch a single product by ID
export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new BadRequest("No product exists with such ID");
  }
  return product;
};

// Update a product
export const updateProductById = async (id, updatedData) => {
  const product = await Product.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new BadRequest("No product exists with such ID");
  }
  return product;
};

// Delete a product
export const deleteProductById = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new BadRequest("No product exists with such ID");
  }
  return product;
};
