import { Page } from './page_model';
export const addPage = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const page = new Page({
		title: req.body.title,
		content: req.body.content,
		url: req.body.url
	});
	try {
		const data = await page.save();
		res.status(201).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const updatePage = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	const queryObj = req.body;

	try {
		const data = await Page.findByIdAndUpdate(id, queryObj, {
			new: true
		});
		res.status(200).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const deletePage = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	try {
		await Page.findByIdAndDelete(id);
		res.status(200).json({ message: 'Success' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const getPages = async (req, res) => {
	try {
		const data = await Page.find().sort({ createdAt: -1 });
		res.status(200).json({ message: 'Success', Page: data });
	} catch (error) {
		res.status(500).json({ message: error.response.data.message });
	}
};

export const getPage = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await Page.find({ _id: id }).sort({ createdAt: -1 });
		res.status(200).json({ message: 'Success', Page: data[0] });
	} catch (error) {
		res.status(500).json({ message: error.response.data.message });
	}
};
export const getPageByUrl = async (req, res) => {
	try {
		const data = await Page.findOne({ url: req.body.url });
		res.status(200).json({ message: 'Success', Page: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
