import Cart from "../../models/Cart.js";
import { Product } from "../../models/Product.js";

/**
 * Add an item to the cart.
 */
export const addToCartService = async (userId, productId, quantity) => {
  // Validation
  if (!userId || !productId || quantity <= 0) {
    throw new Error("Invalid data provided!");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const findCurrentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    cart.items.push({ productId, quantity });
  } else {
    cart.items[findCurrentProductIndex].quantity += quantity;
  }

  await cart.save();
  return cart;
};

/**
 * Fetch all items in the cart for a given user.
 */
export const fetchCartItemsService = async (userId) => {
  if (!userId) {
    throw new Error("User id is mandatory!");
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  if (!cart) {
    throw new Error("Cart not found!");
  }

  const validItems = cart.items.filter((productItem) => productItem.productId);

  if (validItems.length < cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  const items = validItems.map((item) => ({
    productId: item.productId._id,
    image: item.productId.image,
    title: item.productId.title,
    price: item.productId.price,
    salePrice: item.productId.salePrice,
    quantity: item.quantity,
  }));

  return { items, cart };
};

/**
 * Update the quantity of an item in the cart.
 */
export const updateCartItemQtyService = async (userId, productId, quantity) => {
  if (!userId || !productId || quantity <= 0) {
    throw new Error("Invalid data provided!");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("Cart not found!");
  }

  const findCurrentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    throw new Error("Cart item not present!");
  }

  cart.items[findCurrentProductIndex].quantity = quantity;
  await cart.save();

  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  return cart.items.map((item) => ({
    productId: item.productId ? item.productId._id : null,
    image: item.productId ? item.productId.image : null,
    title: item.productId ? item.productId.title : "Product not found",
    price: item.productId ? item.productId.price : null,
    salePrice: item.productId ? item.productId.salePrice : null,
    quantity: item.quantity,
  }));
};

/**
 * Delete an item from the cart.
 */
export const deleteCartItemService = async (userId, productId) => {
  if (!userId || !productId) {
    throw new Error("Invalid data provided!");
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  if (!cart) {
    throw new Error("Cart not found!");
  }

  cart.items = cart.items.filter(
    (item) => item.productId._id.toString() !== productId
  );

  await cart.save();

  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  return cart.items.map((item) => ({
    productId: item.productId ? item.productId._id : null,
    image: item.productId ? item.productId.image : null,
    title: item.productId ? item.productId.title : "Product not found",
    price: item.productId ? item.productId.price : null,
    salePrice: item.productId ? item.productId.salePrice : null,
    quantity: item.quantity,
  }));
};
