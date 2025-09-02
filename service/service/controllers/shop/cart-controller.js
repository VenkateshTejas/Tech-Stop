import {
  addToCartService,
  fetchCartItemsService,
  updateCartItemQtyService,
  deleteCartItemService,
} from "../../services/shop/cart-service.js";

/**
 * Add an item to the cart.
 */
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await addToCartService(userId, productId, quantity);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error",
    });
  }
};

/**
 * Fetch all items in the cart for a given user.
 */
const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const { items, cart } = await fetchCartItemsService(userId);

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: items,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error",
    });
  }
};

/**
 * Update the quantity of an item in the cart.
 */
const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const items = await updateCartItemQtyService(userId, productId, quantity);

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error",
    });
  }
};

/**
 * Delete an item from the cart.
 */
const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const items = await deleteCartItemService(userId, productId);

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error",
    });
  }
};

export { addToCart, updateCartItemQty, deleteCartItem, fetchCartItems };
