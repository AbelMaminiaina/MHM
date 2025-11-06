import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import logger from './config/logger.js';
import config from './config/env.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimit.js';
import userRoutes from './routes/userRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

const app = express();

/**
 * Security Middleware
 */

// Set security HTTP headers
app.use(helmet());

// Sanitize data to prevent MongoDB injection attacks
app.use(mongoSanitize());

// Enable CORS with specific origin
// Support both with and without trailing slash for robustness
const allowedOrigins = [
  config.frontendUrl,
  `${config.frontendUrl}/`, // Support trailing slash variant
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list (exact match or without trailing slash)
      const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
      if (allowedOrigins.includes(origin) || allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      logger.warn(`CORS blocked request from origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/**
 * Logging Middleware
 */
// Morgan HTTP request logger
if (config.nodeEnv === 'development') {
  app.use(morgan('dev')); // Concise colored output for development
} else {
  app.use(morgan('combined', { stream: logger.stream })); // Apache combined format for production
}

/**
 * Body Parser Middleware
 */
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

/**
 * Rate Limiting
 */
// Apply general rate limiting to all routes
app.use('/api/', apiLimiter);

/**
 * Routes
 */

// Swagger Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MHM API Documentation',
  })
);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Vérifier l'état du serveur
 *     description: Endpoint pour vérifier que l'API est opérationnelle
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Serveur opérationnel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: MHM Backend API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-11-04T10:00:00.000Z
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MHM Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/applications', applicationRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to MHM Backend API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      health: '/health',
      users: '/api/users',
      members: '/api/members',
      applications: '/api/applications',
    },
  });
});

/**
 * Error Handling Middleware (must be last)
 */
app.use(notFound); // 404 handler
app.use(errorHandler); // Global error handler

export default app;
