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
import { upload, validateImageBuffer } from '../middleware/uploadMiddleware.js';
import { adminMutationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);

// Admin stats route (must come before /:id)
router.get('/stats', protectAdmin, getDashboardStats);

// Public single product route
router.get('/:id', getProductById);

// Admin CRUD routes
router.post(
  '/',
  protectAdmin,
  adminMutationLimiter,
  upload.single('image'),
  validateImageBuffer,
  createProduct
);

router.put(
  '/:id',
  protectAdmin,
  adminMutationLimiter,
  upload.single('image'),
  validateImageBuffer,
  updateProduct
);

router.delete('/:id', protectAdmin, adminMutationLimiter, deleteProduct);

export default router;

