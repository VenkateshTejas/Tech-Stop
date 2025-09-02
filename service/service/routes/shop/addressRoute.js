import express from "express";
import {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} from "../../controllers/shop/address-controller.js";

const router = express.Router();

// Route for adding an address
router.route("/").post(addAddress);

// Route for fetching all addresses for a user
router.route("/:userId").get(fetchAllAddress);

// Route for updating and deleting an address for a user
router
  .route("/:userId/:addressId")
  .put(editAddress) // Update an address
  .delete(deleteAddress); // Delete an address

export default router;
