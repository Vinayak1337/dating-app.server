import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import md5 from 'md5';
import { SECRETS } from './config';

const spacesEndpoint = new AWS.Endpoint(SECRETS.spacesEndpoint);

const s3 = new AWS.S3({
	endpoint: spacesEndpoint,
	accessKeyId: SECRETS.spacesAcessKey,
	secretAccessKey: SECRETS.spacesSecretKey,
});

export const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'storage.tellytell.com',
		acl: 'public-read',
		key: function(request, file, cb) {
			const filenameArray = file.originalname.split('.');
			const extension = filenameArray[filenameArray.length - 1];
			const customFileName = `${md5([
				file.fieldName,
				Date.now(),
			])}.${extension}`;
			file.filename = `${file.fieldname}-${customFileName}`;
			cb(null, file.filename);
		},
	}),
});
