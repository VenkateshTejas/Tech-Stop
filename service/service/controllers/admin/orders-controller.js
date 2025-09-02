import {
  fetchAllOrders,
  fetchOrderById,
  updateOrder,
} from "../../services/admin/orderService.js";
import { BadRequest } from "../../errors/index.js";

// Controller to get all orders of all users
export const getAllOrdersOfAllUsers = async (req, res) => {
  const orders = await fetchAllOrders();

  res.status(200).json({
    success: true,
    message: "Orders retrieved successfully",
    data: orders,
  });
};

// Controller to get order details by ID (for admin)
export const getOrderDetailsForAdmin = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequest("Order ID is required.");
  }

  const order = await fetchOrderById(id);

  res.status(200).json({
    success: true,
    message: "Order details retrieved successfully",
    data: order,
  });
};

// Controller to update the status of an order
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (!id || !orderStatus) {
    throw new BadRequest("Order ID and order status are required.");
  }

  const response = await updateOrder(id, orderStatus);

  res.status(200).json({
    success: true,
    message: response.message,
  });
};
