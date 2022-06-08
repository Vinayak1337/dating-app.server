import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import md5 from 'md5';

const { Schema, model } = mongoose;

const ClientSchema = new Schema({
	firstName: {
		type: String,
		required: [true, 'User Must Have A First Name'],
		trim: true
	},
	lastName: {
		type: String,
		required: [true, 'User Must Have A Last Name'],
		trim: true
	},
	email: {
		type: String,
		required: [true, 'User Must Have A Email'],
		trim: true,
		unique: true
	},
	password: {
		type: String,
		required: [true, 'User Must Have A Password']
	},
	age: {
		type: Number,
		required: [true, 'Age must be at least 13yo']
	},
	bioData: {
		type: String,
		required: [true, 'User must have a biodata']
	},
	profilePictures: {
		type: Array,
		default: []
	},
	avatar: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	username: {
		type: String,
		default: `Cafe_User_${(Math.random() + Date.now()).toString().slice(7)}`,
		trim: true,
		unique: true
	},
	friends: {
		type: Array,
		default: []
	},
	notifications: {
		type: Array,
		default: []
	},
	messages: {
		type: Array,
		default: []
	}
});

ClientSchema.pre('save', async function(next) {
	if (
		!this.isModified('password') &&
		!this.isModified('username') &&
		!this.isModified('profilePicture')
	)
		return next();

	this.username = await generateUniqueUserName(
		`${this.firstName.toLowerCase()}.${this.lastName.toLowerCase()}`,
		this.firstName,
		this.lastName
	);

	try {
		const hash = await bcrypt.hash(this.password, 8);
		this.password = hash;
		next();
	} catch (err) {
		next(err);
	}
});

ClientSchema.methods.checkPassword = function(password) {
	const passwordHash = this.password;

	return new Promise((resolve, reject) => {
		bcrypt.compare(password, passwordHash, (err, same) => {
			if (err) return reject(err);

			resolve(same);
		});
	});
};

export const generateUniqueUserName = async (
	proposedName,
	firstName,
	lastName
) => {
	const doc = await Client.findOne({ username: proposedName });

	if (doc) {
		const name = `${proposedName}.${md5([
			firstName,
			lastName,
			Date.now()
		]).slice(0, 5)}`;

		return await generateUniqueUserName(name, firstName, lastName);
	}

	return proposedName;
};

const MessageSchema = new Schema({
	sentBy: {
		type: Schema.Types.ObjectId,
		required: [true, 'Messsage must have a sender'],
		ref: 'Client'
	},
	sentTo: {
		type: Schema.Types.ObjectId,
		required: [true, 'Messsage must have a receiver'],
		ref: 'Client'
	},
	content: {
		type: String,
		required: [true, 'Message must have a content']
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	seen: {
		type: Boolean,
		default: false
	}
});

export const Client = model('Client', ClientSchema);

export const Message = model('ClientMessage', MessageSchema);
