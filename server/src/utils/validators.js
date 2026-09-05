import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
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
