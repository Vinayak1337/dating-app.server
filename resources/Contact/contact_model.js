import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ContactSchema = new Schema(
  {
    name: String,
    email: String,
    status: {
      type: Boolean,
      default: false,
    },
    phoneNo: Number,
    message: String,
  },
  { timestamps: true }
);

export const Contact = model("Contact", ContactSchema);
