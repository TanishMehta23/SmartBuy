import prisma from '../config/db.js';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../services/cloudinaryService.js';

// In-memory fallback store if database is initializing or offline
let memoryBanners = [
  {
    id: 'banner-demo-1',
    title: 'Get 20% off on categories and brands',
    subtitle: 'From September 8th to 10th, get 20% off in credit on select categories and brands.',
    linkUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
    imagePublicId: null,
    order: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'banner-demo-2',
    title: 'Fresh Daily Essentials & Produce',
    subtitle: 'Handpicked fresh items delivered daily to our Cascais store.',
    linkUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1600&q=80',
    imagePublicId: null,
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

/**
 * Public: Get active banners for home catalog
 */
export const getActiveBanners = async (req, res, next) => {
  try {
    if (prisma.banner) {
      try {
        const banners = await prisma.banner.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' },
        });
        return res.status(200).json({ success: true, data: banners });
      } catch (dbErr) {
        console.warn('Prisma banner table query error, falling back:', dbErr.message);
      }
    }
    const active = memoryBanners.filter((b) => b.isActive).sort((a, b) => a.order - b.order);
    return res.status(200).json({ success: true, data: active });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all banners (including inactive)
 */
export const getAllBannersAdmin = async (req, res, next) => {
  try {
    if (prisma.banner) {
      try {
        const banners = await prisma.banner.findMany({
          orderBy: { order: 'asc' },
        });
        return res.status(200).json({ success: true, data: banners });
      } catch (dbErr) {
        console.warn('Prisma banner query error, falling back:', dbErr.message);
      }
    }
    const sorted = [...memoryBanners].sort((a, b) => a.order - b.order);
    return res.status(200).json({ success: true, data: sorted });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create banner
 */
export const createBanner = async (req, res, next) => {
  try {
    const { title, linkUrl, isActive } = req.body;
    let imageUrl = req.body.imageUrl;
    let imagePublicId = null;

    if (req.file) {
      const uploadRes = await uploadImageToCloudinary(req.file.buffer, 'store_catalog/banners');
      imageUrl = uploadRes.imageUrl;
      imagePublicId = uploadRes.imagePublicId;
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Banner image is required. Please upload an image file or provide an imageUrl.',
      });
    }

    const activeBool = isActive === 'true' || isActive === true;

    if (prisma.banner) {
      try {
        const count = await prisma.banner.count();
        const banner = await prisma.banner.create({
          data: {
            title: title ? title.trim() : null,
            linkUrl: linkUrl ? linkUrl.trim() : null,
            imageUrl,
            imagePublicId,
            order: count,
            isActive: activeBool,
          },
        });
        return res.status(201).json({ success: true, data: banner });
      } catch (dbErr) {
        console.warn('DB create failed, using memory fallback:', dbErr.message);
      }
    }

    const newBanner = {
      id: `banner-${Date.now()}`,
      title: title ? title.trim() : null,
      linkUrl: linkUrl ? linkUrl.trim() : null,
      imageUrl,
      imagePublicId,
      order: memoryBanners.length,
      isActive: activeBool,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryBanners.push(newBanner);
    return res.status(201).json({ success: true, data: newBanner });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update banner
 */
export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, linkUrl, isActive, order } = req.body;

    let updateData = {};
    if (title !== undefined) updateData.title = title ? title.trim() : null;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl ? linkUrl.trim() : null;
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
    if (order !== undefined) updateData.order = parseInt(order, 10);

    if (req.file) {
      const uploadRes = await uploadImageToCloudinary(req.file.buffer, 'store_catalog/banners');
      updateData.imageUrl = uploadRes.imageUrl;
      updateData.imagePublicId = uploadRes.imagePublicId;
    }

    if (prisma.banner) {
      try {
        const existing = await prisma.banner.findUnique({ where: { id } });
        if (existing) {
          if (req.file && existing.imagePublicId) {
            await deleteImageFromCloudinary(existing.imagePublicId);
          }
          const updated = await prisma.banner.update({
            where: { id },
            data: updateData,
          });
          return res.status(200).json({ success: true, data: updated });
        }
      } catch (dbErr) {
        console.warn('DB update failed, using memory fallback:', dbErr.message);
      }
    }

    const memIndex = memoryBanners.findIndex((b) => b.id === id);
    if (memIndex === -1) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    memoryBanners[memIndex] = {
      ...memoryBanners[memIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    return res.status(200).json({ success: true, data: memoryBanners[memIndex] });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete banner
 */
export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (prisma.banner) {
      try {
        const existing = await prisma.banner.findUnique({ where: { id } });
        if (existing) {
          if (existing.imagePublicId) {
            await deleteImageFromCloudinary(existing.imagePublicId);
          }
          await prisma.banner.delete({ where: { id } });
          return res.status(200).json({ success: true, message: 'Banner deleted successfully' });
        }
      } catch (dbErr) {
        console.warn('DB delete failed, using memory fallback:', dbErr.message);
      }
    }

    const banner = memoryBanners.find((b) => b.id === id);
    if (banner && banner.imagePublicId) {
      await deleteImageFromCloudinary(banner.imagePublicId);
    }
    memoryBanners = memoryBanners.filter((b) => b.id !== id);

    return res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Reorder banners
 */
export const reorderBanners = async (req, res, next) => {
  try {
    const { bannerIds } = req.body;
    if (!Array.isArray(bannerIds)) {
      return res.status(400).json({ success: false, message: 'bannerIds array is required' });
    }

    if (prisma.banner) {
      try {
        await prisma.$transaction(
          bannerIds.map((id, index) =>
            prisma.banner.update({
              where: { id },
              data: { order: index },
            })
          )
        );
        return res.status(200).json({ success: true, message: 'Banners reordered successfully' });
      } catch (dbErr) {
        console.warn('DB reorder failed, using memory fallback:', dbErr.message);
      }
    }

    bannerIds.forEach((id, index) => {
      const banner = memoryBanners.find((b) => b.id === id);
      if (banner) banner.order = index;
    });

    return res.status(200).json({ success: true, message: 'Banners reordered successfully' });
  } catch (error) {
    next(error);
  }
};
