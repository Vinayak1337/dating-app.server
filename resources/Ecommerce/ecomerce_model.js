import mongoose from 'mongoose';

const { Schema, model, SchemaTypes } = mongoose;

const EcommerceSchema = new Schema(
	{
		title: String,
		description: String,
		price: Number,
		status: { type: Boolean, default: true },
		tax: { type: SchemaTypes.ObjectId, ref: 'Tax' },
		userId: { type: SchemaTypes.ObjectId, ref: 'users' }
	},
	{ timestamps: true }
);

export const Ecommerce = model('Ecommerce', EcommerceSchema);
