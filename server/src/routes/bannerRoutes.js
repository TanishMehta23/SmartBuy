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
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route to get all active banners
router.get('/', getActiveBanners);

// Admin-protected routes
router.get('/admin', protectAdmin, getAllBannersAdmin);
router.put('/reorder', protectAdmin, reorderBanners);
router.post('/', protectAdmin, upload.single('image'), createBanner);
router.put('/:id', protectAdmin, upload.single('image'), updateBanner);
router.delete('/:id', protectAdmin, deleteBanner);

export default router;
