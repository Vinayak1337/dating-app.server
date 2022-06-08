import { Client, Message } from './Client_model';

export const getClient = (req, res) => {
	if (!req.user) return res.status(404).json({ message: 'User was not found' });
	res.status(200).json({ status: 'ok', user: req.user });
};

export const updateClientProfile = async (req, res) => {
	if (!req.user) return res.status(404).json({ message: 'User was not found' });
	const userID = req.user._id;
	const profilePictures = req.file?.profilePicture?.map(av => av?.location);
	const avatar = req.file?.avatar?.map(av => av.location)[0];

	const updateObject = { ...req.body };

	if (profilePictures?.length) updateObject.profilePictures = profilePictures;
	if (avatar) updateObject.avatar = avatar;
	try {
		const doc = await Client.findByIdAndUpdate(userID, updateObject, {
			new: true
		})
			.select('-password -identities')
			.lean()
			.exec();
		return res.status(200).json({ status: 'ok', data: doc });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.json({ message: 'Error performing the update', error: e.message });
	}
};

export const deleteClient = async (req, res) => {
	if (!req.user) return res.status(400).json({ message: 'User not Found' });
	try {
		await Client.findOneAndDelete({ _id: req.user._id }).exec();
		res.json({ status: 'ok', message: 'User Deleted Successfully' });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Error deleting User', error: e.message });
	}
};

export const changeClientPassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword)
		return res.status(400).json({ message: 'Required fields missing' });
	if (!req.user) return res.status(400).json({ message: 'User Not Found' });
	try {
		const user = await Client.findById(req.user._id).exec();
		const match = await user.checkPassword(oldPassword);
		if (!match)
			return res.status(401).json({ message: 'incorrect old password' });
		const doc = await Client.findByIdAndUpdate(req.user._id);
		if (doc) {
			doc.password = newPassword;
			await doc.save();
		}
		res.json({ status: 'OK', message: 'Password Changed Successfully' });
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'Error fetching user object',
			error: e.message
		});
	}
};

export const getClients = async (req, res) => {
	try {
		if (!req.user) return res.status(400).json({ message: 'User Not Found' });

		let { limit = 10 } = req.params;
		if (!limit.match(/^\d+$/g))
			return res.status(400).json({ message: 'Limit must be numeric ' });
		limit = Number(limit);

		const users = await Client.find({}, {}, { limit });

		res.status(200).json({ status: 'OK', users });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.json({ message: 'Error accessing users', error: e.message });
	}
};

export const getSpecificClient = async (req, res) => {
	try {
		if (!req.user) return res.status(400).json({ message: 'User Not Found' });

		const { id } = req.params;

		const user = await Client.findOne({ _id: id });

		res.status(200).json({ status: 'OK', user });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.json({ message: 'Error accessing users', error: e.message });
	}
};

export const updateClientStatus = async (req, res) => {
	if (!req.user) return res.status(400).json({ message: 'User not Found' });
	try {
		const { id } = req.params;
		const update = await Client.findByIdAndUpdate(
			{ _id: id },
			{
				$set: {
					status: req.body.active
				}
			},
			{
				new: true
			}
		);
		res.json(update);
	} catch (error) {
		res.json(error);
	}
};

export const getMessages = async (req, res) => {
	let { limit = 10 } = req.params;
	limit = Number(limit) || 10;
	const { sentBy, sentTo, before = Date.now() } = req.body;

	try {
		const messages = await Message.find(
			{
				createdAt: { $lt: before },
				$or: [
					{
						sentBy,
						sentTo
					},
					{
						sentTo: sentBy,
						sentBy: sentTo
					}
				]
			},
			{},
			{ limit }
		);

		res.status(200).json(messages);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
