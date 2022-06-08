import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
import md5 from 'md5';

const { Schema, model } = mongoose;

const OwnerSchema = new Schema({
	cafeName: {
		type: String,
		required: [true, 'Owner must have a cafe']
	},
	firstName: {
		type: String,
		required: [true, 'Owner Must Have A First Name'],
		trim: true
	},
	lastName: {
		type: String,
		required: [true, 'Owner Must Have A Last Name'],
		trim: true
	},
	email: {
		type: String,
		required: [true, 'Owner Must Have A Email'],
		trim: true,
		unique: true
	},
	location: {
		type: String,
		required: [true, 'Owner must provide a location']
	},
	city: {
		type: String,
		required: [true, 'Owner must provide his city']
	},
	country: {
		type: String,
		required: [true, 'Owner must provide his country']
	},
	phoneNumber: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	username: {
		type: String,
		trim: true,
		unique: true,
		default: `Cafe_Owner_${(Math.random() + Date.now()).toString().slice(7)}`
	},
	picture: {
		type: String,
		required: [true, 'Pciture of the cafe is required.']
	}
});

OwnerSchema.pre('save', async function (next) {
	if (!this.isModified('username')) return next();

	this.username = await generateUniqueUserName(
		`${this.firstName.toLowerCase()}.${this.lastName.toLowerCase()}`,
		this.firstName,
		this.lastName
	);

	// try {
	// 	const hash = await bcrypt.hash(this.password, 8);
	// 	this.password = hash;
	// 	next();
	// } catch (err) {
	// 	next(err);
	// }
});

// OwnerSchema.methods.checkPassword = function (password) {
// 	const passwordHash = this.password;

// 	return new Promise((resolve, reject) => {
// 		bcrypt.compare(password, passwordHash, (err, same) => {
// 			if (err) return reject(err);

// 			resolve(same);
// 		});
// 	});
// };

export const generateUniqueUserName = async (
	proposedName,
	firstName,
	lastName
) => {
	const doc = await Owner.findOne({ username: proposedName });

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

export const Owner = model('Owner', OwnerSchema);
