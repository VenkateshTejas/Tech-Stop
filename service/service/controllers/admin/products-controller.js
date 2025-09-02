import {
  uploadImageToCloudinary,
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../../services/admin/productService.js";
import { StatusCodes as STATUS_CODES } from "http-status-codes";

// Upload image to Cloudinary
export const uploadProductImageToCloudinary = async (req, res, next) => {
  try {
    const { tempFilePath } = req.files.file;
    const imageUrl = await uploadImageToCloudinary(tempFilePath);

    res.status(STATUS_CODES.OK).json({ image: { src: imageUrl } });
  } catch (error) {
    next(error);
  }
};

// Add a new product
export const addProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    const product = await createProduct(productData);

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch all products
export const fetchAllProducts = async (req, res, next) => {
  try {
    const products = await getAllProducts();

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch a single product
export const fetchSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Edit a product
export const editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const product = await updateProductById(id, updatedData);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Product details updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a product
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteProductById(id);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
