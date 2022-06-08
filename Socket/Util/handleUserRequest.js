import { getUser, sendUpdatedUserData } from './onlineUsersHandler';

/**
 *
 * @param {Server} socket
 * @param {Socket} userSocket
 * @param {String} requestUserId
 * @param {Function} cb
 * @returns
 */
export const sendFriendRequest = async (
	socket,
	userSocket,
	requestUserId,
	cb
) => {
	try {
		const requestedUser = await getUser(userSocket.userModel, requestUserId);

		const user = await getUser(userSocket.userModel, userSocket.user.id);

		user.friends.push({
			id: requestUserId,
			status: 1,
			text: 'pending'
		});
		user.markModified('friends');

		requestedUser.friends.push({
			id: user.id,
			status: 1,
			text: 'pending'
		});
		requestedUser.notifications.push({
			type: 'notification',
			by: user.id,
			status: 1,
			text: 'pending',
			at: Date.now()
		});

		await Promise.all([requestedUser.save(), user.save()]);

		socket
			.to(requestUserId)
			.emit('notification', [...requestedUser.notifications]);
		callback(cb);
		sendUpdatedUserData(userSocket);
	} catch (error) {
		return callback(cb, error.message);
	}
};

export const acceptFriendRequest = async (
	socket,
	userSocket,
	requestUserId,
	cb
) => {
	try {
		const requestedUser = await getUser(userSocket.userModel, requestUserId);

		const user = await getUser(userSocket.userModel, userSocket.user.id);

		const request = requestedUser.friends.find(friend => friend.id === user.id);
		request.status = 2;
		request.text = 'accepted';
		requestedUser.markModified('friends');

		const request2 = user.friends.find(friend => friend.id === requestUserId);
		request2.status = 2;
		request2.text = 'accepted';
		user.markModified('friends');

		requestedUser.notifications.push({
			type: 'acceptedFriendRequest',
			by: user.id,
			status: 2,
			text: 'accepted',
			at: Date.now()
		});
		requestedUser.markModified('notifications');

		await Promise.all([requestedUser.save(), user.save()]);

		socket
			.to(requestedUser.id)
			.emit('notification', [...requestedUser.notifications]);
		callback(cb);
		sendUpdatedUserData(userSocket);
	} catch (error) {
		console.log(error);
		return callback(cb, error.message);
	}
};

export const deleteNotification = async (
	socket,
	userSocket,
	notification,
	cb
) => {
	try {
		const user = await userSocket.userModel.findById(userSocket.user.id);

		const request = user.notifications.find(
			noti => noti?.type === notification.type && noti?.by === notification.by
		);
		user.notifications.splice(user.notifications.indexOf(request), 1);
		socket.to(String(user._id)).emit('notification', [...user.notifications]);
		user.markModified('notifications');
		await user.save();
		callback(cb);
	} catch (error) {
		console.log(error);
		callback(cb, error.message);
	}
};

export const rejectFriendRequest = async (userSocket, requestUserId, cb) => {
	try {
		const user = await getUser(userSocket.userModel, userSocket.user.id);
		const requestedUser = await getUser(userSocket.userModel, requestUserId);

		const userRequest = user.friends.find(
			friend => friend.id === requestUserId
		);
		if (userRequest) {
			user.friends.splice(user.friends.indexOf(userRequest), 1);
			user.markModified('friends');
		}

		const requestedUserRequest = requestedUser.friends.find(
			friend => friend.id === userSocket.user.id
		);
		if (requestedUserRequest) {
			requestedUser.friends.splice(
				requestedUser.friends.indexOf(requestedUserRequest),
				1
			);
			requestedUser.markModified('friends');
		}

		await Promise.all([user.save(), requestedUser.save()]);
		callback(cb);
		sendUpdatedUserData(userSocket);
	} catch (error) {
		console.log(error);
		callback(cb, error.message);
	}
};

export const removeFriend = async (userSocket, userId, cb) => {
	try {
		const user = await getUser(userSocket.userModel, userSocket.user.id);
		const requestUser = await getUser(userSocket.userModel, userId);

		const friend = user.friends.find(friend => friend.id === userId);
		user.friends.splice(user.friends.indexOf(friend), 1);
		user.markModified('friends');

		const friend1 = requestUser.friends.find(
			friend => friend.id === String(user._id)
		);
		requestUser.friends.splice(requestUser.friends.indexOf(friend1), 1);
		requestUser.markModified('friends');

		await Promise.all([user.save(), requestUser.save()]);

		callback(cb);
		sendUpdatedUserData(userSocket);
	} catch (error) {
		console.log(error);
		callback(cb, error.message);
	}
};

function callback(cb, err = true) {
	if (typeof cb === 'function') cb(err);
}
