import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const EmalTemplateSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Title of the template is required.']
		},
		subject: {
			type: String,
			required: [true, 'Subject of the template is required.']
		},
		content: {
			type: String,
			required: [true, 'Content of the template is required.']
		},
		status: {
			type: Boolean,
			default: true
		},
		reference: {
			type: Object,
			default: {
				firstName: 'First Name',
				lastName: 'Last Name',
				applicationName: 'Name of the Channel'
			}
		}
	},
	{ timestamps: true }
);

export const EmailTemplate = model('EmailTemplate', EmalTemplateSchema);
