import { EmailTemplate } from './EmailTemplate.model';

export const getEmailTemplates = async (req, res) => {
	try {
		if (!req.user)
			return res.status(403).json({ message: 'User is not authenticated' });

		const templates = await EmailTemplate.find({});
		if (templates.length) return res.status(200).json(templates);
		res.status(404).json({ message: 'No templates found' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const getEmailTemplate = async (req, res) => {
	try {
		if (!req.user)
			return res.status(403).json({ message: 'User is not authenticated' });

		const id = req.params.id;
		const template = await EmailTemplate.findById(id);
		if (template) return res.status(200).json(template);
		res.status(404).json({ message: 'Template was not found by given id' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const updateEmailTemplate = async (req, res) => {
	try {
		if (!req.user)
			return res.status(403).json({ message: 'User is not authenticated' });

		const id = req.params.id;
		const template = await EmailTemplate.findOneAndUpdate(
			{ _id: id },
			{ ...req.body }
		);
		if (template) return res.status(200).json(template);
		res.status(404).json({ message: 'Template was not found by given id' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

/**
 ** Not added to the /api/emailTemplate/:id route yet
 */
export const deleteEmailTemplate = async (req, res) => {
	try {
		if (!req.user)
			return res.status(403).json({ message: 'User is not authenticated' });

		const id = req.params.id;
		const template = await EmailTemplate.deleteOne({ _id: id });
		if (template) return res.status(200).json(template);
		res.status(404).json({ message: 'Template was not found by given id' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
