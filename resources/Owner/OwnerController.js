import { Owner } from './OwnerModel';

export const getOwner = (req, res) => {
	if (!req.user) return res.status(404).json({ message: 'User was not found' });
	res.status(200).json({ status: 'ok', user: req.user });
};

export const deleteOwner = async (req, res) => {
	if (!req.user) return res.status(400).json({ message: 'User not Found' });

	try {
		await Owner.findOneAndDelete({ _id: req.user._id }).exec();
		res.json({ status: 'ok', message: 'User Deleted Successfully' });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Error deleting User', error: e.message });
	}
};

export const deleteSpecificOwner = async (req, res) => {
	if (!req.user) return res.status(400).json({ message: 'User not Found' });

	try {
		const owner = await Owner.findOneAndDelete({ _id: req.params.id }).exec();
		if (!owner)
			return res.status(404).json('Did not find any owner by given id');

		res.json({ status: 'ok', message: 'User Deleted Successfully' });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Error deleting User', error: e.message });
	}
};

export const searchOwners = async (req, res) => {
	try {
		const filter = {};

		/**
		 * @constant
		 * @type {string}
		 * @default
		 */
		const query = req.query.q;

		if (!query) return res.status(400).json('Search Query is missing');

		/**
		 * @constant
		 * @type {string[]}
		 * @default
		 */
		const formattedQuery = query
			.split(/ +/g)
			.map(phrase => phrase.replace(/\W/g));

		if (formattedQuery.length > 1)
			formattedQuery.unshift(formattedQuery.join(' '));

		filter.cafeName = new RegExp(formattedQuery.join('|'), 'i');

		const users = await Owner.find(filter);

		res.status(200).json(users);
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.json({ message: 'Error accessing users', error: e.message });
	}
};

export const getOwners = async (req, res) => {
	try {
		let { limit = 10 } = req.params;
		if (!limit.match(/^\d+$/g))
			return res.status(400).json({ message: 'Limit must be numeric ' });
		limit = Number(limit);

		const users = await Owner.find({}, {}, { limit });

		res.status(200).json({ status: 'OK', users });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.json({ message: 'Error accessing users', error: e.message });
	}
};

export const getSpecificOwner = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await Owner.findById(id);

		res.status(200).json({ status: 'OK', user });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.json({ message: 'Error accessing users', error: e.message });
	}
};
