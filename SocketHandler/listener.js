// eslint-disable-next-line no-unused-vars
import Server from './SocketServer';
// import { Socket } from 'socket.io';

export default class Listener {
	/**
	 * @param {Server} socket
	 * @param {{ id: string, event: string, type: 'once' | 'on' }} options
	 * @param {Socket} userSocket
	 */
	constructor(socket, userSocket, options) {
		this.socket = socket;
		this.client = socket.client;
		this.clients = socket.clients;
		this.cafe = socket.cafe;
		this.userSocket = userSocket;

		const { id, event, type } = options;
		this.id = id;
		this.event = event;
		this.type = type;
	}

	exec() {
		throw new Error(`${this.id} - ${this.event} is not implemented.`);
	}

	/**
	 *
	 * @param {string} userId
	 * @param {boolean} disconnected
	 */
	emitOnlineFriends = async (userId, disconnected = false) => {
		const user = await this.getUser(userId);

		const friends = this.clients
			.filter(
				client =>
					user.friends.find(friend => friend.id === client.user.id) &&
					client.connected
			)
			.map(client => client.user.id);

		if (!disconnected && !friends.includes(userId)) friends.push(userId);
		if (disconnected && friends.includes(userId))
			friends.splice(friends.indexOf(userId), 1);

		for (const id of friends) this.socket.to(id).emit('onlineFriends', friends);
	};

	/**
	 * @param {string} cafeId
	 * @param {string} userId
	 * @param {boolean} left
	 */
	emitOnlieCafeUsers = async (cafeId, userId = null, left = false) => {
		let users = this.clients
			.filter(
				client =>
					client.connected &&
					client.cafe?.id === cafeId &&
					client.connectedToCafe
			)
			.map(client => client.user.id);

		if (left && users.includes(userId)) users.splice(users.indexOf(userId), 1);
		if (!left && !users.includes(userId)) users.push(this.userSocket.cafe.id);
		users = await this.client.find({ _id: { $in: users } });
		this.socket.to(cafeId).emit('onlineCafeUsers', users);
	};

	/**
	 *
	 * @param {Function} cb
	 * @param {boolean | string} error
	 */
	callback(cb, error = true) {
		if (typeof cb === 'function') cb(error);
	}

	/**
	 *
	 * @param {string} userId
	 * @returns
	 */
	getUser = userId => this.client.findById(userId);

	/**
	 *
	 * @param {string} userId
	 * @returns {Socket}
	 */
	finduser = userId => this.clients.find(client => client.user.id === userId);

	sendUserData = async () => {
		try {
			const user = await this.getUser(this.userSocket.user.id);

			this.userSocket.emit('updateUser', user);
		} catch (error) {
			console.log(error);
		}
	};
}
