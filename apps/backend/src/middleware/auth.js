import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  console.log(`[AUTH] Authenticating request: ${req.method} ${req.path}`);
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log(`[AUTH] Token present: ${!!token}`);

    if (!token) {
      console.log(`[AUTH] ❌ No token provided`);
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[AUTH] Token decoded, userId: ${decoded.userId}`);
    
    const user = await User.findById(decoded.userId);
    console.log(`[AUTH] User found: ${!!user}`);

    if (!user) {
      console.log(`[AUTH] ❌ User not found`);
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    console.log(`[AUTH] ✅ Authentication successful, calling next()`);
    next();
  } catch (error) {
    console.error(`[AUTH] ❌ Authentication error:`, error.message);
    if (!res.headersSent) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
};

