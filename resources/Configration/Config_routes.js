import { Router } from 'express';
import {
	addAddress,
	addGST,
	addLogo,
	addSocialMedia,
	deleteConfig,
	getSiteLogo,
	getConfig
} from './Config_controller';
import { upload } from '../../util/s3-spaces';
import { protect } from '../../util/auth';

const router = Router();

let cpUpload = upload.fields([
	{ name: 'headerLogo', maxCount: 1 },
	{ name: 'footerLogo', maxCount: 1 },
	{ name: 'adminLogo', maxCount: 1 }
]);

router.route('/gst').post(protect, addGST);
router.route('/social').post(protect, addSocialMedia);
router.route('/address').post(protect, addAddress);
router.route('/logo').post(protect, cpUpload, addLogo).get(getSiteLogo);
router.route('/').get(getConfig).delete(protect, deleteConfig);

export default router;
