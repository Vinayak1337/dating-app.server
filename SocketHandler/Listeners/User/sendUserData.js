import Listener from '../../listener';

export default class SendUserData extends Listener {
	constructor(socket, userSocket) {
		super(socket, userSocket, {
			id: 'SendUpdateUserData',
			event: 'sendUserData',
			type: 'on'
		});
	}

	exec(cb) {
		this.sendUserData();
		this.callback(cb);
	}
}
