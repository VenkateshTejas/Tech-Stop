import express from "express";
import {
  addProductReview,
  getProductReviews,
} from "../../controllers/shop/product-review-controller.js";

const router = express.Router();

router.route("/add").post(addProductReview);

router.route("/:productId").get(getProductReviews);

export default router;
