import { emitOnlineCafeUsers } from './Controllers/onlineCafeUsersHandler';
import { sendFriendRequest } from '../Util/handleUserRequest';

export const connectToCafe = async (socket, userSocket, cafeId, cb) => {
	if (userSocket.owner?.id && typeof cb === 'function')
		return callback(cb, false);

	const ownerModel = userSocket.ownerModel;
	const owner = await ownerModel.findById(cafeId);

	if (!owner) return callback(cb, false);

	userSocket.owner = { ...owner._doc, id: String(owner._id) };

	userSocket.join(owner.id);
	console.log(
		userSocket.user.firstName,
		userSocket.user.lastName,
		'Connected to cafe',
		owner.cafeName
	);

	callback(cb, true);

	emitOnlineCafeUsers(socket, String(owner._id));

	userSocket.on(
		'sendFriendRequest',
		sendFriendRequest.bind(null, socket, userSocket)
	);

	userSocket.on('leaveCafe', cb => {
		emitOnlineCafeUsers(socket, String(owner._id));
		userSocket.leave(owner.id);
		console.log(
			userSocket.user.firstName,
			userSocket.user.lastName,
			'Disconnected from cafe',
			owner.cafeName
		);
		delete userSocket.owner;

		callback(cb, true);
	});
};

function callback(cb, bool) {
	if (typeof cb === 'function') return cb(bool);
}
