import Listener from '../../listener';

export default class DeleteMessage extends Listener {
	constructor(socket, userSocket) {
		super(socket, userSocket, {
			id: 'DeleteSentMessage',
			event: 'deleteMessage',
			type: 'on'
		});
	}

	/**
	 *
	 * @param {string[]} messages
	 * @param {Function} cb
	 */
	exec = async (messages, cb) => {
		try {
			console.log(messages, 'Message IDs');
			const user = await this.getUser(this.userSocket.user.id);
			for (const id of messages) {
				const msg = user.messages.find(n => n.id === id);
				if (!msg) continue;
				user.messages.splice(user.messages.indexOf(msg), 1);
			}

			user.markModified('messages');
			await user.save();
			this.sendUserData();

			this.callback(cb, true);
		} catch (error) {
			console.log(error);
			this.callback(cb, error.message);
		}
	};
}
