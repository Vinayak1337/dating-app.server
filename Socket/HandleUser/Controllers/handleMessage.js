import { getUser, sendUpdatedUserData } from '../../Util/onlineUsersHandler';

export const messageCreateHandler = async (socket, userSocket, message, cb) => {
	try {
		const { sentTo } = message;
		const user = await getUser(userSocket.userModel, sentTo);
		console.log(message, 'msg from', userSocket.user.firstName);

		user.messages.push(message);
		user.markModified('messages');
		await user.save();
		callback(cb);
		socket.to(sentTo).emit('message', user.messages);
		sendUpdatedUserData(userSocket);
	} catch (error) {
		console.log(error);
		callback(cb, error.message);
	}
};

export const deleteMessage = async (socket, userSocket, messages, cb) => {
	try {
		const user = await getUser(userSocket.userModel, userSocket.user.id);
		for (const id of messages) {
			const sent = user.messages.find(msg => msg.id === id);
			if (sent) user.splice(user.messages.indexOf(sent), 1);
		}
		user.markModified('messages');
		await user.save();
		callback(cb);
		socket.to(String(user._id)).emit('message', user.messages);
	} catch (error) {
		console.log(error);
		callback(cb, error.message);
	}
};

function callback(cb, error = true) {
	if (cb && typeof cb === 'function') cb(error);
}
