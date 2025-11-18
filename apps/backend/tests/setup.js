// Setup file untuk Jest tests
// File ini akan dijalankan sebelum semua tests

// Set environment ke test
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
