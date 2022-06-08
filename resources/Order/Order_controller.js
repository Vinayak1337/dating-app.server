import { Order } from './Order_model';

const makeOrder = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({
			status: 'Failed',
			message: 'You Must Be Logged In'
		});
	}

	const createOrder = await Order.create({
		user: req.user._id,
		...req.body
	});

	if (createOrder) {
		return res.status(201).json({
			status: 'success',
			message: 'order details received',
			orderId: createOrder._id
		});
	}
};

const getuserOrders = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({
			status: 'Failed',
			message: 'You Must Be Logged In'
		});
	}

	const userOrder = await Order.find({ user: req.user._id, payment: true });
	return res.status(200).json({
		status: 'Success',
		userOrder
	});
};
const getUserOrderAdmin = async (req, res) => {
	try {
		const order = await Order.find({ user: req.params.id });
		return res.status(200).json({
			status: 'Success',
			data: order
		});
	} catch (error) {
		return res.status(500).json({ status: 'Failed', message: error.message });
	}
};

const getAllOrders = async (req, res) => {
	let { page, limit } = req.query;
	page = page * 1;
	limit = limit * 1;
	let limitVal = limit;
	let skipeValue = (page - 1) * limitVal;
	try {
		const totalRecords = await Order.countDocuments({ status: 'new' });
		const orders = await Order.find({ payment: true, status: 'new' })
			.populate('User')
			.sort({ createdAt: -1 })
			.limit(limitVal)
			.skip(skipeValue);
		if (orders) {
			return res.status(200).json({
				status: 'success',
				totalRecords: totalRecords,
				orders
			});
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
const getAllProcessingOrders = async (req, res) => {
	let { page, limit } = req.query;
	page = page * 1;
	limit = limit * 1;
	let limitVal = limit;
	let skipeValue = (page - 1) * limitVal;
	try {
		const totalRecords = await Order.countDocuments({ status: 'Processing' });
		const orders = await Order.find({ payment: true, status: 'Processing' })
			.sort({ createdAt: -1 })
			.limit(limitVal)
			.skip(skipeValue);
		if (orders) {
			return res.status(200).json({
				status: 'success',
				totalRecords: totalRecords,
				orders
			});
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
const getAllDispatchedOrders = async (req, res) => {
	let { page, limit } = req.query;
	page = page * 1;
	limit = limit * 1;
	let limitVal = limit;
	let skipeValue = (page - 1) * limitVal;
	try {
		const totalRecords = await Order.countDocuments({ status: 'Dispatched' });
		const orders = await Order.find({ payment: true, status: 'Dispatched' })
			.sort({ createdAt: -1 })
			.limit(limitVal)
			.skip(skipeValue);
		if (orders) {
			return res.status(200).json({
				status: 'success',
				totalRecords: totalRecords,
				orders
			});
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
const getAllDeliveredOrders = async (req, res) => {
	let { page, limit } = req.query;
	page = page * 1;
	limit = limit * 1;
	let limitVal = limit;
	let skipeValue = (page - 1) * limitVal;
	try {
		const totalRecords = await Order.countDocuments({ status: 'Delivered' });
		const orders = await Order.find({ payment: true, status: 'Delivered' })
			.sort({ createdAt: -1 })
			.limit(limitVal)
			.skip(skipeValue);
		if (orders) {
			return res.status(200).json({
				status: 'success',
				totalRecords: totalRecords,
				orders
			});
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
const getAllCancelledOrders = async (req, res) => {
	let { page, limit } = req.query;
	page = page * 1;
	limit = limit * 1;
	let limitVal = limit;
	let skipeValue = (page - 1) * limitVal;
	try {
		const totalRecords = await Order.countDocuments({ status: 'Cancelled' });
		const orders = await Order.find({ payment: true, status: 'Cancelled' })
			.sort({ createdAt: -1 })
			.limit(limitVal)
			.skip(skipeValue);
		if (orders) {
			return res.status(200).json({
				status: 'success',
				totalRecords: totalRecords,
				orders
			});
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
const getAllReturnedOrders = async (req, res) => {
	let { page, limit } = req.query;
	page = page * 1;
	limit = limit * 1;
	let limitVal = limit;
	let skipeValue = (page - 1) * limitVal;
	try {
		const totalRecords = await Order.countDocuments({ status: 'Returned' });
		const orders = await Order.find({ payment: true, status: 'Returned' })
			.sort({ createdAt: -1 })
			.limit(limitVal)
			.skip(skipeValue);
		if (orders) {
			return res.status(200).json({
				status: 'success',
				totalRecords: totalRecords,
				orders
			});
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
const updateOrderStatus = async (req, res) => {
	const { id } = req.body;
	const status = req.body.status;
	try {
		const updateStatus = await Order.findOneAndUpdate(
			{ _id: id },
			{ $set: { status: status } }
		);
		return res.status(200).json({
			status: 'success'
		});
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};

const updateOrder = async (req, res) => {
	const { id } = req.params;

	const updatedOrder = await Order.findOneAndUpdate(
		{ _id: id },
		{
			$set: {
				payment: true
			}
		},
		{
			new: true
		}
	);
	if (updateOrder) {
		res.status(200).json({
			status: 'success',
			message: 'Accepted Payment'
		});
	}
	res.json(updatedOrder);
};

const getOrderById = async (req, res) => {
	const { id } = req.params;
	const order = await Order.findById({ _id: id });
	if (order) {
		return res.status(200).json({
			status: 'success',
			order
		});
	} else {
		return res.status(404).json({
			status: 'failed',
			message: 'No Product Found!'
		});
	}
};
const deleteOrderAll = async (req, res) => {
	await Order.deleteMany();
};

export {
	makeOrder,
	getuserOrders,
	getAllOrders,
	updateOrder,
	updateOrderStatus,
	deleteOrderAll,
	getOrderById,
	getAllCancelledOrders,
	getAllDeliveredOrders,
	getAllDispatchedOrders,
	getAllProcessingOrders,
	getAllReturnedOrders,
	getUserOrderAdmin
};
