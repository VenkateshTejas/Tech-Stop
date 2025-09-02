import {
  addProductReviewService,
  getProductReviewsService,
} from "../../services/shop/product-review-service.js";

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    const newReview = await addProductReviewService({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: e.message || "Error occurred while adding review.",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await getProductReviewsService(productId);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: e.message || "Error occurred while fetching reviews.",
    });
  }
};

export { addProductReview, getProductReviews };
