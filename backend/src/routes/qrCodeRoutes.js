import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  generateQRCodeForMember,
  bulkGenerateQRCodes,
  regenerateForNewYear,
  verifyQRCodeData,
  getQRCodeStats,
  getMemberQRCode,
  getScanHistory,
  getDashboardStats,
  getMemberScanHistory,
  importCSVAndSendQRCodes,
  retryFailedSends,
  getBatches,
  getBatchDetails,
  getBatchStats,
} from '../controllers/qrCodeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// Configure multer for CSV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `qrcode-batch-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers CSV sont acceptés'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: QR Codes
 *   description: QR code generation, verification and management
 */

/**
 * @swagger
 * /api/qrcodes/generate/{memberId}:
 *   post:
 *     summary: Generate and send QR code for a specific member
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               validity:
 *                 type: string
 *                 description: Year of validity (e.g., "2025")
 *                 example: "2025"
 *     responses:
 *       200:
 *         description: QR code generated and sent successfully
 *       404:
 *         description: Member not found
 *       500:
 *         description: Server error
 */
router.post('/generate/:memberId', protect, authorize('admin'), generateQRCodeForMember);

/**
 * @swagger
 * /api/qrcodes/bulk-generate:
 *   post:
 *     summary: Bulk generate and send QR codes
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               validity:
 *                 type: string
 *                 description: Year of validity (optional, defaults to current year)
 *                 example: "2025"
 *               status:
 *                 type: string
 *                 description: Filter by member status (optional, defaults to 'active')
 *                 enum: [active, pending, inactive, rejected, suspended]
 *                 example: "active"
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Specific member IDs to process (optional)
 *     responses:
 *       200:
 *         description: Bulk operation completed
 *       500:
 *         description: Server error
 */
router.post('/bulk-generate', protect, authorize('admin'), bulkGenerateQRCodes);

/**
 * @swagger
 * /api/qrcodes/regenerate-year:
 *   post:
 *     summary: Regenerate QR codes for all active members for a new year
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *             properties:
 *               year:
 *                 type: string
 *                 description: Year for new QR codes (4-digit format)
 *                 example: "2026"
 *     responses:
 *       200:
 *         description: QR codes regenerated successfully
 *       400:
 *         description: Invalid year format
 *       500:
 *         description: Server error
 */
router.post('/regenerate-year', protect, authorize('admin'), regenerateForNewYear);

/**
 * @swagger
 * /api/qrcodes/verify:
 *   post:
 *     summary: Verify a QR code (Public endpoint)
 *     tags: [QR Codes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrData
 *             properties:
 *               qrData:
 *                 type: string
 *                 description: QR code JSON data as string
 *                 example: '{"memberId":"M-2025-0142","name":"Jean Dupont","email":"jean.dupont@email.com","association":"MHM","validity":"2025","status":"Membre actif","signature":"abc123..."}'
 *     responses:
 *       200:
 *         description: QR code verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 valid:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 member:
 *                   type: object
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/verify', verifyQRCodeData);

/**
 * @swagger
 * /api/qrcodes/stats:
 *   get:
 *     summary: Get QR code statistics
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR code statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentYear:
 *                       type: string
 *                     totalMembers:
 *                       type: number
 *                     activeMembers:
 *                       type: number
 *                     membersWithQRCodes:
 *                       type: number
 *                     membersWithCurrentYearQRCodes:
 *                       type: number
 *                     activeMembersWithoutQRCodes:
 *                       type: number
 *                     coverage:
 *                       type: string
 *                     currentYearCoverage:
 *                       type: string
 *       500:
 *         description: Server error
 */
router.get('/stats', protect, authorize('admin'), getQRCodeStats);

/**
 * @swagger
 * /api/qrcodes/member/{memberId}:
 *   get:
 *     summary: Get member's QR code information
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member QR code information
 *       404:
 *         description: Member not found
 *       500:
 *         description: Server error
 */
router.get('/member/:memberId', protect, getMemberQRCode);

/**
 * @swagger
 * /api/qrcodes/scans:
 *   get:
 *     summary: Get scan history with filtering
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: memberId
 *         schema:
 *           type: string
 *         description: Filter by member ID
 *       - in: query
 *         name: memberNumber
 *         schema:
 *           type: string
 *         description: Filter by member number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [valid, expired, forged, invalid, disabled, not-found]
 *         description: Filter by scan status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter scans from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter scans until this date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 50
 *         description: Number of results to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: number
 *           default: 0
 *         description: Number of results to skip (pagination)
 *     responses:
 *       200:
 *         description: Scan history retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/scans', protect, authorize('admin'), getScanHistory);

/**
 * @swagger
 * /api/qrcodes/dashboard:
 *   get:
 *     summary: Get scan statistics and dashboard data
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, week, month, year]
 *           default: today
 *         description: Time period for statistics
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalScans:
 *                           type: number
 *                         validScans:
 *                           type: number
 *                         failedScans:
 *                           type: number
 *                         successRate:
 *                           type: string
 *                     scansByStatus:
 *                       type: array
 *                     scansByEmailStatus:
 *                       type: array
 *                     topScannedMembers:
 *                       type: array
 *                     scansOverTime:
 *                       type: array
 *                     recentScans:
 *                       type: array
 *       500:
 *         description: Server error
 */
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);

/**
 * @swagger
 * /api/qrcodes/member/{memberId}/scans:
 *   get:
 *     summary: Get scan history for a specific member
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Number of recent scans to return
 *     responses:
 *       200:
 *         description: Member scan history retrieved successfully
 *       404:
 *         description: Member not found
 *       500:
 *         description: Server error
 */
router.get('/member/:memberId/scans', protect, getMemberScanHistory);

/**
 * @swagger
 * /api/qrcodes/import-csv:
 *   post:
 *     summary: Import CSV file and send QR codes in bulk
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file with columns - memberId, name, email, status, validity
 *               validity:
 *                 type: string
 *                 description: Year of validity (optional, defaults to current year)
 *                 example: "2025"
 *     responses:
 *       200:
 *         description: Import completed successfully
 *       400:
 *         description: Invalid file or format
 *       500:
 *         description: Server error
 */
router.post('/import-csv', protect, authorize('admin'), upload.single('file'), importCSVAndSendQRCodes);

/**
 * @swagger
 * /api/qrcodes/batch/{batchId}/retry:
 *   post:
 *     summary: Retry failed sends from a batch
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Retry completed successfully
 *       404:
 *         description: Batch not found
 *       500:
 *         description: Server error
 */
router.post('/batch/:batchId/retry', protect, authorize('admin'), retryFailedSends);

/**
 * @swagger
 * /api/qrcodes/batches:
 *   get:
 *     summary: Get all batches with filtering
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, failed, partial]
 *         description: Filter by batch status
 *       - in: query
 *         name: batchType
 *         schema:
 *           type: string
 *           enum: [manual, csv-import, bulk-regenerate, yearly-renewal]
 *         description: Filter by batch type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Number of results to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: number
 *           default: 0
 *         description: Number of results to skip (pagination)
 *     responses:
 *       200:
 *         description: Batches retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/batches', protect, authorize('admin'), getBatches);

/**
 * @swagger
 * /api/qrcodes/batch/{batchId}:
 *   get:
 *     summary: Get single batch details
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Batch details retrieved successfully
 *       404:
 *         description: Batch not found
 *       500:
 *         description: Server error
 */
router.get('/batch/:batchId', protect, authorize('admin'), getBatchDetails);

/**
 * @swagger
 * /api/qrcodes/batches/stats:
 *   get:
 *     summary: Get batch statistics
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Batch statistics retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/batches/stats', protect, authorize('admin'), getBatchStats);

export default router;
