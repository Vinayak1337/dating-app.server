import { Router } from 'express';
import {
	addTax,
	updateTax,
	deleteTax,
	getTaxes,
	getTax
} from './tax_controller';
const router = Router();

router.route('/add_tax').post(addTax);
router.route('/update_tax/:id').patch(updateTax);
router.route('/delete_tax/:id').delete(deleteTax);
router.route('/view_tax/:id').get(getTax);
router.route('/view_tax').get(getTaxes);
export default router;
