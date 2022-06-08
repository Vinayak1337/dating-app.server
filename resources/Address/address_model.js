import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addresses: [
      {
        name: String,
        phoneNo: Number,
        pin: Number,
        city: String,
        state: String,
        country: String,
        address: String,
        default: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Address = mongoose.model("Address", addressSchema);
