import Listener from '../../listener';
import chalk from 'chalk';

export default class userDisconnect extends Listener {
	constructor(socket, userSocket) {
		super(socket, userSocket, {
			id: 'UserDisconnect',
			event: 'disconnect',
			type: 'on'
		});
	}

	exec() {
		console.log(chalk.red('User Disconnected:'), this.userSocket.user.name);

		this.socket.clients.delete(this.userSocket.user.id);

		this.emitOnlineFriends(this.userSocket.user.id, true);
		if (this.userSocket.connectedToCafe)
			this.emitOnlieCafeUsers(this.userSocket.cafe.id);
		this.userSocket.connectedToCafe = false;
	}
}
