import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ShippingSchema = new Schema(
  {
    name: String,
    description: String,
    rate: Number,
    country: String,
    state: String,
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Shipping = model("Shipping", ShippingSchema);
