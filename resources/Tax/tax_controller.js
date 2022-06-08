import axios from 'axios';
import { Tax } from './tax_model';
export const addTax = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const tax = new Tax({
		name: req.body.name,
		tax: req.body.tax
	});
	try {
		const data = await tax.save();
		res.status(201).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ message: error.message, message: 'failed' });
	}
};
export const updateTax = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	const queryObj = req.body;

	try {
		const data = await Tax.findByIdAndUpdate(id, queryObj, {
			new: true
		});
		res.status(200).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ message: error.message, message: 'failed' });
	}
};
export const deleteTax = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	try {
		const data = await Tax.findByIdAndDelete(id);
		res.status(200).json({ message: 'Success' });
	} catch (error) {
		res.status(500).json({ message: error.message, message: 'failed' });
	}
};
export const getTaxes = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	try {
		const data = await Tax.find().sort({ createdAt: -1 });
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ message: error.message, message: 'failed' });
	}
};

export const getTax = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	try {
		let { id } = req.params;
		const tax = await Tax.findById({ _id: id });
		if (tax) {
			return res.status(200).json({
				status: 'success',
				tax
			});
		}
	} catch (error) {
		return res.status(404).json({
			status: 'failed',
			error
		});
	}
};
