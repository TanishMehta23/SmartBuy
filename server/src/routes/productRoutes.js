import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats,
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);

// Admin stats route (must come before /:id)
router.get('/stats', protectAdmin, getDashboardStats);

// Public single product route
router.get('/:id', getProductById);

// Admin CRUD routes
router.post('/', protectAdmin, upload.single('image'), createProduct);
router.put('/:id', protectAdmin, upload.single('image'), updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
