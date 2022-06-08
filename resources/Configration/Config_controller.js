import { Config } from './Config_model';

// Add GST
const addGST = async (req, res) => {
	const { gst } = req.body;
	try {
		if (!gst) {
			return res.status(400).json({
				status: 'failed',
				message: 'Please Provide Valid GST Value'
			});
		}
		const configuration = await Config.find();

		if (configuration.length === 0) {
			const createGst = await Config.create({
				gst
			});

			if (createGst) {
				return res.status(201).json({
					status: 'success',
					message: 'GST Created'
				});
			}
		} else {
			const updateGst = await Config.updateOne(
				{},
				{
					$set: {
						gst
					}
				}
			);

			if (updateGst) {
				return res.status(200).json({
					status: 'success',
					message: 'Updated GST Successfully'
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
};

// Add Social Media

const addSocialMedia = async (req, res) => {
	const { facebook, twitter, instagram, linkedin } = req.body;

	try {
		if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
			return res.status(400).json({
				status: 'failed',
				message: 'Please Provide Social Links'
			});
		}

		const socialMediaLink = await Config.find();
		if (socialMediaLink.length === 0) {
			const createSocialLinks = await Config.create({
				socialMedia: {
					facebook,
					twitter,
					instagram,
					linkedin
				}
			});

			if (createSocialLinks) {
				return res.status(201).json({
					status: 'success',
					message: 'Added Social Media Links Successfully'
				});
			}
		} else {
			const updateSocial = await Config.updateOne(
				{},
				{
					$set: {
						socialMedia: {
							facebook,
							twitter,
							instagram,
							linkedin
						}
					}
				}
			);
			if (updateSocial) {
				return res.status(200).json({
					status: 'success',
					message: 'Updated Social Media Links Successfully'
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
};

// add Address

const addAddress = async (req, res) => {
	const {
		company,
		address,
		city,
		state,
		country,
		pincode,
		website,
		contact,
		email
	} = req.body;
	console.log(req.body);
	if (
		!company ||
		!address ||
		!city ||
		!state ||
		!country ||
		!pincode ||
		!contact ||
		!email
	) {
		return res.status(400).json({
			status: 'failed',
			message: 'Please Provide All Fields'
		});
	}
	try {
		const getAddress = await Config.find();
		if (getAddress.length === 0) {
			const createAddress = await Config.create({
				address: {
					company,
					address,
					city,
					state,
					country,
					pincode,
					website,
					contact,
					email
				}
			});

			if (createAddress) {
				return res.status(201).json({
					status: 'success',
					message: 'created address successfully'
				});
			}
		} else {
			const updateAddress = await Config.updateOne(
				{},
				{
					$set: {
						address: {
							company,
							address,
							city,
							state,
							country,
							pincode,
							website,
							contact,
							email
						}
					}
				}
			);

			if (updateAddress) {
				return res.status(200).json({
					status: 'success',
					message: 'Updated Address Successfully'
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
};

// get congigartion

const getConfig = async (_req, res) => {
	try {
		const configration = await Config.find({});
		if (configration) {
			res.status(200).json({
				status: 'success',
				result: configration
			});
			return;
		}

		res.status(404).json({ message: 'No configs has been made yet.' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

// add logo
const addLogo = async (req, res) => {
	try {
		console.log(req.files);
		const configuration = await Config.find();

		if (configuration.length === 0) {
			const createLogo = await Config.create({
				logo: {
					Headerlogo: req.files.headerLogo[0].location,
					Footerlogo: req.files.footerLogo[0].location,
					Adminlogo: req.files.adminLogo[0].location
				}
			});

			if (createLogo) {
				return res.status(200).json({
					status: 'success',
					message: 'Created Logos Successfully'
				});
			}
		} else {
			const updateLogo = await Config.updateOne(
				{},
				{
					$set: {
						logo: {
							Headerlogo: req.files?.headerLogo[0]?.location,
							Footerlogo: req.files?.footerLogo[0]?.location,
							Adminlogo: req.files?.adminLogo[0]?.location
						}
					}
				}
			);

			if (updateLogo) {
				return res.status(200).json({
					status: 'success',
					message: 'Updated Logos Successfully'
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
};

export const getSiteLogo = async (req, res) => {
	try {
		const configuration = await Config.find({});
		if (!configuration.length)
			return res.status(404).json('No configuration saved.');

		console.log(configuration);
		res.status(200).json(configuration[0].logo[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const deleteConfig = async () => {
	const deleteConfig = await Config.deleteMany({});

	console.log(deleteConfig);
};

export { addGST, addSocialMedia, addAddress, getConfig, addLogo, deleteConfig };
