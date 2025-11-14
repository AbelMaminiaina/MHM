import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
const validateEnv = () => {
  // Skip validation in test environment if minimal test config is present
  if (process.env.NODE_ENV === 'test' && process.env.MONGO_URI) {
    return;
  }

  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'FRONTEND_URL',
  ];

  const missingVars = [];
  const warnings = [];

  // Check for missing required variables
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Check for security warnings
  if (process.env.JWT_SECRET === 'your_super_secret_jwt_key_change_this_in_production') {
    warnings.push('⚠️  JWT_SECRET is using the default value. Please change it in production!');
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('⚠️  JWT_SECRET should be at least 32 characters long for security.');
  }

  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST === 'smtp.ethereal.email') {
    warnings.push('⚠️  Using Ethereal Email in production. Please configure a real SMTP provider.');
  }

  // Warn if SMTP is not configured (email features will be disabled)
  if (!process.env.SMTP_HOST) {
    warnings.push('⚠️  SMTP not configured. Email features will be disabled.');
  }

  // Validate PORT is a number
  if (process.env.PORT && Number.isNaN(Number(process.env.PORT))) {
    missingVars.push('PORT (must be a valid number)');
  }

  // Validate SMTP_PORT is a number
  if (process.env.SMTP_PORT && Number.isNaN(Number(process.env.SMTP_PORT))) {
    missingVars.push('SMTP_PORT (must be a valid number)');
  }

  // Validate NODE_ENV values
  const validNodeEnvs = ['development', 'production', 'test'];
  if (process.env.NODE_ENV && !validNodeEnvs.includes(process.env.NODE_ENV)) {
    warnings.push(
      `⚠️  NODE_ENV is "${process.env.NODE_ENV}". Valid values are: ${validNodeEnvs.join(', ')}`
    );
  }

  // Display validation results
  if (missingVars.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    console.error('See .env.example for reference.\n');
    throw new Error('Missing required environment variables');
  }

  // Display warnings
  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment Configuration Warnings:');
    warnings.forEach((warning) => {
      console.warn(`   ${warning}`);
    });
    console.warn('');
  }

  // Success message
  console.log('✅ Environment variables validated successfully\n');
};

/**
 * Get configuration object with typed and validated values
 */
const getConfig = () => {
  // Clean frontend URL by removing trailing slash to prevent CORS issues
  // Support multiple URLs separated by commas
  const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const frontendUrls = rawFrontendUrl
    .split(',')
    .map((url) => url.trim())
    .map((url) => (url.endsWith('/') ? url.slice(0, -1) : url))
    .filter((url) => url.length > 0);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    mongoUri: process.env.MONGO_URI,
    jwt: {
      secret: process.env.JWT_SECRET || 'test_secret_key_for_development_minimum_32_chars',
      expire: process.env.JWT_EXPIRE || '30d',
    },
    frontendUrl: frontendUrls[0], // Backward compatibility - keep first URL as main
    frontendUrls, // Array of all allowed frontend URLs
    email: {
      smtp: {
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || 'test@example.com',
          pass: process.env.SMTP_PASS || 'testpassword',
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@test.com',
      fromName: process.env.EMAIL_FROM_NAME || 'Test',
    },
  };
};

// Validate environment variables on import
validateEnv();

// Export configuration
const config = getConfig();

export default config;
