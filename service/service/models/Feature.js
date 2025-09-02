import mongoose from "mongoose";

const FeatureSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Feature = mongoose.model("Feature", FeatureSchema);

export default Feature;
