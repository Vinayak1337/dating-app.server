import mongoose from "mongoose";
const wishListSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    WishListItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ecommerce",
          required: true,
        },
        quantity: { type: Number, default: 1 },

        //price: { type: Number, required: true }
      },
    ],
  },
  { timestamps: true }
);

export const WishList = mongoose.model("WishList", wishListSchema);
