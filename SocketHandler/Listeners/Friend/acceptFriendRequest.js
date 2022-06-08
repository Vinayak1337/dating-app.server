import Listener from '../../listener';
import pkg from 'uuid';
const { v4: uuid } = pkg;

export default class AcceptFriendRequest extends Listener {
	constructor(socket, userSocket) {
		super(socket, userSocket, {
			id: 'AcceptFriendRequest',
			event: 'acceptFriendRequest',
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

			receiver.notifications.push({
				id: uuid,
				type: 'acceptedFriendRequest',
				by: senderId,
				status: 2,
				text: 'accepted',
				at: Date.now()
			});
			senderRequest.status = 2;
			senderRequest.text = 'accepted';
			receiver.markModified('friends');

			const receiverRequest = sender.friends.find(
				friend => friend.id === receiverId
			);
			receiverRequest.status = 2;
			receiverRequest.text = 'accepted';
			sender.markModified('friends');

			if (typeof notificationId === 'string') {
				const noti = sender.notifications.find(n => n.id === notificationId);
				sender.notifications.splice(sender.notifications.indexOf(noti), 1);
			}

			await Promise.all([receiver.save(), sender.save()]);

			this.socket.to(receiverId).emit('notification', receiver.notifications);
			this.userSocket.emit('notification', sender.notifications);

			this.sendUserData();

			this.callback(cb, true);
		} catch (error) {
			console.log(error);
			this.callback(cb, error.message);
		}
	};
}
