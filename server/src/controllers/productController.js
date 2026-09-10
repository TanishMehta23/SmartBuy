import prisma from '../config/db.js';
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from '../services/cloudinaryService.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../utils/validators.js';

/**
 * Get paginated products with search, category filtering, and sorting
 * GET /api/products
 * Query Params: page, limit, search, categoryId, sort
 * Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const skip = (page - 1) * limit;

    const { search, categoryId, sort } = req.query;

    // Build Prisma Where Clause
    const where = {};

    if (categoryId && categoryId.trim() !== '' && categoryId !== 'all') {
      where.categoryId = categoryId.trim();
    }

    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          category: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Determine Sort Order
    let orderBy = { createdAt: 'desc' }; // default: newest first

    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Execute queries in parallel with connection efficiency
    const [totalProducts, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalProducts / limit) || 1;

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID
 * GET /api/products/:id
 * Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product
 * POST /api/products
 * Multipart form data: name, categoryId, image (file)
 * Admin only
 */
export const createProduct = async (req, res, next) => {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const { name, categoryId } = validatedData;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Product image is required',
      });
    }

    // Upload to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadImageToCloudinary(req.file.buffer);
    } catch (uploadErr) {
      return res.status(500).json({
        success: false,
        message: `Image upload failed: ${uploadErr.message}`,
      });
    }

    // Create Product in Database
    const product = await prisma.product.create({
      data: {
        name,
        categoryId,
        imageUrl: uploadResult.imageUrl,
        imagePublicId: uploadResult.imagePublicId,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing product
 * PUT /api/products/:id
 * Multipart form data: name (optional), categoryId (optional), image (optional file)
 * Admin only
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = updateProductSchema.parse(req.body);
    const { name, categoryId } = validatedData;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Selected category does not exist',
        });
      }
    }

    let imageUrl = existingProduct.imageUrl;
    let imagePublicId = existingProduct.imagePublicId;

    // If new image is uploaded, upload to Cloudinary and cleanup old image
    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(req.file.buffer);
      
      // Cleanup old image asynchronously
      if (existingProduct.imagePublicId) {
        deleteImageFromCloudinary(existingProduct.imagePublicId).catch((err) =>
          console.error('Failed to cleanup old image:', err)
        );
      }

      imageUrl = uploadResult.imageUrl;
      imagePublicId = uploadResult.imagePublicId;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(categoryId ? { categoryId } : {}),
        imageUrl,
        imagePublicId,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product
 * DELETE /api/products/:id
 * Admin only
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete image from Cloudinary
    if (product.imagePublicId) {
      await deleteImageFromCloudinary(product.imagePublicId);
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Admin dashboard stats
 * GET /api/products/stats
 * Admin only
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalProducts, totalCategories, recentProducts] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        recentProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};
