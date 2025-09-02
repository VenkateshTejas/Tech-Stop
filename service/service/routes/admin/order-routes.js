import express from "express";
import {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "../../controllers/admin/orders-controller.js";

const router = express.Router();

router.route("/").get(getAllOrdersOfAllUsers);
router.route("/details/:id").get(getOrderDetailsForAdmin);
router.route("/update/:id").put(updateOrderStatus);

export default router;
