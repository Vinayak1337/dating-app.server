import { Ecommerce } from './ecomerce_model';

const getProducts = async (req, res) => {
	// eslint-disable-next-line prefer-const
	let { page = 1, limit = 10, status } = req.query;

	if (!(page || limit))
		return res.status(400).json({ message: 'Page & limit are required.' });

	page = page * 1;
	limit = limit * 1;
	const limitVal = limit;
	const skipeValue = (page - 1) * limitVal;

	const query = {};
	if (status === 'true') query.status = true;

	try {
		const totalProducts = await Ecommerce.countDocuments(query);
		const products = await Ecommerce.find({})
			.limit(limitVal)
			.skip(skipeValue)
			.populate('tax');
		res.json({
			totalProducts,
			products
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

const getProductById = async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) return res.status(400).json({ message: 'Product id is required' });

		const product = await Ecommerce.findById(id).populate('tax');
		if (product) return res.status(200).json(product);

		res.status(404).json({ message: 'Product not found by given id' });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

const getAllProduct = async (req, res) => {
	try {
		const products = await Ecommerce.find({ status: true }).populate('tax');
		if (products.length) return res.status(200).json(products);

		res.status(404).json('No products found.');
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
const addProduct = async (req, res) => {
	try {
		if (!req.user) return res.status(400).json({ message: 'User Not Found' });
		const fields = ['title', 'description', 'price', 'tax'];
		const requiredFields = [];
		for (const field of fields)
			if (!(field in req.body)) requiredFields.push(field);

		if (requiredFields.length)
			return res
				.status(400)
				.json({ message: 'Required fields are missing', requiredFields });

		const product = await Ecommerce.create({
			...req.body,
			userId: req.user._id
		});
		res.status(200).json(product);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

const updateProduct = async (req, res) => {
	try {
		if (!req.user) return res.status(400).json({ message: 'User Not Found' });

		const id = req.params.id;
		if (!id) return res.status(400).json({ message: 'id is required' });

		const product = await Ecommerce.findByIdAndUpdate(
			id,
			{ ...req.body },
			{
				new: true
			}
		).populate('tax');
		res.json(product);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) return res.status(400).json({ message: 'id is required' });

		const product = await Ecommerce.findByIdAndDelete(id);
		if (product) return res.json({ message: 'Product Deleted Successfully' });

		res.status(404).json({ message: 'Did not find product by given id' });
	} catch (e) {
		console.log(e);
		res.json({ message: e.message });
	}
};

const getLatest = async (req, res) => {
	try {
		const latest = await Ecommerce.find()
			.sort({ _id: -1 })
			.limit(8)
			.populate('tax');
		if (latest.length) return res.status(200).json(latest);

		res.status(404).json({ message: 'No products found' });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: error.message
		});
	}
};
const setStatus = async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) return res.status(400).json({ message: 'id is required' });

		const product = await Ecommerce.findByIdAndUpdate(req.params.id, {
			status: false
		}).populate('tax');
		if (product)
			return res
				.status(404)
				.json({ message: 'Did not find product by given id' });

		res.status(200).json(product);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: error.message
		});
	}
};

export {
	getProducts,
	getProductById,
	getAllProduct,
	addProduct,
	updateProduct,
	deleteProduct,
	getLatest,
	setStatus
};
