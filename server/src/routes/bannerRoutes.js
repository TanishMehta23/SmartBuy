import express from 'express';
import {
  getActiveBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
} from '../controllers/bannerController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { upload, validateImageBuffer } from '../middleware/uploadMiddleware.js';
import { adminMutationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public route to get all active banners
router.get('/', getActiveBanners);

// Admin-protected routes
router.get('/admin', protectAdmin, getAllBannersAdmin);
router.put('/reorder', protectAdmin, adminMutationLimiter, reorderBanners);
router.post(
  '/',
  protectAdmin,
  adminMutationLimiter,
  upload.single('image'),
  validateImageBuffer,
  createBanner
);
router.put(
  '/:id',
  protectAdmin,
  adminMutationLimiter,
  upload.single('image'),
  validateImageBuffer,
  updateBanner
);
router.delete('/:id', protectAdmin, adminMutationLimiter, deleteBanner);

export default router;

