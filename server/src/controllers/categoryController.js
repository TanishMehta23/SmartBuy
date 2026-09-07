import prisma from '../config/db.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../utils/validators.js';

/**
 * Get all categories with product counts (ordered by custom order, then name)
 * GET /api/categories
 * Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        { order: 'asc' },
        { name: 'asc' },
      ],
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      order: cat.order,
      productCount: cat._count.products,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder categories in bulk
 * PUT /api/categories/reorder
 * Admin only
 * Body: { categoryIds: [id1, id2, id3, ...] }
 */
export const reorderCategories = async (req, res, next) => {
  try {
    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'categoryIds array is required',
      });
    }

    // Update each category with its new sequence index
    const updates = categoryIds.map((id, index) =>
      prisma.category.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    return res.status(200).json({
      success: true,
      message: 'Category sequence updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new category
 * POST /api/categories
 * Admin only
 */
export const createCategory = async (req, res, next) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const { name } = validatedData;

    // Check case-insensitive uniqueness
    const existing = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Category "${name}" already exists.`,
      });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a category name
 * PUT /api/categories/:id
 * Admin only
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = updateCategorySchema.parse(req.body);
    const { name } = validatedData;

    const existingCat = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCat) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check duplicate name
    const duplicate = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        NOT: { id },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: `Category "${name}" already exists.`,
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a category
 * DELETE /api/categories/:id?reassignToCategoryId=xyz
 * Admin only
 * If reassignToCategoryId is provided, products are moved before deletion.
 * Otherwise, if products exist in category, deletion is rejected.
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reassignToCategoryId } = req.query;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const productCount = category._count.products;

    if (productCount > 0) {
      if (!reassignToCategoryId) {
        return res.status(400).json({
          success: false,
          hasProducts: true,
          productCount,
          message: `Cannot delete category "${category.name}" because it contains ${productCount} product(s). Please choose another category to reassign these products or delete them first.`,
        });
      }

      // Verify reassignment target category
      if (reassignToCategoryId === id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot reassign products to the category being deleted.',
        });
      }

      const targetCategory = await prisma.category.findUnique({
        where: { id: reassignToCategoryId },
      });

      if (!targetCategory) {
        return res.status(404).json({
          success: false,
          message: 'Target category for reassignment not found.',
        });
      }

      // Reassign products and delete category in a transaction
      await prisma.$transaction([
        prisma.product.updateMany({
          where: { categoryId: id },
          data: { categoryId: reassignToCategoryId },
        }),
        prisma.category.delete({
          where: { id },
        }),
      ]);

      return res.status(200).json({
        success: true,
        message: `Category deleted and ${productCount} product(s) reassigned to "${targetCategory.name}".`,
      });
    }

    // No products, safe to delete immediately
    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
