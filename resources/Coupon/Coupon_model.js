import mongoose from "mongoose";

const { Schema, model } = mongoose;

const couponSchema = new Schema({
  name: {
    type: String,
    required: [true, "A coupon must have a name"],
    trim: true,
    unique: true,
  },
  couponCode: {
    type: String,
    required: [true, "A coupon must have a coupon code"],
    trim: true,
    unique: true,
  },
  offPercent: {
    type: Number,
    required: [true, "Coupon must have percentage off"],
  },
  amountOff: {
    type: Number,
  },
  shipping: {
    type: Boolean,
    default: false,
  },
  appliesTo: {
    type: String,
    enum: [
      "any order",
      "order over",
      "single",
      "product",
      "product by category",
    ],
  },
  limitUser: {
    type: String,
    enum: ["unlimited", "limited"],
  },
  customerLimit: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: [true, "Coupon must have a start date"],
  },
  endDate: {
    type: Date,
    default: Date.now,
  },
  expires: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

export const Coupon = model("Coupon", couponSchema);
