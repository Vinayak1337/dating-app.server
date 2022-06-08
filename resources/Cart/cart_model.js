import mongoose from "mongoose";
const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ecommerce",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        payment: {
          type: Boolean,
          default: false,
        },
        //price: { type: Number, required: true }
      },
    ],
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
