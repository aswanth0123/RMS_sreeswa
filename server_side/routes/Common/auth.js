import express from 'express';
import loginController from '../../controllers/Common/Login.js';

const router = express.Router();

router.post('/login', loginController);

export default router;
