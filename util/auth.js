import { newToken, verifyToken } from './jwt';

const signup = async (req, res) => {
	const Model = req.model;
	if (
		!req.body.email ||
		!req.body.password ||
		!req.body.firstName ||
		!req.body.lastName
	) {
		return res.status(400).json({
			message: 'Required fields missing'
		});
	}
	const user = await Model.findOne({ email: req.body.email });
	if (user)
		return res
			.status(400)
			.json({ status: 'failed', message: 'Email is already in use' });
	else {
		try {
			const user = await new Model(req.body).save();
			const token = newToken(user);
			return res.status(201).json({ status: 'ok', token: token });
		} catch (e) {
			console.log(e.message);
			if (e.toString().includes('E11000 duplicate key error collection')) {
				return res.status(400).json({
					status: 'User Already Exists'
				});
			}
			return res
				.status(400)
				.json({ status: 'Error Communicating with server' });
		}
	}
};

const signin = async (req, res) => {
	const Model = req.model;

	if (!req.body.email || !req.body.password)
		return res.status(400).json({ message: 'Email and password required' });
	const user = await Model.findOne({ email: req.body.email }).exec();
	if (!user) {
		return res.status(400).json({ message: 'Invalid Email or Password' });
	}

	try {
		const match = await user.checkPassword(req.body.password);
		if (!match) {
			return res.status(401).json({ message: 'Invalid Credentials' });
		}
		const token = newToken(user);

		return res.status(201).json({ status: 'ok', token });
	} catch (e) {
		console.log(e);
		return res.status(401).json({ message: 'Not Authorized' });
	}
};

const protect = async (req, res, next) => {
	if (!req.headers.authorization)
		return res.status(401).json({ message: 'User not authorized' });
	const token = req.headers.authorization.split(/Bearer |Client /gi)[1];
	if (!token) return res.status(401).json({ message: 'Token not found' });
	const Model = req.headers.authorization.startsWith('Bearer ')
		? req.model
		: req.adminModel;

	try {
		const payload = await verifyToken(token);
		const user = await Model.findById(payload.id)
			.populate({ path: 'subjects', select: '-addedBy -__v' })
			.populate({ path: 'languages', select: 'name' })
			.select('-password -identities')
			.lean()
			.exec();
		req.user = user;
		next();
	} catch (e) {
		console.log(e);
		return res.status(401).end();
	}
};

const clientSignUp = async (req, res) => {
	const Model = req.model;
	try {
		const { profilePicture = [], avatar = null } = req.files || {};

		const { email, password, firstName, lastName, age, bioData } = req.body;

		if (
			!(
				email ||
				password ||
				firstName ||
				lastName ||
				age ||
				bioData ||
				Array.isArray(profilePicture) ||
				profilePicture.length
			)
		)
			return res.status(400).json({
				message: 'Required fields missing'
			});

		const profilePictures = profilePicture.map(file => file?.location);
		const avatarUrl =
			avatar?.map(file => file?.location)[0] || profilePictures[0];

		let user = await Model.findOne({
			email: req.body.email
		});

		if (user)
			return res
				.status(400)
				.json({ status: 'failed', message: 'Email is already in use' });

		user = await new Model({
			...req.body,
			profilePictures,
			avatar: avatarUrl
		}).save();
		const token = newToken(user);
		return res.status(200).json({ token, user });
	} catch (e) {
		console.log(e);
		if (e.toString().includes('E11000 duplicate key error collection'))
			return res.status(400).json({
				status: 'User Already Exists'
			});

		return res
			.status(500)
			.json({ status: 'Error Communicating with server', message: e.message });
	}
};

const clientSignIn = async (req, res) => {
	const Model = req.model;

	const { email, password } = req.body;
	if (!email || !password)
		return res.status(400).json({ message: 'Email and password required' });
	const user = await Model.findOne({ email: email }).exec();
	if (!user)
		return res.status(400).json({ message: 'Invalid Email or Password' });

	try {
		const match = await user.checkPassword(password);
		if (!match) return res.status(401).json({ message: 'Invalid Credentials' });

		const token = newToken(user);

		return res.status(200).json({ status: 'ok', token, user });
	} catch (e) {
		console.log(e);
		return res
			.status(401)
			.json({ message: 'Not Authorized', error: e.message });
	}
};

export const ownerSignUp = async (req, res) => {
	const Model = req.model;

	const { picture = [] } = req.files || {};

	if (!picture?.length || !Array.isArray(picture))
		return res
			.status(400)
			.json({ message: 'Picture of the cafe is required.' });

	const {
		email,
		firstName,
		lastName,
		cafeName,
		phoneNumber,
		location,
		city,
		country
	} = req.body;

	if (
		!(
			email ||
			cafeName ||
			firstName ||
			lastName ||
			phoneNumber ||
			location ||
			city ||
			country
		)
	)
		return res.status(400).json({
			message: 'Required fields missing'
		});

	const user = await Model.findOne({ email: req.body.email });

	if (user)
		return res
			.status(400)
			.json({ status: 'failed', message: 'Email is already in use' });

	try {
		const user = await new Model({
			...req.body,
			picture: picture[0].location
		}).save();
		const token = newToken(user);
		return res.status(200).json({ token, user });
	} catch (e) {
		console.log(e);
		if (e.toString().includes('E11000 duplicate key error collection')) {
			return res.status(400).json({
				status: 'User Already Exists'
			});
		}
		return res
			.status(500)
			.json({ status: 'Error Communicating with server', message: e.message });
	}
};

export { signup, signin, protect, clientSignUp, clientSignIn };
