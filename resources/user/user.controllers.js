import Mongoose from 'mongoose';
import { User, generateUniqueUserName } from './user.model';
import { Ecommerce } from '../Ecommerce/ecomerce_model';
import { Category } from '../Category/Category_model';
import { SECRETS } from '../../util/config';
import crypto from 'crypto';
const { Types } = Mongoose;
const key = process.env.PAYU_key;
const salt = process.env.PAYU_salt;
import { Order } from '../Order/Order_model';

const getUserProfile = (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User not Found' });
	}
	res.json({ status: 'ok', data: req.user });
};

const updateAccountActive = async (req, res) => {
	// if (!req.user) {
	//   return res.status(400).json({ message: "User not Found" });
	// }
	try {
		const { id } = req.params;
		console.log(id);
		const update = await User.findByIdAndUpdate(
			{ _id: id },
			{
				$set: {
					active: req.body.active
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

const updateUserProfile = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User not Found' });
	}
	const userID = req.user._id;
	// console.log(req.file, req.body);

	const { username } = req.body;
	console.log(username);
	const updateObject = req.file
		? {
				...req.body,
				bannerImage: req.file.location,
				publicUrl: `${SECRETS.domain_url}/${
					username ? username : req.user.username
				}`
		  }
		: {
				...req.body,
				publicUrl: `${SECRETS.domain_url}/${
					username ? username : req.user.username
				}`
		  };
	if (!updateObject) {
		return res.status(400).json({
			message: 'Nothing to Update'
		});
	}
	try {
		const doc = await User.findByIdAndUpdate(userID, updateObject, {
			new: true
		})
			.select('-password -identities')
			.lean()
			.exec();
		return res.json({ status: 'ok', data: doc });
	} catch (e) {
		console.log(e.message);
		if (e.message.includes('username_1 dup key')) {
			const newUsername = await generateUniqueUserName(
				username,
				req.user.firstName,
				req.user.lastName
			);
			return res.status(500).json({
				message: 'Error updating username, username already exists',
				error: e.message,
				suggestion: newUsername
			});
		}
		res
			.status(500)
			.json({ message: 'Error performing the update', error: e.message });
	}
};

const deleteUser = async (req, res) => {
	const Model = req.model;
	if (!req.user) {
		return res.status(400).json({ message: 'User not Found' });
	}
	try {
		await Model.findOneAndDelete({ _id: req.user._id }).exec();
		res.json({ status: 'ok', message: 'User Deleted Successfully' });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Error deleting User' });
	}
};

const updateProfilePicture = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User not Found' });
	}
	const userID = req.user._id;
	console.log(req.file, req.body);
	try {
		const doc = await User.findByIdAndUpdate(
			userID,
			{
				picture: req.file.location
			},
			{
				new: true
			}
		)
			.select('-password -identities')
			.lean()
			.exec();
		res.json({ status: 'ok', data: doc });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Error Updating Profile Picture' });
	}
	// res.json({ status: "recieved" });
};

const addFeatured = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	console.log(req.file);
	try {
		const doc = await User.findById(req.user._id);
		doc.featured.push({
			url: req.file.location
		});
		await doc.save();
		res.json({ status: 'OK', data: doc.featured });
	} catch (e) {
		console.log(e.message);
		res
			.status(500)
			.json({ message: 'Error adding featured media', error: e.message });
	}
};

const updateFeatured = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	console.log(req.file);
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ message: 'id not provided' });
	}
	try {
		const doc = await User.findOneAndUpdate(
			{ 'featured._id': id },
			{
				$set: {
					'featured.$.url': req.file.location
				}
			},
			{ new: true }
		);
		res.json({ status: 'OK', data: doc.featured });
	} catch (e) {
		console.log(e.message);
		res
			.status(500)
			.json({ message: 'Error updating featured media', error: e.message });
	}
};

const deleteFeatured = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ message: 'id not provided' });
	}
	try {
		const doc = await User.findOneAndUpdate(
			{ 'featured._id': id },
			{
				$pull: { featured: { _id: id } }
			},
			{ new: true }
		);
		res.json({ message: 'Media removed successfully', data: doc.featured });
	} catch (e) {
		console.log(e.message);
		res
			.status(500)
			.json({ message: 'Error deleting featured media', error: e.message });
	}
};

const addLanguage = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const { id } = req.body;
	if (!id) {
		return res
			.status(400)
			.json({ message: 'Language id needs to be provieded' });
	}
	try {
		const doc = await User.findByIdAndUpdate(
			req.user._id,
			{
				$addToSet: {
					languages: id
				}
			},
			{
				new: true
			}
		).populate({ path: 'languages', select: 'name' });
		res.json({ status: 'OK', data: doc.languages });
	} catch (e) {
		console.log(e.message);
		res
			.status(500)
			.json({ message: 'Error adding language', error: e.message });
	}
};

const deleteLanguage = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ message: 'id not provided' });
	}
	try {
		const doc = await User.findByIdAndUpdate(
			req.user._id,
			{
				$pull: { languages: id }
			},
			{
				new: true
			}
		);
		res.json({ status: 'OK', data: doc.languages });
	} catch (e) {
		console.log(e.message);
		res.status(500).json({
			message: 'Error Deleting Language',
			error: e.message
		});
	}
};

const getSubject = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ message: 'id not provided' });
	}
	try {
		// eslint-disable-next-line no-undef
		const doc = await Subject.findById(id).select('-addedBy -__v');
		res.json({ status: 'OK', data: doc });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.json({ message: 'Error getting Subject', error: e.message });
	}
};

const addSubject = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	const { name } = req.body;
	if (!name) {
		return res.status(400).json({ message: 'Subject Name required' });
	}

	const subjectObject = req.file
		? { name: name, addedBy: req.user._id, banner: req.file.location }
		: { name: name, addedBy: req.user._id };

	// find to check if subject already present.
	let subject;
	try {
		// eslint-disable-next-line no-undef
		subject = await Subject.findOne({ name: name, addedBy: req.user._id });
	} catch (e) {
		console.log(e.message);
		return res
			.status(500)
			.json({ message: 'Error identifying subject', error: e.message });
	}

	if (!subject) {
		// subject not present so create new
		try {
			// eslint-disable-next-line no-undef
			subject = await Subject.create(subjectObject);
		} catch (e) {
			console.log(e.message);
			return res
				.status(500)
				.json({ message: 'Error creating subject', error: e.message });
		}
	}

	// check if subject already exists in the user model
	try {
		const doc = await User.findOne({
			subjects: {
				$in: [subject._id]
			}
		});
		if (doc) {
			throw new Error('Subject Already Exists');
		}
	} catch (e) {
		console.log(e.message);
		return res.status(500).json({
			message: 'Error while subject already present',
			error: e.message
		});
	}

	// add to user subjects
	try {
		const doc = await User.findByIdAndUpdate(
			req.user._id,
			{
				$addToSet: { subjects: subject._id }
			},
			{ new: true }
		).populate({ path: 'subjects', select: '-addedBy -__v' });
		res.json({ status: 'OK', data: doc.subjects });
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ message: 'Error adding Subject', error: e.message });
	}
};

const updateSubject = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const { id } = req.params;
	const { name } = req.body;
	if (!id) {
		return res.status(400).json({ message: 'id not provided' });
	}
	if (!name) {
		return res.status(400).json({ message: 'Name not provided' });
	}

	console.log(req.file);
	const updateObject = req.file
		? { name: name.toLowerCase(), banner: req.file.location }
		: { name: name.toLowerCase() };

	try {
		// eslint-disable-next-line no-undef
		await Subject.findByIdAndUpdate(
			id,
			{
				$set: updateObject
			},
			{ new: true }
		);
		const doc = await User.findById(req.user._id).populate({
			path: 'subjects',
			select: '-addedBy -__v'
		});
		res.json({ status: 'OK', data: doc.subjects });
	} catch (e) {
		console.log(e.message);
		res
			.status(500)
			.json({ message: 'Error updating the subject', error: e.message });
	}
};

const deleteSubject = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ message: 'id not provided' });
	}

	try {
		// eslint-disable-next-line no-undef
		await Subject.findByIdAndDelete(id);
		const doc = await User.findByIdAndUpdate(
			req.user._id,
			{
				$pull: { subjects: id }
			},
			{ new: true }
		).populate({ path: 'subjects', select: '-addedBy -__v' });
		res.json({ status: 'OK', data: doc.subjects });
	} catch (e) {
		console.log(e.message);
		res.status(500).json({
			message: 'Error adding subject',
			error: e.message
		});
	}
};

const changeUserPassword = async (req, res) => {
	const Modal = req.model;
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		return res.status(400).json({ message: 'Required fields missing' });
	}
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	try {
		const user = await Modal.findById(req.user._id).exec();
		const match = await user.checkPassword(oldPassword);
		if (!match) {
			return res.status(401).json({ message: 'incorrect old password' });
		}
		const doc = await Modal.findByIdAndUpdate(req.user._id);
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

const updatePublicUrl = async (req, res) => {
	const { username } = req.body;
	try {
		const doc = await User.findByIdAndUpdate(
			req.user._id,
			{
				username: username,
				publicUrl: `${SECRETS.domain_url}/${username}`
			},
			{ new: true }
		);
		res.json({ status: 'OK', data: doc });
	} catch (e) {
		console.log(e.message);
		const newUsername = await generateUniqueUserName(
			username,
			req.user.firstName,
			req.user.lastName
		);
		res.status(500).json({
			status: 'Error',
			message: 'Duplicate username already exists',
			suggestion: newUsername
		});
	}
};

const getPublicProfile = async (req, res) => {
	const { username } = req.params;
	try {
		const doc = await User.findOne(
			{ username: username },
			'-reviews -reviewsCount -views -totalEarnings -rating -identities -email -password -subjects -lanugages'
		)
			.lean()
			.exec();
		if (!doc) {
			throw new Error('No user found');
		}
		// eslint-disable-next-line no-undef
		const payments = await Payment.findOne({ userID: doc._id });
		res.json({ status: 'OK', data: { ...doc, payments } });
	} catch (e) {
		console.log(e.message);
		res.status(500).json({
			message: 'Error finding userData',
			error: e.message
		});
	}
};

const getRequests = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User not Found' });
	}
	try {
		// eslint-disable-next-line no-undef
		const doc = await Request.aggregate([
			{
				$match: {
					userID: req.user._id
				}
			},
			{
				$lookup: {
					from: 'clients',
					localField: 'clientID',
					foreignField: '_id',
					as: 'requestedBy'
				}
			},
			{
				$unwind: '$requestedBy'
			},
			{
				$project: {
					client: {
						firstName: '$requestedBy.firstName',
						lastName: '$requestedBy.lastName'
					},
					status: 1,
					requestVideo: 1,
					answerVideo: 1,
					answerText: 1,
					clientID: 1,
					userID: 1,
					attachments: 1,
					requestText: 1,
					createdAt: 1,
					updatedAt: 1
				}
			}
		]);
		res.json({ status: 'ok', data: doc });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Error getting requests' });
	}
};

const getRequest = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User not Found' });
	}
	const { id } = req.params;
	// console.log(id);
	if (!id) {
		return res.status(400).json({ message: 'Empty id provided' });
	}
	try {
		// eslint-disable-next-line no-undef
		const doc = await Request.aggregate([
			{
				$match: {
					_id: Types.ObjectId(id)
				}
			},
			{
				$lookup: {
					from: 'clients',
					localField: 'clientID',
					foreignField: '_id',
					as: 'requestedBy'
				}
			},
			{
				$unwind: '$requestedBy'
			},
			{
				$project: {
					client: {
						firstName: '$requestedBy.firstName',
						lastName: '$requestedBy.lastName'
					},
					status: 1,
					requestVideo: 1,
					answerVideo: 1,
					answerText: 1,
					clientID: 1,
					userID: 1,
					attachments: 1,
					requestText: 1,
					createdAt: 1,
					updatedAt: 1
				}
			}
		]);
		const singleDoc = doc[0];
		if (!singleDoc) {
			return res.status(400).json({ status: 'No request Found' });
		}
		res.json({ status: 'ok', data: singleDoc });
	} catch (e) {
		console.log(e);
		if (
			e
				.toString()
				.includes(
					'Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
				)
		) {
			return res.status(400).json({ message: 'Invalid request ID' });
		}
		res.status(500).json({ message: 'Error getting requests' });
	}
};

const answerRequest = async req => {
	/**
   req.body = {
    answerText: "Here's the answer to your question"
   }
   req.params = {
     id: ObjectID
   }
   **/
	console.log(req.file, req.body);
};

const getSubscribers = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	try {
		// eslint-disable-next-line no-undef
		const subscribers = await Subscription.find({
			instructor: req.user._id
		})
			.populate({ path: 'subscriber', select: '-username -sub -__v' })
			.exec();
		res.json({ status: 'OK', data: subscribers });
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ message: 'Error fetching subscribers' });
	}
};

const getDashboardDetails = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).json({ message: 'User Not Found' });
		}
		// const videos = await Lesson.find({ madeBy: req.user._id });
		const products = await Ecommerce.find({ userID: req.user._id });
		const category = await Category.find({});

		// const subscribers = await Subscription.find({
		//   instructor: req.user._id,
		// });
		// const tvshows = await Tvshow.find({ user: req.user._id });
		res.json({
			status: 'OK',
			data: {
				// videosCount: videos.length,
				//tvshowsCount: tvshows.length,
				productsCount: products.length,
				categoryCount: category.length
				//subscriberCount: subscribers.length,
			}
		});
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ message: 'Error getting details' });
	}
};
const getUsers = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).json({ message: 'User Not Found' });
		}
		const user = await User.find();
		res.status(200).json(user);
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ message: 'Error getting details' });
	}
};
const getUser = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.find({ _id: id });

		if (user) {
			return res.status(200).json({
				status: 'success',
				user
			});
		} else {
			return res.status(404).json({
				status: 'failed',
				message: "User Doesn't Exists"
			});
		}
	} catch (error) {
		res.status(500).json({ message: 'Error getting details' });
	}
};
const getHashKey = async (req, res) => {
	const pay = req.body;
	pay.firstname = req.user.firstName;
	pay.email = req.user.email;
	pay.udf1 = req.user._id;
	console.log(pay);
	var cryp = crypto.createHash('sha512');
	var hashString =
		key +
		'|' +
		pay.txnid +
		'|' +
		pay.amount +
		'|' +
		pay.productinfo +
		'|' +
		pay.firstname +
		'|' +
		pay.email +
		'|' +
		pay.udf1 +
		'|' +
		'|||||||||' +
		salt;
	cryp.update(hashString);
	var hash = cryp.digest('hex');
	return res.status(200).json({
		key: key,
		hash: hash,
		email: req.user.email,
		firstName: req.user.firstName,
		userId: req.user._id
	});
};
const getOrderDetails = async (req, res) => {
	const id = req.params.id;
	try {
		const order = await Order.findOne({ _id: id, payment: true });

		return res.status(200).json({ message: 'ok', order: order });
	} catch (error) {
		return res.status(500).json({ message: 'failed', error: error.message });
	}
};
const newsLetterSignUp = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	const updateObj = {
		email: req.body.email,
		status: true
	};
	try {
		const user = await User.findByIdAndUpdate(
			{ _id: req.user._id },
			{
				$set: {
					'newsLetterSignUp.email': updateObj.email,
					'newsLetterSignUp.status': updateObj.status
				}
			},
			{ new: true }
		);

		return res.status(200).json({ message: 'success', user: user });
	} catch (error) {
		return res.status(500).json({ message: 'failed', error: error.message });
	}
};
const newsLetterUnsuscribe = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	try {
		const user = await User.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$set: {
					'newsLetterSignUp.status': false
				}
			},
			{ new: true }
		);

		return res.status(200).json({ message: 'success', user: user });
	} catch (error) {
		return res.status(500).json({ message: 'failed', error: error.message });
	}
};
export {
	getUserProfile,
	updateUserProfile,
	updateProfilePicture,
	getPublicProfile,
	newsLetterUnsuscribe,
	addFeatured,
	updateFeatured,
	deleteFeatured,
	addLanguage,
	deleteLanguage,
	deleteUser,
	getSubject,
	addSubject,
	updateSubject,
	deleteSubject,
	getRequest,
	getRequests,
	answerRequest,
	changeUserPassword,
	updatePublicUrl,
	getSubscribers,
	getDashboardDetails,
	getUsers,
	getUser,
	getHashKey,
	getOrderDetails,
	updateAccountActive,
	newsLetterSignUp
};
