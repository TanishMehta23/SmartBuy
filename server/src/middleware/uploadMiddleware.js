import multer from 'multer';
import path from 'path';

// Use memory storage so we stream directly to Cloudinary without local disk clutter
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // Validate both extension and MIME type
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(
      new Error('Invalid file extension. Only .jpg, .jpeg, .png, .webp, and .avif files are allowed.'),
      false
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase())) {
    return cb(
      new Error('Invalid file type. Only JPEG, PNG, WEBP, and AVIF image formats are supported.'),
      false
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Only allow single file upload per request
  },
});

/**
 * Validates image buffer magic bytes before uploading to Cloudinary
 */
export const validateImageBuffer = (req, res, next) => {
  if (!req.file || !req.file.buffer) {
    return next();
  }

  const buf = req.file.buffer;
  if (buf.length < 4) {
    return res.status(400).json({
      success: false,
      message: 'Uploaded file is corrupted or too small to be a valid image.',
    });
  }

  // Check magic bytes signatures
  // JPEG: FF D8 FF
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  // PNG: 89 50 4E 47
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  // WEBP: RIFF....WEBP (0x52 0x49 0x46 0x46 .... 0x57 0x45 0x42 0x50)
  const isWebp =
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50;
  // AVIF: ftypavif (bytes 4-11: 66 74 79 70 61 76 69 66)
  const isAvif =
    buf.length >= 12 &&
    buf.subarray(4, 12).toString('ascii').startsWith('ftyp');

  if (!isJpeg && !isPng && !isWebp && !isAvif) {
    return res.status(400).json({
      success: false,
      message: 'Invalid image signature. File content does not match allowed image formats.',
    });
  }

  next();
};

