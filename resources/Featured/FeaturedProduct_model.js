import mongoose from "mongoose";

const { Schema, model } = mongoose;

const FeaturedSchema = new Schema(
  {
    name: String,
    status: {
      type: Boolean,
      default: true,
    },
    image: String,
  },
  { timestamps: true }
);

export const Featured = model("Featured", FeaturedSchema);
