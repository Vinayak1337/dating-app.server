import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CategorySchema = new Schema(
  {
    category: {
      type: String,
      trim: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
    },
    parentId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Category = model("Category", CategorySchema);
