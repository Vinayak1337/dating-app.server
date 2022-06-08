import { Router } from 'express';
import { upload } from '../../util/s3-spaces';
import {
	deleteClient,
	getClient,
	updateClientProfile,
	changeClientPassword,
	getClients,
	getSpecificClient,
	updateClientStatus,
	getMessages
} from './Client_controller';

const clientRouter = Router();

const uploadFields = upload.fields([
	{
		name: 'profilePicture',
		maxCount: 10
	},
	{
		name: 'avatar',
		maxCount: 1
	}
]);

clientRouter
	.route('/')
	.get(getClient)
	.put(uploadFields, updateClientProfile)
	.delete(deleteClient);

clientRouter.route('/profile').put(uploadFields, updateClientProfile);

clientRouter.route('/password').post(changeClientPassword);

clientRouter.route('/getClients/:limit').get(getClients);

clientRouter.route('/getClient/:id').get(getSpecificClient);

clientRouter.route('/updateStatus/:id').post(updateClientStatus);

clientRouter.route('/messages/:limit').post(getMessages);

clientRouter.route('/:id').get(getSpecificClient);

export default clientRouter;
