import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom format
const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

// Console transport with colors
const consoleTransport = new winston.transports.Console({
  format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
});

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

// Get log level from environment (avoid importing config here to prevent circular dependencies)
const logLevel = process.env.LOG_LEVEL || 'info';

// Create logger
const logger = winston.createLogger({
  level: logLevel,
  format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [consoleTransport, errorFileTransport, combinedFileTransport, httpFileTransport],
  // Don't exit on error
  exitOnError: false,
});

// Create stream for Morgan
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

export default logger;
