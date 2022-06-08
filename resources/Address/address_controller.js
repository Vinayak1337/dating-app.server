import { Address } from './address_model';
export const addAddress = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	const user = await Address.findOne({ user: req.user._id }).exec();
	if (user) {
		try {
			const address = await Address.findOneAndUpdate(
				{ user: req.user._id },
				{
					$push: {
						addresses: req.body,
					},
				},
				{ new: true },
			);
			return res.status(201).json({ message: 'Success', data: address });
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	} else {
		const address = new Address({
			user: req.user._id,
			addresses: req.body,
		});
		try {
			const data = await address.save();
			res.status(201).json({ message: 'Success', data: data });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
};

export const defaultAddress = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	await Address.findOneAndUpdate(
		{ user: req.user._id, 'addressses.default': true },
		{ 'addresses.default': false },
	);

	try {
		const data = await Address.findOneAndUpdate(
			{ user: req.user._id, 'addresses._id': id },
			{
				$set: {
					addresses: {
						default: true,
					},
				},
			},
			{ new: true },
		);

		res.status(200).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteAddress = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	const userAddresses = await Address.findOne({ user: req.user._id });
	const address = userAddresses.addresses.find((c) => c._id == id);
	if (!address) return res.status(400).json({ message: 'Address Not Found' });
	else {
		try {
			const data = await Address.findOneAndUpdate(
				{ user: req.user._id, 'addresses._id': id },
				{
					$pull: {
						addresses: {
							_id: id,
						},
					},
				},
			);

			res.status(200).json({ message: 'Deleted Successfully', address: data });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
};
export const getAddresses = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	try {
		const data = await Address.find({ user: req.user._id }).sort({
			createdAt: -1,
		});
		res.status(200).json({ message: 'Success', Address: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getAddressesById = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	try {
		const { id } = req.params;
		const data = await Address.findById({ _id: id }).sort({
			createdAt: -1,
		});
		res.status(200).json({ message: 'Success', Address: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
