import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware untuk authenticate request menggunakan JWT token
// Digunakan untuk protect routes yang memerlukan login
export const authenticate = async (req, res, next) => {
  try {
    // Ambil Authorization header dari request
    const authHeader = req.headers.authorization;
    
    // Extract token dari format "Bearer <token>"
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim();

    // Jika tidak ada token, tolak request
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token menggunakan JWT_SECRET
    // Jika token invalid atau expired, akan throw error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cari user di database berdasarkan userId dari token
    const user = await User.findById(decoded.userId);

    // Jika user tidak ditemukan (mungkin sudah dihapus), tolak request
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Simpan user object ke request untuk digunakan di route handler
    req.user = user;
    
    // Lanjutkan ke handler berikutnya
    next();
  } catch (error) {
    // Jika terjadi error (token invalid, expired, dll), tolak request
    if (!res.headersSent) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
};

