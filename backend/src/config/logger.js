import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom format
const logFormat = printf(
  ({ level, message, timestamp: ts, stack }) => `${ts} [${level}]: ${stack || message}`
);

// Console transport with colors
const consoleTransport = new winston.transports.Console({
  format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
});

// Get log level from environment (avoid importing config here to prevent circular dependencies)
const logLevel = process.env.LOG_LEVEL || 'info';

// Determine if we're in a serverless/read-only environment
// Check multiple indicators to ensure robust detection
const isServerless =
  process.env.VERCEL === '1' ||
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.FUNCTION_NAME ||
  process.env.DISABLE_FILE_LOGGING === 'true' ||
  // Additional check for read-only filesystem
  process.env.NOW_REGION || // Vercel legacy
  process.env.LAMBDA_TASK_ROOT; // AWS Lambda

// Build transports array - only use console in serverless environments
const transports = [consoleTransport];

// Only add file transports in non-serverless environments (local development)
if (!isServerless) {
  // File transport for errors (rotated daily)
  const errorFileTransport = new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxFiles: '14d', // Keep logs for 14 days
    maxSize: '20m', // Max 20MB per file
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  });

  // File transport for all logs (rotated daily)
  const combinedFileTransport = new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    maxSize: '20m',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  });

  // HTTP requests logs
  const httpFileTransport = new DailyRotateFile({
    filename: 'logs/http-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'http',
    maxFiles: '7d',
    maxSize: '20m',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  });

  transports.push(errorFileTransport, combinedFileTransport, httpFileTransport);
}

// Create logger
const logger = winston.createLogger({
  level: logLevel,
  format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports,
  // Don't exit on error
  exitOnError: false,
});

// Create stream for Morgan
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

export default logger;
