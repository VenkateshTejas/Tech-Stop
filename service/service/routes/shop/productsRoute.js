import express from "express";
import {
  getFilteredProducts,
  getProductDetails,
} from "../../controllers/shop/products-controller.js";

const router = express.Router();

router.route("/").get(getFilteredProducts);
router.route("/:id").get(getProductDetails);

export default router;
