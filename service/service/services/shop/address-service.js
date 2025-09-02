import Address from "../../models/Address.js";

/**
 * Add a new address.
 * @param {Object} addressData - Contains user ID and address details.
 * @returns {Object} - Created address object.
 */
export const createAddress = async (addressData) => {
  const newAddress = new Address(addressData);
  return await newAddress.save();
};

/**
 * Fetch all addresses for a user.
 * @param {String} userId - User ID to fetch addresses for.
 * @returns {Array} - List of addresses.
 */
export const getAllAddresses = async (userId) => {
  return await Address.find({ userId });
};

/**
 * Update an existing address.
 * @param {String} userId - User ID.
 * @param {String} addressId - Address ID.
 * @param {Object} updateData - Data to update the address with.
 * @returns {Object|null} - Updated address or null if not found.
 */
export const updateAddress = async (userId, addressId, updateData) => {
  return await Address.findOneAndUpdate(
    { _id: addressId, userId },
    updateData,
    { new: true }
  );
};

/**
 * Delete an address.
 * @param {String} userId - User ID.
 * @param {String} addressId - Address ID.
 * @returns {Object|null} - Deleted address or null if not found.
 */
export const deleteAddressById = async (userId, addressId) => {
  return await Address.findOneAndDelete({ _id: addressId, userId });
};
