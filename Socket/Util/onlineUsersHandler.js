export const getOnlineUsers = io => {
	const clients = [...io.sockets.sockets.values()];
	const users = clients.filter(socket => socket.connected);
	return users;
};

export const emitOnlineUsers = (socket, onlineUsers) => {
	for (const user of onlineUsers)
		socket.to(user.id).emit('onlineFriends', onlineUsers);
};

export const sendUpdatedUserData = async userSocket => {
	const user = await getUser(userSocket.userModel, userSocket.user.id);
	userSocket.emit('updateUser', user);
};

export const getUser = (userModel, requestUserId) =>
	userModel.findById(requestUserId);
