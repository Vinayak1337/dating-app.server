import { connectToCafe } from '../HandleCafe';
import { getOnlineFriends } from './Controllers/onlineFriendsHandler';
import {
	emitOnlineUsers,
	sendUpdatedUserData
} from '../Util/onlineUsersHandler';
import {
	deleteMessage,
	messageCreateHandler
} from './Controllers/handleMessage';
import { emitOnlineCafeUsers } from '../HandleCafe/Controllers/onlineCafeUsersHandler';
import {
	acceptFriendRequest,
	deleteNotification,
	rejectFriendRequest,
	removeFriend
} from '../Util/handleUserRequest';

export const handleUser = (socket, userSocket) => {
	console.log(
		userSocket.user.firstName,
		userSocket.user.lastName,
		'Connected to socket.'
	);

	userSocket.join(userSocket.user.id);

	const onlineFriends = getOnlineFriends(socket, userSocket);
	onlineFriends.push(userSocket.user);

	emitOnlineUsers(socket, onlineFriends);
	sendUpdatedUserData(userSocket);

	userSocket.emit(
		'connected',
		'Successfully connected to the server',
		userSocket.user,
		function (value) {
			console.log(value);
			return true;
		}
	);

	userSocket.on(
		'acceptFriendRequest',
		acceptFriendRequest.bind(null, socket, userSocket)
	);
	userSocket.on(
		'rejectFriendRequest',
		rejectFriendRequest.bind(null, userSocket)
	);

	userSocket.on(
		'messageCreate',
		messageCreateHandler.bind(null, socket, userSocket)
	);

	userSocket.on('sendUserData', cb => {
		sendUpdatedUserData(userSocket);
		if (typeof cb === 'function') cb(true);
	});

	userSocket.on(
		'deleteNotification',
		deleteNotification.bind(null, socket, userSocket)
	);

	userSocket.on('removeFriend', removeFriend.bind(null, userSocket));
	userSocket.on('deleteMessage', deleteMessage.bind(null, socket, userSocket));

	userSocket.on('joinCafe', connectToCafe.bind(null, socket, userSocket));

	userSocket.on('disconnect', () => {
		console.log(
			userSocket.user.firstName,
			userSocket.user.lastName,
			'Disconnected from socket.'
		);
		console.log([...socket.sockets.sockets.values()].length);
		if (userSocket.owner?.id) emitOnlineCafeUsers(socket, userSocket);
		emitOnlineUsers(socket, getOnlineFriends(socket, userSocket));
	});
};
