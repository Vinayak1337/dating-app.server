import Listener from '../../listener';
import pkg from 'uuid';
const { v4: uuid } = pkg;

export default class SendFriendRequest extends Listener {
	constructor(socket, userSocket) {
		super(socket, userSocket, {
			id: 'SendFriendRequest',
			event: 'sendFriendRequest',
			type: 'on'
		});
	}

	/**
	 * @param {string} receiverId - Id of the user to send the friend request to.
	 * @param {Function} cb
	 */
	exec = async (receiverId, cb) => {
		try {
			const senderId = this.userSocket.user.id;
			const receiver = await this.getUser(receiverId);
			const sender = await this.getUser(senderId);

			if (!receiver)
				return this.callback(cb, `User not found by id ${receiverId}`);

			const request = receiver.friends.find(friend => friend.id === senderId);

			if (request)
				return this.callback(
					cb,
					`${receiverId} - ${receiver.firstName} already ${
						request.status === 1
							? 'has your friend request.'
							: 'is your friend.'
					}.`
				);

			receiver.friends.push({ id: senderId, status: 1, text: 'pending' });
			receiver.notifications.push({
				id: uuid(),
				type: 'friendRequest',
				by: senderId,
				status: 1,
				text: 'pending',
				at: Date.now()
			});
			receiver.markModified('friends');
			sender.friends.push({ id: receiverId, status: 1, text: 'pending' });
			sender.markModified('friends');

			await Promise.all([receiver.save(), sender.save()]);

			this.socket.to(receiverId).emit('notification', receiver.notifications);
			this.sendUserData();

			this.callback(cb, true);
		} catch (error) {
			console.log(error);
			this.callback(cb, error.message);
		}
	};
}
