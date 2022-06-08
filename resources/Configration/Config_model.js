import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const configSchema = new Schema({
	gst: {
		type: Number
	},
	socialMedia: {
		type: Array,
		default: []
	},
	address: {
		type: Array,
		default: []
	},
	logo: {
		type: Array,
		default: []
	}
});

export const Config = model('Config', configSchema);
