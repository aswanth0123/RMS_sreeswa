import express from 'express';
import authRoutes from './Common/auth.js';
import shopRoutes from './superadmin/shopRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/shops', shopRoutes);

export default router;
