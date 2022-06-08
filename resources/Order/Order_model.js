import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    state: String,
    firstName: String,
    lastName: String,
    company: String,
    address: String,
    appartment: String,
    city: String,
    country: String,
    pinCode: String,
    phone: String,
    email: String,
    orderNote: String,
    product: {
      type: Array,
      default: [],
    },
    Amount: Number,
    totalQuantity: String,

    payment: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "new", //processing dispatched delivered cancelled returned
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
