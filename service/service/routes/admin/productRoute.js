import express from "express";

import {
  uploadProductImageToCloudinary,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
  fetchSingleProduct,
} from "../../controllers/admin/products-controller.js";

const router = express.Router();

router.route("/upload-image").post(uploadProductImageToCloudinary);
router.route("/").get(fetchAllProducts).post(addProduct);
router
  .route("/:id")
  .get(fetchSingleProduct)
  .patch(editProduct)
  .delete(deleteProduct);

export default router;
