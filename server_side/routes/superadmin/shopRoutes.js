import express from 'express';
import {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  getShopsByLocation,
  getActiveShops
} from '../../controllers/superadmin/ShopController.js';

const router = express.Router();

// Get all shops
router.get('/', getAllShops);

// Get active shops
router.get('/active', getActiveShops);

// Get shops by location
router.get('/location', getShopsByLocation);

// Get shop by ID
router.get('/:id', getShopById);

// Create new shop
router.post('/', createShop);

// Update shop
router.put('/:id', updateShop);

// Delete shop
router.delete('/:id', deleteShop);

export default router;
