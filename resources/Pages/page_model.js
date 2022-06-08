import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PageSchema = new Schema(
  {
    content: String,
    url: String,
    title: String,
  },
  { timestamps: true }
);

export const Page = model("Page", PageSchema);
