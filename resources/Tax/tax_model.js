import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TaxSchema = new Schema(
  {
    name: String,
    tax: Number,
  },
  { timestamps: true }
);

export const Tax = model("Tax", TaxSchema);
