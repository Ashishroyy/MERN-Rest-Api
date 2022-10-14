import  express  from "express";
const router = express.Router()
import registerController from '../controllers/auth/registerController.js';
import loginController from "../controllers/auth/loginController.js";
import userController from '../controllers/auth/userController.js';
import refreshController from '../controllers/auth/refreshController.js';
import productController from "../controllers/products/productController.js";
import auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'

router.post('/register', registerController.register)
router.post('/login', loginController.Login)
router.get('/me',auth, userController.me)
router.post('/refresh', refreshController.refresh)
router.post('/Logout',auth, loginController.logout)

router.post('/products',[auth, admin] ,productController.store);
router.put('/products/:id',[auth, admin] ,productController.update);
router.delete('/products/:id',[auth, admin] ,productController.destroy);
router.get('/products',productController.index);
router.get('/products/:id',productController.show);







export default router;