import { Server } from 'socket.io';
import { Collection } from '@discordjs/collection';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '../util/jwt';
// eslint-disable-next-line no-unused-vars
import { Server as HttpServer } from 'http';
// eslint-disable-next-line no-unused-vars
import { Owner } from '../resources/Owner/OwnerModel';
// eslint-disable-next-line no-unused-vars
import { Client } from '../resources/Client/Client_model';
import chalk from 'chalk';
import * as listeners from './Listeners/.';
// import { Document } from 'mongoose';

export default class SocketServer extends Server {
	/**
	 * @param {HttpServer} httpServer
	 * @param {Owner} cafeModel
	 * @param {Client} clientModel
	 */
	constructor(httpServer, cafeModel, clientModel) {
		super(httpServer, {
			path: '/socket'
		});

		this.client = clientModel;
		this.cafe = cafeModel;
		this.clients = new Collection();

		this.loadMiddleware();
		this.on('connection', this.handleConnection);
	}

	/**
	 * @param {Socket} userSocket
	 */
	handleConnection = userSocket => {
		console.log(chalk.green('User Connected:'), userSocket.user.name);
		userSocket.join(userSocket.user.id);

		this.connected(userSocket);
		this.emitOnlineFriends(userSocket.user.id);

		this.loadListeners(userSocket);
	};

	/**
	 * @param {Socket} userSocket
	 */
	connected(userSocket) {
		userSocket.emit('connected', true);
	}

	/**
	 *
	 * @param {Socket} userSocket
	 */
	loadListeners = userSocket => {
		const files = Object.values(listeners);

		for (const file of files) {
			const mod = new file(this, userSocket);
			this.addToEmitter(mod, userSocket);
		}
	};

	/**
	 * @param {string} userId
	 */
	emitOnlineFriends = async userId => {
		try {
			const user = await this.getUser(userId);

			const friends = this.clients
				.filter(
					client =>
						user.friends.find(friend => friend.id === client.user.id) &&
						client.connected
				)
				.map(client => client.user.id);

			if (!friends.includes(userId)) friends.push(userId);
			for (const id of friends) this.to(id).emit('onlineFriends', friends);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 *
	 * @param {string} userId
	 * @returns {Promise<Document>} Client Doc
	 */
	getUser = userId => this.client.findById(userId);

	loadMiddleware() {
		this.use(async (userSocket, next) => {
			const userToken = userSocket.handshake.auth.token;

			if (!userToken) return next(new Error('User token is required.'));

			console.log(userToken, chalk.blue('New user token'));

			try {
				const userPayload = await verifyToken(userToken);
				const user = await this.client.findById(userPayload.id);

				if (!user) return next(new Error('User not found.'));

				userSocket.user = {
					id: String(user._id),
					name: `${user.firstName} ${user.lastName}`
				};
				userSocket.connectedToCafe = false;
				this.clients.set(userSocket.user.id, userSocket);

				next();
			} catch (error) {
				console.log(error);
				next(new Error(`Failed to authenticate. ${error.message}`));
			}
		});
	}

	/**
	 * @param {string} directory
	 * @param {Socket} userSocket
	 */
	loadAllEmitters(directory, userSocket) {
		const filepaths = this.readDir(directory);

		for (let filepath of filepaths) {
			filepath = path.resolve(filepath);
			this.loadFile(filepath, userSocket);
		}
	}

	/**
	 *
	 * @param {Object} file
	 * @param {Socket} userSocket
	 */
	loadFile(file, userSocket) {
		const isClass = typeof file === 'function';
		if (
			!isClass &&
			!(path.extname(file) === '.js') &&
			this.listenerHandlers.has(file.id)
		)
			return;

		file = new file(this, userSocket);
		this.addToEmitter(file, userSocket);
	}

	/**
	 * @param {Object} file
	 * @param {Socket} userSocket
	 */
	addToEmitter(file, userSocket) {
		if (file.type === 'once') return userSocket.once(file.event, file.exec);
		userSocket.on(file.event, file.exec.bind(file));
	}

	/**
	 * @param {String} directory
	 */
	readDir(directory) {
		const results = [];

		(function read(dir) {
			const files = fs.readdirSync(path.resolve(dir));

			for (const file of files) {
				const filepath = path.join(dir, file);

				if (fs.statSync(filepath).isDirectory()) {
					read(filepath);
					continue;
				}
				results.push(filepath);
			}
		})(directory);

		return results;
	}
}
