import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

/**
 * Uploads a file buffer to Cloudinary with web optimization
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Destination folder in Cloudinary
 * @returns {Promise<{ imageUrl: string, imagePublicId: string }>}
 */
export const uploadImageToCloudinary = async (buffer, folder = 'store_catalog/products') => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Please supply CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the server .env file.'
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Deletes an image from Cloudinary by its public ID
 * @param {string} publicId - Cloudinary image public ID
 * @returns {Promise<void>}
 */
export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId || !isCloudinaryConfigured()) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary image: ${publicId}`, error);
  }
};
