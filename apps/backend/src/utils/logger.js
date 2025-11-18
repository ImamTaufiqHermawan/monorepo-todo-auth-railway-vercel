import winston from 'winston';

// Custom format untuk menampilkan log dengan warna dan struktur yang rapi
const customFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
  let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  
  // Tambahkan metadata jika ada
  if (Object.keys(meta).length > 0) {
    log += `\n${JSON.stringify(meta, null, 2)}`;
  }
  
  return log;
});

// Konfigurasi logger dengan Winston
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', // Level: error, warn, info, http, debug
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'todo-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console transport untuk development dan production
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        customFormat
      )
    })
  ]
});

// Helper functions untuk log yang lebih mudah digunakan

// Log HTTP request
export const logRequest = (req, statusCode, duration) => {
  const logData = {
    method: req.method,
    url: req.originalUrl || req.url,
    statusCode,
    duration: `${duration}ms`,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent')
  };

  if (statusCode >= 500) {
    logger.error('HTTP Request', logData);
  } else if (statusCode >= 400) {
    logger.warn('HTTP Request', logData);
  } else {
    logger.http('HTTP Request', logData);
  }
};

// Log database operation
export const logDB = (operation, details) => {
  logger.info('Database Operation', {
    operation,
    ...details
  });
};

// Log authentication
export const logAuth = (action, details) => {
  logger.info('Authentication', {
    action,
    ...details
  });
};

// Log error dengan stack trace
export const logError = (error, context = {}) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    ...context
  });
};

// Log info umum
export const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

// Log warning
export const logWarn = (message, meta = {}) => {
  logger.warn(message, meta);
};

// Log debug (hanya muncul jika LOG_LEVEL=debug)
export const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};

export default logger;
