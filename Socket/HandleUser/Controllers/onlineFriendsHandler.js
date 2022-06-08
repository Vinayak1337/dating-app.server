import { getOnlineUsers } from '../../Util/onlineUsersHandler';

export const getOnlineFriends = (socket, userSocket) => {
	const onlineUsers = getOnlineUsers(socket);

	const onlineFriends = onlineUsers
		?.filter(clientSocket =>
			userSocket.user.friends.find(friend => friend.id === clientSocket.user.id)
		)
		?.map(clientSocket => clientSocket.user);

	return onlineFriends;
};
