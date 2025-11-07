import express from 'express';
import loginController from '../../controllers/Common/Login.js';
import signupController from '../../controllers/Common/Signup.js';
import logoutController from '../../controllers/Common/Logout.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/signup', signupController);
router.post('/logout', logoutController);

export default router;
