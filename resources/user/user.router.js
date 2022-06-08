import { Router } from 'express';
import { upload } from '../../util/s3-spaces';

import {
	getUserProfile,
	updateUserProfile,
	updateProfilePicture,
	changeUserPassword,
	deleteUser,
	updatePublicUrl,
	addLanguage,
	deleteLanguage,
	getDashboardDetails,
	getUsers,
	getHashKey,
	getUser,
	getOrderDetails,
	updateAccountActive,
	newsLetterSignUp,
	newsLetterUnsuscribe
} from './user.controllers';

const router = Router();

router
	.route('/')
	.get(getUserProfile)
	.put(upload.single('bannerImage'), updateUserProfile)
	.delete(deleteUser);

router.route('/profile').put(upload.single('picture'), updateProfilePicture);
router.route('/getUsers').get(getUsers);
router.route('/getUser/:id').get(getUser);
router.route('/profile/username').put(updatePublicUrl);
router.route('/languages/').post(addLanguage);
router.route('/languages/:id').delete(deleteLanguage);
router.route('/updateActive/:id').patch(updateAccountActive);
router.route('/password').post(changeUserPassword);
router.get('/details', getDashboardDetails);
router.post('/payment_gateway/payumoney', getHashKey);
router.get('/getOrderInfo/:id', getOrderDetails);
router.post('/subscribeNewsLetter', newsLetterSignUp);
router.post('/delNewsLetter/:id', newsLetterUnsuscribe);

export default router;
