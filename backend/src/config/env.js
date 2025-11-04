import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
const validateEnv = () => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'FRONTEND_URL',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'EMAIL_FROM',
    'EMAIL_FROM_NAME',
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

  // Validate PORT is a number
  if (process.env.PORT && isNaN(process.env.PORT)) {
    missingVars.push('PORT (must be a valid number)');
  }

  // Validate SMTP_PORT is a number
  if (process.env.SMTP_PORT && isNaN(process.env.SMTP_PORT)) {
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
const getConfig = () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '30d',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    from: process.env.EMAIL_FROM,
    fromName: process.env.EMAIL_FROM_NAME,
  },
});

// Validate environment variables on import
validateEnv();

// Export configuration
const config = getConfig();

export default config;
