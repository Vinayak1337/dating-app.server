import Listener from '../../listener';
import chalk from 'chalk';

export default class JoinCafe extends Listener {
	constructor(socket, userSocket) {
		super(socket, userSocket, {
			id: 'userCafeJoin',
			type: 'on',
			event: 'joinCafe'
		});
	}

	/**
	 * @param {string} cafeId - Id of the cafe / owner model
	 * @param {Function} cb
	 */
	exec = async (cafeId, cb) => {
		if (this.userSocket.connectedToCafe) return this.callback(cb, false);

		try {
			const cafe = await this.cafe.findById(cafeId);

			if (!cafe?._id)
				return this.callback(cb, `Cafe not found with given id ${cafeId}`);

			this.userSocket.connectedToCafe = true;
			this.userSocket.cafe = { id: cafeId, name: cafe.cafeName };

			this.userSocket.join(cafeId);

			console.log(
				chalk.blue(this.userSocket.user.name),
				chalk.green('Connected to cafe:'),
				cafe.cafeName
			);

			this.emitOnlieCafeUsers(cafeId);
			this.callback(cb);
		} catch (error) {
			console.log(error);
			this.callback(cb, error.message);
		}
	};
}
