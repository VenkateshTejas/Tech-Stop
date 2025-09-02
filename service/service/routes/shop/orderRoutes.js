import express from "express";
import {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
} from "../../controllers/shop/order-controller.js";

const router = express.Router();

// Route for creating an order
router.route("/create").post(createOrder);

// Route for capturing a payment
router.route("/capture").post(capturePayment);

// Route for getting all orders by a user
router.route("/list/:userId").get(getAllOrdersByUser);

// Route for getting order details
router.route("/details/:id").get(getOrderDetails);

export default router;
