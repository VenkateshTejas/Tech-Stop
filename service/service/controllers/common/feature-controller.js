/**
 * Controller for managing feature images.
 * Handles HTTP requests related to adding and fetching feature images using service-layer logic.
 */

import BadRequest from "../../errors/bad-request.js";
import {
  addFeatureImageService,
  getFeatureImagesService,
} from "../../services/common/feature-service.js";

/**
 * Add a feature image to the database.
 *
 * @async
 * @function addFeatureImage
 * @param {Object} req - Express request object
 * @param {Object} req.body - The request body containing the image data
 * @param {string} req.body.image - URL or base64 representation of the image
 * @param {Object} res - Express response object
 * @returns {Object} Response object with success status and newly added feature image data
 */
export const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    // Throw 404 error when admin tries to add null image file
    if (!image) {
      throw new BadRequest("Please upload an image to add a featured image");
    }

    // console.log(image, "image"); // Debug log to verify image data

    // Call service to add the image
    const featureImages = await addFeatureImageService(image);

    res.status(201).json({
      success: true,
      data: featureImages,
    });
  } catch (e) {
    console.error(e); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

/**
 * Get all feature images from the database.
 *
 * @async
 * @function getFeatureImages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object with success status and array of feature image data
 */
export const getFeatureImages = async (req, res) => {
  try {
    // Call service to fetch all feature images
    const images = await getFeatureImagesService();

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.error(e); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};
