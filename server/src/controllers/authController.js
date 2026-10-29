import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { loginSchema } from '../utils/validators.js';

// Pre-computed bcrypt hash for constant-time comparisons when email does not exist
// This prevents username / email enumeration timing attacks
const DUMMY_BCRYPT_HASH = '$2a$12$e80gYt2q19Qj19Qj19Qj1e0uQj19Qj19Qj19Qj19Qj19Qj19Qj19Q';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in server environment');
  }

  return jwt.sign(
    { id },
    secret,
    {
      algorithm: 'HS256',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// Set secure HTTP-only cookie with defensive defaults
const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSiteSetting = process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');

  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: sameSiteSetting,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Admin Login
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    let admin = null;
    try {
      admin = await prisma.admin.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (dbErr) {
      console.error('[DATABASE AUTH ERROR]: Failed querying admin by email:', dbErr.message);
      return res.status(503).json({
        success: false,
        message: 'Authentication service temporarily unavailable. Please try again shortly.',
      });
    }

    // Timing-attack prevention: perform bcrypt compare on dummy hash if admin not found
    if (!admin || !admin.passwordHash) {
      await bcrypt.compare(password, DUMMY_BCRYPT_HASH);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(admin.id);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token, // Provide token for Bearer header authentication fallback
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Logout
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSiteSetting = process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');

  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: sameSiteSetting,
    path: '/',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * Get Current Admin Profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: {
      id: req.admin.id,
      email: req.admin.email,
      createdAt: req.admin.createdAt,
    },
  });
};

