import { Router } from 'express';
import {
	addContact,
	deleteContact,
	getContacts,
	getPaticularContact
} from './contact_controller';
const router = Router();

router.route('/add_Contact').post(addContact);
router.route('/get_Contact/:id').get(getPaticularContact);
router.route('/delete_Contact/:id').delete(deleteContact);
router.route('/view_Contact').get(getContacts);
export default router;
