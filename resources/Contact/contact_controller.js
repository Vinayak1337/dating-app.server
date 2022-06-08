import { Contact } from './contact_model';
export const addContact = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const contact = new Contact({
		...req.body,
		status: true
	});
	try {
		const data = await contact.save();
		res.status(201).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ error: error.message, message: 'failed' });
	}
};

export const deleteContact = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	try {
		const data = await Contact.findByIdAndDelete(id);
		res.status(200).json({ message: 'Success' });
	} catch (error) {
		res.status(500).json({ error: error.message, message: 'failed' });
	}
};
export const getContacts = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	try {
		const data = await Contact.find().sort({ createdAt: -1 });
		res.status(200).json({ message: 'Success', Contact: data });
	} catch (error) {
		res.status(500).json({ error: error.message, message: 'failed' });
	}
};
export const getPaticularContact = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	try {
		const data = await Contact.findById(req.params.id);
		res.status(200).json({ message: 'Success', Contact: data });
	} catch (error) {
		res.status(500).json({ error: error.message, message: 'failed' });
	}
};
