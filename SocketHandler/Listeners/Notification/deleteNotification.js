import Listener from '../../listener';

export default class DeleteNotification extends Listener {
	constructor(socket, userSocket) {
		super(socket, userSocket, {
			id: 'DeleteNotification',
			event: 'deleteNotification',
			type: 'on'
		});
	}

	/**
	 *
	 * @param {{
	 * id: string;
	 * type: string,
	 * by: string,
	 * status: number,
	 * text: string,
	 * at: number
	 * }} notification
	 * @param {Function} cb
	 */
	async exec(notification, cb) {
		try {
			const user = await this.getUser(this.userSocket.user.id);
			const notif = user.notifications.find(n => n.id === notification.id);
			if (!notif) this.callback(cb, 'Notification not found');

			user.notifications.splice(user.notifications.indexOf(notif), 1);
			user.markModified('notifications');
			await user.save();
			this.sendUserData();

			this.callback(cb, true);
		} catch (error) {
			console.log(error);
			this.callback(cb, error.message);
		}
	}
}
