import express from "express";
import {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
} from "../../controllers/shop/cart-controller.js";

const router = express.Router();

// Route to add an item to the cart
router.route("/").post(addToCart);

// Route to fetch all cart items for a given user
router.route("/:userId").get(fetchCartItems);

// Route to update the quantity of an item in the cart
router.route("/").put(updateCartItemQty);

// Route to delete a specific item from the cart
router.route("/:userId/:productId").delete(deleteCartItem);

export default router;
