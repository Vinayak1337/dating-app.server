import Listener from '../../listener';
import chalk from 'chalk';

export default class LeaveCafe extends Listener {
	constructor(socket, userSocket) {
		super(socket, userSocket, {
			id: 'UserLeftCafe',
			event: 'leaveCafe',
			type: 'on'
		});
	}

	/**
	 * @param {Function} cb
	 */
	exec(cb) {
		this.userSocket.leave(this.userSocket.cafe.id);
		this.userSocket.connectedToCafe = false;

		console.log(
			chalk.blue(this.userSocket.user.name),
			chalk.red('Left the cafe:'),
			this.userSocket.cafe.name
		);

		this.emitOnlieCafeUsers(
			this.userSocket.cafe?.id,
			this.userSocket.user.id,
			true
		);
		this.callback(cb);
	}
}
