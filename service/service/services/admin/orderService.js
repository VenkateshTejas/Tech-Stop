import Order from "../../models/Order.js";
import BadRequest from "../../errors/bad-request.js";

export const fetchAllOrders = async () => {
  const orders = await Order.find({});
  if (!orders.length) {
    throw new BadRequest("No orders found!");
  }
  return orders;
};

export const fetchOrderById = async (id) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new BadRequest("Order not found!");
  }
  return order;
};

export const updateOrder = async (id, orderStatus) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new BadRequest("Order not found!");
  }
  await Order.findByIdAndUpdate(id, { orderStatus });
  return { message: "Order status updated successfully!" };
};
