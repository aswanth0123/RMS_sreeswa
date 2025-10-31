import express from 'express';
import authRoutes from './Common/auth.js';
import shopRoutes from './superadmin/shopRoutes.js';
import productRoutes from './shop/productRoutes.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth routes
router.use('/auth', authRoutes);

// Protect all routes below
router.use(protect);

router.use('/shops', shopRoutes);
router.use('/products', productRoutes);

export default router;
