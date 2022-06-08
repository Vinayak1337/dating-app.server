import mongoose from "mongoose";
const { Schema, model } = mongoose;

const LanguageSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
});

export const Language = model("languages", LanguageSchema);
