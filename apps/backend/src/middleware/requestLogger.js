import { logRequest } from '../utils/logger.js';

// Middleware untuk logging semua HTTP request dengan detail
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Simpan original end function
  const originalEnd = res.end;

  // Override res.end untuk capture response time
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    
    // Log request dengan duration dan status code
    logRequest(req, res.statusCode, duration);

    // Call original end
    originalEnd.apply(res, args);
  };

  next();
};
