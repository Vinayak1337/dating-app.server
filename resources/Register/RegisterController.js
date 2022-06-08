import { Contact } from '../Contact/contact_model';

export const registerNewsletter = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json('No email provided');
		await req.model.findOneAndUpdate(
			{},
			{
				$set: {
					'newsLetterSignUp.email': email,
					'newsLetterSignUp.status': true
				}
			},
			{ new: true }
		);
		res.status(200).json('Successfully registered');
	} catch (err) {
		console.log(err);
		res.status(500).json(`Something went wrong. ${err.message}`);
	}
};

export const registerContact = async (req, res) => {
	const contact = new Contact({
		...req.body,
		status: true
	});
	try {
		const data = await contact.save();
		res.status(200).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ error: error.message, message: 'failed' });
	}
};
