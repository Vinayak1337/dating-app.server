import { Router } from 'express';
import { protect } from '../../util/auth';
import {
	deleteOwner,
	getOwner,
	getOwners,
	searchOwners,
	getSpecificOwner,
	deleteSpecificOwner
} from './OwnerController';

const ownerRouter = Router();

ownerRouter.route('/').get(protect, getOwner).delete(protect, deleteOwner);

ownerRouter.route('/search').get(searchOwners);
ownerRouter.route('/getOwners/:limit').get(getOwners);

ownerRouter
	.route('/getOwner/:id')
	.get(getSpecificOwner)
	.delete(protect, deleteSpecificOwner);

export default ownerRouter;
