// Jest setup file - runs before all tests
// Set test environment variables

process.env.NODE_ENV = 'test';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mhm_test';
process.env.JWT_SECRET = 'test_secret_key_for_ci_minimum_32_characters';
process.env.JWT_EXPIRE = '1d';
process.env.PORT = '5000';
process.env.FRONTEND_URL = 'http://localhost:5173';

// Optional SMTP variables (with defaults)
process.env.SMTP_HOST = process.env.SMTP_HOST || 'smtp.ethereal.email';
process.env.SMTP_PORT = process.env.SMTP_PORT || '587';
process.env.SMTP_USER = process.env.SMTP_USER || 'test@example.com';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'testpassword';
process.env.EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@test.com';
process.env.EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Test';
