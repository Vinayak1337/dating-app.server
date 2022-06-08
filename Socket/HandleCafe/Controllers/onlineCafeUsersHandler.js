import { getOnlineUsers } from '../../Util/onlineUsersHandler';

export const emitOnlineCafeUsers = (socket, ownerId) => {
	const onlineUsers = getOnlineUsers(socket);

	const onlineCafeUsers = onlineUsers
		.filter(user => user.owner?.id === ownerId && user.connected)
		.map(userSocket => userSocket.user);

	socket.to(ownerId).emit('onlineCafeUsers', onlineCafeUsers);
};
