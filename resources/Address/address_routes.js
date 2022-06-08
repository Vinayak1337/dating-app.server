import { Router } from 'express';
import {
	addAddress,
	deleteAddress,
	getAddresses,
	defaultAddress,
	getAddressesById,
} from './address_controller';
const router = Router();

router.route('/add_Address').post(addAddress);
router.route('/delete_Address/:id').delete(deleteAddress);
router.route('/view_Address').get(getAddresses);
router.route('/view_Address/:id').get(getAddressesById);
router.route('/update_default_Address/:id').put(defaultAddress);
export default router;
