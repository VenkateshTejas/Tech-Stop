import { Product } from "../../models/Product.js";

const searchProductsService = async (keyword) => {
  const regEx = new RegExp(keyword, "i");

  const createSearchQuery = {
    $or: [
      { title: regEx },
      { description: regEx },
      { category: regEx },
      { brand: regEx },
    ],
  };

  const searchResults = await Product.find(createSearchQuery);
  return searchResults;
};

export { searchProductsService };
