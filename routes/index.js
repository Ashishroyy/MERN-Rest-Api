import  express  from "express";
import registerController from '../controllers/auth/registerController.js';
import loginController from "../controllers/auth/loginController.js";
import userController from '../controllers/auth/userController.js';
import refreshController from '../controllers/auth/refreshController.js';

import productController from "../controllers/products/productController.js";
import auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'

const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController.Login)
router.get('/me',auth, userController.me)
router.post('/refresh', refreshController.refresh)
router.post('/Logout',auth, loginController.logout)

router.post('/products/cart-items', productController.getProduct);

router.post('/products', [auth, admin], productController.store);
router.put('/products/:id',[auth, admin] ,productController.update);
router.delete('/products/:id',[auth, admin] ,productController.destroy);
router.get('/products',productController.allProducts);
router.get('/products/:id',productController.singleProduct);







export default router;