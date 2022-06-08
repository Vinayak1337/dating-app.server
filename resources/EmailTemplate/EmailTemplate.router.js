import { Router } from 'express';
import {
	getEmailTemplate,
	getEmailTemplates,
	updateEmailTemplate
} from './EmailTemplate.controller';
const emailTemplateRouter = Router();

emailTemplateRouter.route('/').get(getEmailTemplates);
emailTemplateRouter
	.route('/:id')
	.get(getEmailTemplate)
	.patch(updateEmailTemplate);

export default emailTemplateRouter;
