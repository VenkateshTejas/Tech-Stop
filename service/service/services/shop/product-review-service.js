import Order from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import ProductReview from "../../models/Review.js";

// Service function to add a product review
const addProductReviewService = async ({
  productId,
  userId,
  userName,
  reviewMessage,
  reviewValue,
}) => {
  // Check if the user has purchased the product
  const order = await Order.findOne({
    userId,
    "cartItems.productId": productId,
  });

  if (!order) {
    throw new Error("You need to purchase the product to review it.");
  }

  // Check if the user has already reviewed this product
  const existingReview = await ProductReview.findOne({
    productId,
    userId,
  });

  if (existingReview) {
    throw new Error("You already reviewed this product!");
  }

  // Create a new review
  const newReview = new ProductReview({
    productId,
    userId,
    userName,
    reviewMessage,
    reviewValue,
  });

  await newReview.save();

  // Update the product's average review score
  const reviews = await ProductReview.find({ productId });
  const totalReviewsLength = reviews.length;
  const averageReview =
    reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
    totalReviewsLength;

  await Product.findByIdAndUpdate(productId, { averageReview });

  return newReview;
};

// Service function to get product reviews
const getProductReviewsService = async (productId) => {
  const reviews = await ProductReview.find({ productId });
  return reviews;
};

export { addProductReviewService, getProductReviewsService };
