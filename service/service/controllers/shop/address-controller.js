import {
  createAddress,
  getAllAddresses,
  updateAddress,
  deleteAddressById,
} from "../../services/shop/address-service.js";

/**
 * Add a new address for a user.
 * @route POST /api/addresses
 */
export const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;

    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const newAddress = await createAddress({
      userId,
      address,
      city,
      pincode,
      notes,
      phone,
    });

    return res.status(201).json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error adding address",
    });
  }
};

/**
 * Fetch all addresses for a user.
 * @route GET /api/addresses/:userId
 */
export const fetchAllAddress = async (req, res) => {
  console.log("inside fetch all addresses");

  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required!",
      });
    }

    const addresses = await getAllAddresses(userId);
    console.log(addresses);

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching addresses",
    });
  }
};

/**
 * Edit an existing address for a user.
 * @route PUT /api/addresses/:userId/:addressId
 */
export const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required!",
      });
    }

    const updatedAddress = await updateAddress(userId, addressId, formData);

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error editing address",
    });
  }
};

/**
 * Delete an address for a user.
 * @route DELETE /api/addresses/:userId/:addressId
 */
export const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required!",
      });
    }

    const deletedAddress = await deleteAddressById(userId, addressId);

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting address",
    });
  }
};
