import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AddressSchema = new Schema(
  {
    userId: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const Address = model("Address", AddressSchema);

export default Address;
