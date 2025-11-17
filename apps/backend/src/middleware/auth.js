import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  console.log(`[AUTH] Authenticating request: ${req.method} ${req.path} - URL: ${req.url} - OriginalURL: ${req.originalUrl}`);
  try {
    const authHeader = req.headers.authorization;
    console.log(`[AUTH] Authorization header: ${authHeader ? authHeader.substring(0, 20) + '...' : 'missing'}`);
    
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim();
    console.log(`[AUTH] Token extracted: ${token ? token.substring(0, 20) + '...' : 'missing'}`);

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

