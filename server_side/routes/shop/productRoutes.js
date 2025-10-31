import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByShop,
  getProductsByCategory,
  getProductsByMetalType
} from '../../controllers/shop/product.js';
// import { protect, authorize } from '../../middleware/authMiddleware.js'; // Assuming auth middleware

const router = express.Router();

// router.use(protect); // Apply protection to all product routes

// Product CRUD routes
router.route('/')
  .get(getAllProducts)
  .post(createProduct);

router.route('/shop/:shopId')
  .get(getProductsByShop);

router.route('/category/:category')
  .get(getProductsByCategory);

router.route('/metal/:metalType')
  .get(getProductsByMetalType);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
