import paypal from "../../helpers/paypal.js";
import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import { Product } from "../../models/Product.js";

export const createPaypalPayment = async (cartItems, totalAmount) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:5173/shop/paypal-return",
      cancel_url: "http://localhost:5173/shop/paypal-cancel",
    },
    transactions: [
      {
        item_list: {
          items: cartItems.map((item) => ({
            name: item.title,
            sku: item.productId,
            price: item.price.toFixed(2),
            currency: "USD",
            quantity: item.quantity,
          })),
        },
        amount: {
          currency: "USD",
          total: totalAmount.toFixed(2),
        },
        description: "description",
      },
    ],
  };

  return new Promise((resolve, reject) => {
    paypal.payment.create(create_payment_json, (error, paymentInfo) => {
      if (error) {
        reject(error);
      } else {
        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;
        resolve({ approvalURL, paymentInfo });
      }
    });
  });
};

export const saveOrder = async (orderData) => {
  const order = new Order(orderData);
  await order.save();
  return order;
};

export const capturePaymentAndUpdateOrder = async (
  paymentId,
  payerId,
  orderId
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  order.paymentId = paymentId;
  order.payerId = payerId;

  for (const item of order.cartItems) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Not enough stock for product: ${item.title}`);
    }

    product.totalStock -= item.quantity;
    await product.save();
  }

  await Cart.findByIdAndDelete(order.cartId);
  await order.save();

  return order;
};

export const getOrdersByUserId = async (userId) => {
  const orders = await Order.find({ userId });
  return orders;
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id);
  return order;
};
