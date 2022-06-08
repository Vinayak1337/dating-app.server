import Listener from '../../listener';

export default class MessageCreate extends Listener {
	constructor(socket, userSocket) {
		super(socket, userSocket, {
			id: 'CreateNewMessage',
			event: 'messageCreate',
			type: 'on'
		});
	}

	/**
	 * @param {{id: string,
	 *	sentTo: string,
	 *	sentBy: string,
	 *	content: string,
	 *	at: number
	 * }} message
	 * @param {Function} cb
	 */
	exec = async (message, cb) => {
		try {
			const { sentTo } = message;
			const user = await this.getUser(sentTo);
			user.messages.push(message);
			user.markModified('messages');
			await user.save();

			const receiver = await this.getUser(sentTo);
			this.socket.to(sentTo).emit('message', receiver.messages);
			this.sendUserData();

			this.callback(cb, true);
		} catch (error) {
			console.log(error);
			this.callback(cb, error.message);
		}
	};
}
