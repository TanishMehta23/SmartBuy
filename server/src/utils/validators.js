import { z } from 'zod';

// Safe URL validator preventing XSS schemes like javascript:, vbscript:, data:
const safeUrlSchema = z
  .string()
  .trim()
  .max(1000, 'URL is too long')
  .refine(
    (val) => {
      if (!val) return true;
      const lower = val.toLowerCase().trim();
      // Block dangerous schemes
      if (
        lower.startsWith('javascript:') ||
        lower.startsWith('data:') ||
        lower.startsWith('vbscript:') ||
        lower.includes('\0')
      ) {
        return false;
      }
      // Must be http, https, or relative URL starting with /
      return (
        lower.startsWith('http://') ||
        lower.startsWith('https://') ||
        lower.startsWith('/')
      );
    },
    { message: 'URL must use HTTP/HTTPS protocol or relative path, and cannot contain script schemes.' }
  );

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(150),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(128),
});

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(120, 'Product name cannot exceed 120 characters')
    .trim(),
  categoryId: z.string().uuid('Invalid Category ID format'),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name cannot be empty')
    .max(120, 'Product name cannot exceed 120 characters')
    .trim()
    .optional(),
  categoryId: z.string().uuid('Invalid Category ID format').optional(),
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name cannot exceed 50 characters')
    .trim(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name cannot exceed 50 characters')
    .trim(),
});

export const reorderCategoriesSchema = z.object({
  categoryIds: z
    .array(z.string().uuid('Each category ID must be a valid UUID'))
    .min(1, 'At least one category ID is required')
    .max(200, 'Too many categories to reorder at once'),
});

export const createBannerSchema = z.object({
  title: z
    .string()
    .max(150, 'Banner title cannot exceed 150 characters')
    .trim()
    .optional()
    .nullable(),
  linkUrl: safeUrlSchema.optional().nullable(),
  imageUrl: safeUrlSchema.optional().nullable(),
  isActive: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .optional()
    .default(true),
});

export const updateBannerSchema = z.object({
  title: z
    .string()
    .max(150, 'Banner title cannot exceed 150 characters')
    .trim()
    .optional()
    .nullable(),
  linkUrl: safeUrlSchema.optional().nullable(),
  imageUrl: safeUrlSchema.optional().nullable(),
  isActive: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .optional(),
  order: z
    .union([z.number().int().min(0), z.string().regex(/^\d+$/)])
    .optional(),
});

export const reorderBannersSchema = z.object({
  bannerIds: z
    .array(z.string().min(1).max(100))
    .min(1, 'At least one banner ID is required')
    .max(100, 'Too many banners to reorder at once'),
});

