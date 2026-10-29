import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { adminMutationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public route
router.get('/', getCategories);

// Admin-only protected routes
router.put('/reorder', protectAdmin, adminMutationLimiter, reorderCategories);
router.post('/', protectAdmin, adminMutationLimiter, createCategory);
router.put('/:id', protectAdmin, adminMutationLimiter, updateCategory);
router.delete('/:id', protectAdmin, adminMutationLimiter, deleteCategory);

export default router;

