import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const protectAdmin = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HTTP-only cookie first
    if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }
    // 2. Check Authorization Header fallback (Bearer token)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please log in as an administrator.',
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('[SECURITY ERROR]: JWT_SECRET is not configured in environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Authentication service configuration error.',
      });
    }

    // Verify token with explicit algorithm to prevent algorithm confusion attacks
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
    });

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session token payload.',
      });
    }

    let admin = null;
    try {
      admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, createdAt: true },
      });
    } catch (dbErr) {
      console.error('[DATABASE AUTH ERROR]: Failed to verify admin in database:', dbErr.message);
      return res.status(503).json({
        success: false,
        message: 'Authentication service temporarily unavailable. Please try again shortly.',
      });
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account associated with this session no longer exists.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid session token. Authorization denied.',
    });
  }
};

