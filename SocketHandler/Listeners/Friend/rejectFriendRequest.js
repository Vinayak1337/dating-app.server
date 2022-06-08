import Listener from '../../listener';

export default class RejectFriendRequest extends Listener {
	constructor(socket, userSocket) {
		super(socket, userSocket, {
			id: 'RejectFriendRequest',
			event: 'rejectFriendRequest',
			type: 'on'
		});
	}

	/**
	 * @param {string} receiverId - Id of the user who sent the friend request
	 * @param {Function} cb
	 */
	exec = async (receiverId, notificationId, cb) => {
		try {
			const senderId = this.userSocket.user.id;
			const receiver = await this.getUser(receiverId);
			const sender = await this.getUser(senderId);

			if (!receiver)
				return this.callback(cb, `User not found by id ${receiverId}`);

			const senderRequest = receiver.friends.find(
				friend => friend.id === senderId
			);

			if (!senderRequest)
				return this.callback(
					cb,
					`${receiverId} - ${receiver.firstName} doesn't have your friend request.`
				);

			if (senderRequest.status === 2)
				return this.callback(
					cb,
					`${receiverId} - ${receiver.firstName} already is your friend.`
				);

			receiver.friends.splice(receiver.friends.indexOf(senderRequest), 1);
			receiver.markModified('friends');

			const receiverRequest = sender.friends.find(
				friend => friend.id === receiverId
			);
			sender.friends.splice(sender.friends.indexOf(receiverRequest), 1);
			sender.markModified('friends');

			if (typeof notificationId === 'string') {
				const noti = sender.notifications.find(n => n.id === notificationId);
				sender.notifications.splice(sender.notifications.indexOf(noti), 1);
			}

			this.socket.to(receiverId).emit('notification', receiver.notifications);
			this.userSocket.emit('notification', sender.notifications);

			await Promise.all([receiver.save(), sender.save()]);
			this.sendUserData();

			this.callback(cb, true);
		} catch (error) {
			console.log(error);
			this.callback(cb, error.message);
		}
	};
}
