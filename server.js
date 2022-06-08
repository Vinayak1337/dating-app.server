// packages
import express, { urlencoded, json } from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import { config } from 'dotenv';
import cors from 'cors';
import expressListRoutes from 'express-list-routes';
// modules
import path from 'path';
import URL from './url.js';
import { Order } from './resources/Order/Order_model';
import { Cart } from './resources/Cart/cart_model';
import {
	signup,
	signin,
	protect,
	clientSignUp,
	clientSignIn,
	ownerSignUp
} from './util/auth.js';
import { User } from './resources/user/user.model.js';
import UserRouter from './resources/user/user.router.js';
import CategoryRouter from './resources/Category/Category_routes.js';
import ProductRouter from './resources/Ecommerce/ecommerce.router.js';
import TaxRouter from './resources/Tax/tax_routes.js';
import PageRouter from './resources/Pages/page_routes.js';
import CartRouter from './resources/Cart/cart_routes.js';
import OrderRouter from './resources/Order/Order_router.js';
import ShippingRouter from './resources/Shipping/shipping_routes.js';
import ConfigRouter from './resources/Configration/Config_routes.js';
import FeatureRouter from './resources/Featured/FeaturedProduct_routes.js';
import AddressRouter from './resources/Address/address_routes.js';
import WishListRouter from './resources/Wishlist/wishlist_routes.js';
import ContactRouter from './resources/Contact/contact_routes.js';
import CouponRouter from './resources/Coupon/Coupon_router.js';
import { connect } from './util/db.js';
import { SECRETS } from './util/config.js';
import { getUserById } from './util/grabUserbyId.js';
import {
	getProducts,
	getProductById
} from './resources/Ecommerce/Ecommerce_controller.js';
import { view as viewCategories } from './resources/Category/Category_controller.js';
import registerRouter from './resources/Register/RegisterRouter.js';
import { Client } from './resources/Client/Client_model';
import clientRouter from './resources/Client/Client_routes.js';
import swaggerUI from 'swagger-ui-express';
import { Owner } from './resources/Owner/OwnerModel.js';
import ownerRouter from './resources/Owner/OwnerRouter.js';
import emailTemplateRouter from './resources/EmailTemplate/EmailTemplate.router.js';
import SocketServer from './SocketHandler/SocketServer.js';
import { upload } from './util/s3-spaces.js';
import specs from './swagger.json';

config();
const app = express();
const PORT = process.env.PORT || 5000;
export const userModel = (req, _res, next) => {
	req.model = User;
	next();
};

export const clientModel = (req, _res, next) => {
	req.model = Client;
	req.adminModel = User;
	req.ownerModel = Owner;
	next();
};

export const ownerModel = (req, _res, next) => {
	req.model = Owner;
	req.clientModel = Client;
	req.adminModel = User;
	next();
};

const httpServer = createServer(app);

const uploadFields = upload.fields([
	{
		name: 'profilePicture',
		maxCount: 10
	},
	{
		name: 'avatar',
		maxCount: 1
	}
]);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.post('/signup', userModel, signup);
app.post('/signin', userModel, signin);
app.get('/', (req, res) => {
	res.json('Server is Running');
});
app.post('/client/signup', uploadFields, clientModel, clientSignUp);
app.post('/client/signin', clientModel, clientSignIn);
app.post('/owner/signup', upload.single('picture'), ownerModel, ownerSignUp);

app.use('/owner', ownerModel, ownerRouter);
app.use('/register', userModel, registerRouter);
app.use('/client', clientModel, protect, clientRouter);
app.use('/api/user', userModel, protect, UserRouter);
app.get('/products/:username/', getUserById, getProducts);
app.get('/products/:username/:id', getUserById, getProductById);
app.get('/categories/:username', getUserById, viewCategories);
app.use('/api/category', userModel, CategoryRouter);
app.use('/api/product', userModel, ProductRouter);
app.use('/api/cart', userModel, protect, CartRouter);
app.use('/api/wishList', userModel, protect, WishListRouter);
app.use('/api/config', userModel, ConfigRouter);
app.use('/api/featured', userModel, FeatureRouter);
app.use('/api/coupon', userModel, CouponRouter);
app.use('/api/order', userModel, OrderRouter);
app.use('/api/tax', userModel, protect, TaxRouter);
app.use('/api/page', userModel, PageRouter);
app.use('/api/shipping', userModel, protect, ShippingRouter);
app.use('/api/address', userModel, protect, AddressRouter);
app.use('/api/contact', userModel, protect, ContactRouter);
app.use('/api/emailTemplate', userModel, protect, emailTemplateRouter);

// sendMsg();

const __dirname = path.resolve();
// We are using request for making an HTTP/HTTPS call to payumoney server
app.post('/payment-success', async (req, res) => {
	console.log(req.body);
	const { txnid, udf1 } = req.body;

	await Order.findOneAndUpdate(
		{ _id: txnid },
		{
			$set: {
				payment: true
			}
		},
		{
			new: true
		}
	);
	await Cart.findOneAndDelete({ user: udf1 });

	//  res.sendFile(path.join(__dirname, '/success.html'));
	res.redirect(`${URL}/payment-success/${txnid}`);
});
app.post('/payment-failure', async (req, res) => {
	console.log(req.body);

	res.sendFile(path.join(__dirname, '/failure.html'));
});

export const start = async () => {
	try {
		await connect();
		// connectSocket(httpServer, Owner, Client);
		new SocketServer(httpServer, Owner, Client);

		httpServer.listen(PORT, () => {
			if (SECRETS.node_env === 'development') {
				expressListRoutes(app);
			}
			console.log(`REST API on http://localhost:${PORT}/`);
		});
	} catch (e) {
		console.error(e);
	}
};
