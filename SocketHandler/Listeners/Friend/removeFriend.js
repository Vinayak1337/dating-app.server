import Listener from '../../listener';

export default class RemoveFriend extends Listener {
	constructor(socket, userSocket) {
		super(socket, userSocket, {
			id: 'RemoveFriend',
			event: 'removeFriend',
			type: 'on'
		});
	}

	/**
	 * @param {string} receiverId - Id of the user who is friend of the sender.
	 * @param {Function} cb
	 */
	exec = async (receiverId, cb) => {
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
					`${receiverId} - ${receiver.firstName} isn't your friend.`
				);

			receiver.friends.splice(receiver.friends.indexOf(senderRequest), 1);
			receiver.markModified('friends');

			const receiverRequest = sender.friends.find(
				friend => friend.id === receiverId
			);
			sender.friends.splice(sender.friends.indexOf(receiverRequest), 1);
			sender.markModified('friends');

			await Promise.all([receiver.save(), sender.save()]);
			this.sendUserData();

			this.callback(cb, true);
			this.socket.to(receiverId).emit('notification', receiver.notifications);
			this.userSocket.emit('notification', sender.notifications);
		} catch (error) {
			console.log(error);
			this.callback(cb, error.message);
		}
	};
}
