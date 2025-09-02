import Feature from "../../models/Feature.js";

/**
 * Service to add a feature image.
 * @param {string} image - The URL or path of the image to add.
 * @returns {Object} - The saved feature image document.
 */
export const addFeatureImageService = async (image) => {
  const featureImages = new Feature({ image });
  return await featureImages.save();
};

/**
 * Service to fetch all feature images.
 * @returns {Array} - An array of feature image documents.
 */
export const getFeatureImagesService = async () => {
  return await Feature.find({});
};
