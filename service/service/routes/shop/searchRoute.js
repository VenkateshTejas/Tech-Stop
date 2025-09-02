import express from "express";
import { searchProducts } from "../../controllers/shop/search-controller.js";

const router = express.Router();

// Route the keyword entered from frontend to this route
router.route("/:keyword").get(searchProducts);

export default router;
