import sgmail from '@sendgrid/mail';
import { SECRETS } from '../util/config';

export const sendMsg = () => {
	sgmail.setApiKey(SECRETS.sendGridKey);
	const msg = {
		to: 'vinayak111kumar@gmail.com',
		from: 'hello@potionsofparadise.com',
		subject: 'Sending with SendGrid is Fun',
		text: 'and easy to do anywhere, even with Node.js',
		html: '<strong>and easy to do anywhere, even with Node.js</strong>'
	};
	sgmail
		.json(msg)
		.then(() => {
			console.log('Email sent');
		})
		.catch(error => {
			console.error(error.response.body.errors);
		});
};
