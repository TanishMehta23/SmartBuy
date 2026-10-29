import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  // Handle Zod Schema Validation Errors
  if (err instanceof ZodError) {
    const errorDetails = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorDetails,
    });
  }

  // Handle Multer Errors & Upload Filter Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 5MB limit. Please upload a smaller image.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  // Handle custom upload errors (like fileFilter rejections)
  if (
    err.message &&
    (err.message.includes('Only JPEG, PNG') ||
      err.message.includes('Invalid file extension') ||
      err.message.includes('Invalid image signature'))
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Handle Prisma Known Request Errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'A record with this unique value already exists.',
    });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      success: false,
      message: 'Foreign key constraint failed. Related record does not exist or cannot be deleted.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'The requested record was not found.',
    });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = err.statusCode || (err.status && typeof err.status === 'number' ? err.status : 500);

  // In production, mask internal server error messages to prevent database or path leaks
  let publicMessage = err.message || 'Internal Server Error';
  if (statusCode === 500 && isProduction) {
    publicMessage = 'An unexpected server error occurred. Please try again later.';
  }

  console.error('[SERVER ERROR LOG]:', {
    message: err.message,
    code: err.code,
    statusCode,
    url: req.originalUrl,
    method: req.method,
    stack: isProduction ? undefined : err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message: publicMessage,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

