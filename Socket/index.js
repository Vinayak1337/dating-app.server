import { Server } from 'socket.io';
import { verifyToken } from '../util/jwt';
import { handleUser } from './HandleUser';

export const connectSocket = async (httpServer, ownerModel, clientModel) => {
	const socket = new Server(httpServer, {
		path: '/socket'
	});

	socket.use(async (socket, next) => {
		const userToken = socket.handshake.auth.token;
		if (!userToken) return next(new Error('User token is required.'));

		try {
			const userPayload = await verifyToken(userToken);
			const user = await clientModel.findById(userPayload.id);

			if (!user) return next(new Error('User is not authorized.'));

			user.id = String(user._id);
			const newUser = {
				...user._doc,
				id: String(user._id)
			};

			const extraProps = [
				'username',
				'status',
				'notifications',
				'messages',
				'password',
				'createdAt',
				'__v'
			];

			for (const prop of extraProps) if (newUser[prop]) delete newUser[prop];

			socket.user = newUser;
			socket.userModel = clientModel;
			socket.ownerModel = ownerModel;
			next();
		} catch (error) {
			console.log(error);
			next(new Error(error.message));
		}
	});

	socket.on('connection', handleUser.bind(null, socket));
};
