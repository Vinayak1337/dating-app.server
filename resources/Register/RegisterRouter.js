import { Router } from 'express';
import { registerContact, registerNewsletter } from './RegisterController';

const registerRouter = Router();

registerRouter.post('/newsletter', registerNewsletter);
registerRouter.post('/contact', registerContact);

export default registerRouter;
