import { Router } from 'express';
import {
	getProducts,
	getProductById,
	addProduct,
	updateProduct,
	deleteProduct,
	getLatest,
	getAllProduct,
	setStatus
} from './Ecommerce_controller';
import { protect } from '../../util/auth';

const router = Router();

router.route('/').get(getProducts).post(protect, addProduct);
router.route('/all').get(getAllProduct);
router.route('/new').get(getLatest);

router
	.route('/:id')
	.get(getProductById)
	.put(protect, updateProduct)
	.delete(protect, deleteProduct);
router.route('/setStatus/:id').get(setStatus);

export default router;
