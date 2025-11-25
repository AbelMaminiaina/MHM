import csv from 'csv-parser';
import fs from 'fs';
import Member from '../models/Member.js';
import QRCodeScan from '../models/QRCodeScan.js';
import QRCodeBatch from '../models/QRCodeBatch.js';
import {
  generateAndSendQRCode,
  bulkGenerateAndSendQRCodes,
  regenerateQRCodesForNewYear,
} from '../utils/qrCodeService.js';
import { verifyQRCode } from '../utils/qrCodeGenerator.js';
import logger from '../config/logger.js';

/**
 * Generate and send QR code for a single member
 * @route POST /api/qrcodes/generate/:memberId
 * @access Private (Admin)
 */
export const generateQRCodeForMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { validity } = req.body;

    // Find member
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    // Generate and send QR code
    const result = await generateAndSendQRCode(member, validity);

    res.status(200).json({
      success: true,
      message: 'QR code generated and sent successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Error in generateQRCodeForMember:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate QR code',
    });
  }
};

/**
 * Bulk generate and send QR codes
 * @route POST /api/qrcodes/bulk-generate
 * @access Private (Admin)
 */
export const bulkGenerateQRCodes = async (req, res) => {
  try {
    const { validity, status, memberIds } = req.body;

    const result = await bulkGenerateAndSendQRCodes({
      validity,
      status,
      memberIds,
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    logger.error('Error in bulkGenerateQRCodes:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate QR codes in bulk',
    });
  }
};

/**
 * Regenerate QR codes for a new year
 * @route POST /api/qrcodes/regenerate-year
 * @access Private (Admin)
 */
export const regenerateForNewYear = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: 'Year is required',
      });
    }

    const result = await regenerateQRCodesForNewYear(year);

    res.status(200).json({
      success: true,
      message: `QR codes regenerated successfully for year ${year}`,
      data: result,
    });
  } catch (error) {
    logger.error('Error in regenerateForNewYear:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to regenerate QR codes',
    });
  }
};

/**
 * Verify a QR code with scan logging
 * @route POST /api/qrcodes/verify
 * @access Public
 */
export const verifyQRCodeData = async (req, res) => {
  try {
    const { qrData, location, eventId, trackScan = true } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR code data is required',
      });
    }

    // Verify the QR code with scan increment
    const result = await verifyQRCode(qrData, Member, { incrementScan: trackScan });

    // Log the scan if tracking is enabled
    if (trackScan) {
      try {
        const scanLog = new QRCodeScan({
          member: result.member?._id || null,
          memberNumber: result.memberId,
          scanStatus: result.status,
          scanMessage: result.message,
          emailStatus: result.emailStatus,
          qrData: JSON.parse(qrData),
          scannedBy: req.user?._id || null,
          location: location || null,
          eventId: eventId || null,
          deviceInfo: {
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip || req.connection.remoteAddress,
          },
        });

        await scanLog.save();

        logger.info('QR code scan logged', {
          memberId: result.memberId,
          status: result.status,
          emailStatus: result.emailStatus,
        });
      } catch (scanLogError) {
        // Don't fail the verification if logging fails
        logger.error('Failed to log QR code scan:', scanLogError);
      }
    }

    // Return standardized response
    res.status(200).json({
      success: true,
      data: {
        memberId: result.memberId,
        name: result.name,
        emailStatus: result.emailStatus,
        status: result.status,
        message: result.message,
        member: result.member || null,
        details: result.details || null,
      },
    });
  } catch (error) {
    logger.error('Error in verifyQRCodeData:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify QR code',
    });
  }
};

/**
 * Get QR code statistics
 * @route GET /api/qrcodes/stats
 * @access Private (Admin)
 */
export const getQRCodeStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear().toString();

    // Count members with QR codes
    const totalMembers = await Member.countDocuments();
    const membersWithQRCodes = await Member.countDocuments({
      'qrCode.code': { $exists: true, $ne: null },
    });
    const membersWithCurrentYearQRCodes = await Member.countDocuments({
      'qrCode.validity': currentYear,
    });
    const activeMembers = await Member.countDocuments({ status: 'active' });
    const activeMembersWithoutQRCodes = await Member.countDocuments({
      status: 'active',
      'qrCode.code': { $exists: false },
    });

    res.status(200).json({
      success: true,
      data: {
        currentYear,
        totalMembers,
        activeMembers,
        membersWithQRCodes,
        membersWithCurrentYearQRCodes,
        activeMembersWithoutQRCodes,
        coverage: totalMembers > 0 ? ((membersWithQRCodes / totalMembers) * 100).toFixed(2) : 0,
        currentYearCoverage:
          activeMembers > 0
            ? ((membersWithCurrentYearQRCodes / activeMembers) * 100).toFixed(2)
            : 0,
      },
    });
  } catch (error) {
    logger.error('Error in getQRCodeStats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get QR code statistics',
    });
  }
};

/**
 * Get member's QR code info
 * @route GET /api/qrcodes/member/:memberId
 * @access Private
 */
export const getMemberQRCode = async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await Member.findById(memberId).select(
      'qrCode memberNumber firstName lastName email status'
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        memberNumber: member.memberNumber,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        status: member.status,
        qrCode: member.qrCode,
      },
    });
  } catch (error) {
    logger.error('Error in getMemberQRCode:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get member QR code',
    });
  }
};

/**
 * Get scan history/logs with filtering
 * @route GET /api/qrcodes/scans
 * @access Private (Admin)
 */
export const getScanHistory = async (req, res) => {
  try {
    const {
      memberId,
      memberNumber,
      status,
      startDate,
      endDate,
      limit = 50,
      skip = 0,
      sortBy = '-scannedAt',
    } = req.query;

    // Build query
    const query = {};

    if (memberId) {
      query.member = memberId;
    }

    if (memberNumber) {
      query.memberNumber = memberNumber;
    }

    if (status) {
      query.scanStatus = status;
    }

    if (startDate || endDate) {
      query.scannedAt = {};
      if (startDate) {
        query.scannedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.scannedAt.$lte = new Date(endDate);
      }
    }

    // Execute query
    const scans = await QRCodeScan.find(query)
      .populate('member', 'firstName lastName memberNumber email status')
      .populate('scannedBy', 'firstName lastName email')
      .sort(sortBy)
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 10));

    const totalScans = await QRCodeScan.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        scans,
        pagination: {
          total: totalScans,
          limit: parseInt(limit, 10),
          skip: parseInt(skip, 10),
          hasMore: totalScans > parseInt(skip, 10) + parseInt(limit, 10),
        },
      },
    });
  } catch (error) {
    logger.error('Error in getScanHistory:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get scan history',
    });
  }
};

/**
 * Get scan statistics and dashboard data
 * @route GET /api/qrcodes/dashboard
 * @access Private (Admin)
 */
export const getDashboardStats = async (req, res) => {
  try {
    const { period = 'today' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    // Total scans in period
    const totalScans = await QRCodeScan.countDocuments({
      scannedAt: { $gte: startDate },
    });

    // Scans by status
    const scansByStatus = await QRCodeScan.aggregate([
      { $match: { scannedAt: { $gte: startDate } } },
      { $group: { _id: '$scanStatus', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Scans by email status
    const scansByEmailStatus = await QRCodeScan.aggregate([
      { $match: { scannedAt: { $gte: startDate } } },
      { $group: { _id: '$emailStatus', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Most scanned members (top 10)
    const topScannedMembers = await QRCodeScan.aggregate([
      { $match: { scannedAt: { $gte: startDate }, member: { $ne: null } } },
      { $group: { _id: '$member', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'members',
          localField: '_id',
          foreignField: '_id',
          as: 'memberInfo',
        },
      },
      { $unwind: '$memberInfo' },
      {
        $project: {
          memberId: '$_id',
          memberNumber: '$memberInfo.memberNumber',
          fullName: {
            $concat: ['$memberInfo.firstName', ' ', '$memberInfo.lastName'],
          },
          count: 1,
        },
      },
    ]);

    // Scans over time (daily breakdown for the period)
    const scansOverTime = await QRCodeScan.aggregate([
      { $match: { scannedAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$scannedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent scans (last 20)
    const recentScans = await QRCodeScan.find({ scannedAt: { $gte: startDate } })
      .populate('member', 'firstName lastName memberNumber email')
      .sort('-scannedAt')
      .limit(20);

    // Failed scans (invalid, forged, expired, etc.)
    const failedScansCount = await QRCodeScan.countDocuments({
      scannedAt: { $gte: startDate },
      scanStatus: { $in: ['invalid', 'forged', 'expired', 'disabled', 'not-found'] },
    });

    res.status(200).json({
      success: true,
      data: {
        period,
        startDate,
        summary: {
          totalScans,
          validScans: scansByStatus.find((s) => s._id === 'valid')?.count || 0,
          failedScans: failedScansCount,
          successRate:
            totalScans > 0 ? (((totalScans - failedScansCount) / totalScans) * 100).toFixed(2) : 0,
        },
        scansByStatus: scansByStatus.map((s) => ({
          status: s._id,
          count: s.count,
          percentage: totalScans > 0 ? ((s.count / totalScans) * 100).toFixed(2) : 0,
        })),
        scansByEmailStatus: scansByEmailStatus.map((s) => ({
          status: s._id,
          count: s.count,
          percentage: totalScans > 0 ? ((s.count / totalScans) * 100).toFixed(2) : 0,
        })),
        topScannedMembers,
        scansOverTime,
        recentScans,
      },
    });
  } catch (error) {
    logger.error('Error in getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get dashboard statistics',
    });
  }
};

/**
 * Get member scan history
 * @route GET /api/qrcodes/member/:memberId/scans
 * @access Private
 */
export const getMemberScanHistory = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { limit = 20 } = req.query;

    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    const scans = await QRCodeScan.find({ member: memberId })
      .sort('-scannedAt')
      .limit(parseInt(limit, 10));

    const scanStats = {
      totalScans: member.qrCode?.scanCount || 0,
      lastScannedAt: member.qrCode?.lastScannedAt,
      validScans: await QRCodeScan.countDocuments({
        member: memberId,
        scanStatus: 'valid',
      }),
      recentScans: scans,
    };

    res.status(200).json({
      success: true,
      data: {
        member: {
          _id: member._id,
          memberNumber: member.memberNumber,
          fullName: member.fullName,
          email: member.email,
          status: member.status,
        },
        scanStats,
      },
    });
  } catch (error) {
    logger.error('Error in getMemberScanHistory:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get member scan history',
    });
  }
};

/**
 * Import members from CSV and send QR codes in bulk
 * @route POST /api/qrcodes/import-csv
 * @access Private (Admin)
 */
export const importCSVAndSendQRCodes = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un fichier CSV',
      });
    }

    const { validity } = req.body;
    const validityYear = validity || new Date().getFullYear().toString();

    // Create batch record
    const batch = await QRCodeBatch.create({
      batchName: `Import CSV - ${req.file.originalname}`,
      batchType: 'csv-import',
      validity: validityYear,
      status: 'pending',
      totalMembers: 0,
      csvFilename: req.file.originalname,
      createdBy: req.user?._id,
    });

    const members = [];
    const errors = [];

    // Parse CSV file
    const stream = fs.createReadStream(req.file.path).pipe(csv());

    stream.on('data', (row) => {
      // Expected CSV columns: memberNumber,firstName,lastName,dateOfBirth,email,phone,address,status,memberType,cin,entite,responsabilite,validity
      try {
        const memberData = {
          memberNumber: row.memberId || row.memberNumber,
          firstName: row.firstName,
          lastName: row.lastName,
          dateOfBirth: row.dateOfBirth,
          email: row.email,
          phone: row.phone,
          address: row.address,
          status: row.status || 'active',
          memberType: row.memberType || 'regular',
          validity: row.validity || validityYear,
          // Extra fields (optionnels)
          cin: row.cin,
          entite: row.entite,
          responsabilite: row.responsabilite,
        };

        // Validate required fields
        if (!memberData.memberNumber || !memberData.email) {
          errors.push({
            row,
            error: 'memberNumber et email sont requis',
          });
        } else if (!memberData.firstName || !memberData.lastName || !memberData.dateOfBirth) {
          errors.push({
            row,
            error: 'firstName, lastName et dateOfBirth sont requis',
          });
        } else {
          members.push(memberData);
        }
      } catch (error) {
        errors.push({ row, error: error.message });
      }
    });

    stream.on('end', async () => {
      try {
        // Update batch with total members
        batch.totalMembers = members.length;
        batch.status = 'processing';
        batch.startedAt = new Date();
        await batch.save();

        logger.info(`Starting CSV import batch ${batch._id}: ${members.length} members`);

        // Process each member
        for (const memberData of members) {
          try {
            // Find member by memberNumber or email
            let member = await Member.findOne({
              $or: [{ memberNumber: memberData.memberNumber }, { email: memberData.email }],
            });

            // If member doesn't exist, CREATE IT
            if (!member) {
              try {
                logger.info(`Creating new member: ${memberData.firstName} ${memberData.lastName}`);

                member = await Member.create({
                  firstName: memberData.firstName,
                  lastName: memberData.lastName,
                  dateOfBirth: new Date(memberData.dateOfBirth),
                  email: memberData.email,
                  phone: memberData.phone || '',
                  address: {
                    full: memberData.address || 'Madagascar',
                    country: 'Madagascar',
                  },
                  status: memberData.status,
                  memberType: memberData.memberType,
                  memberNumber: memberData.memberNumber,
                  notes: `CIN: ${memberData.cin || 'N/A'}, Entité: ${memberData.entite || 'N/A'}, Responsabilité: ${memberData.responsabilite || 'N/A'}`,
                });

                logger.info(`✅ Member created: ${member._id} - ${member.fullName}`);
              } catch (createError) {
                logger.error(`❌ Failed to create member ${memberData.memberNumber}:`, createError);
                batch.results.push({
                  memberNumber: memberData.memberNumber,
                  name: `${memberData.firstName} ${memberData.lastName}`,
                  email: memberData.email,
                  status: 'failed',
                  qrGenerated: false,
                  emailSent: false,
                  error: `Échec création: ${createError.message}`,
                });
                batch.failedSends += 1;
                batch.processedMembers += 1;
                await batch.save();
                continue; // Skip to next member
              }
            }

            // Now generate and send QR code
            try {
              const result = await generateAndSendQRCode(member, validityYear);

              batch.results.push({
                member: member._id,
                memberNumber: member.memberNumber,
                name: member.fullName,
                email: member.email,
                status: 'success',
                qrGenerated: result.success,
                emailSent: result.emailSent,
                emailStatus: member.qrCode?.emailStatus,
              });

              batch.successfulSends += 1;
            } catch (sendError) {
              batch.results.push({
                member: member._id,
                memberNumber: member.memberNumber,
                name: member.fullName,
                email: member.email,
                status: 'failed',
                qrGenerated: false,
                emailSent: false,
                error: sendError.message,
              });
              batch.failedSends += 1;
            }

            batch.processedMembers += 1;
            await batch.save();
          } catch (memberError) {
            logger.error('Error processing member:', memberError);
            batch.failedSends += 1;
          }
        }

        // Mark batch as completed
        batch.status = batch.failedSends === 0 ? 'completed' : 'partial';
        batch.completedAt = new Date();
        await batch.save();

        // Delete uploaded file
        fs.unlinkSync(req.file.path);

        logger.info(
          `Batch ${batch._id} completed: ${batch.successfulSends} success, ${batch.failedSends} failed`
        );

        res.status(200).json({
          success: true,
          message: `Import terminé: ${batch.successfulSends} envoyés, ${batch.failedSends} échecs`,
          data: batch,
        });
      } catch (processingError) {
        logger.error('Error processing CSV batch:', processingError);
        batch.status = 'failed';
        await batch.save();

        res.status(500).json({
          success: false,
          message: 'Erreur lors du traitement du fichier CSV',
          error: processingError.message,
        });
      }
    });

    stream.on('error', async (error) => {
      logger.error('CSV parsing error:', error);
      batch.status = 'failed';
      await batch.save();

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la lecture du fichier CSV',
        error: error.message,
      });
    });
  } catch (error) {
    logger.error('Error in importCSVAndSendQRCodes:', error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to import CSV and send QR codes',
    });
  }
};

/**
 * Retry failed sends from a batch
 * @route POST /api/qrcodes/batch/:batchId/retry
 * @access Private (Admin)
 */
export const retryFailedSends = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await QRCodeBatch.findById(batchId);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch non trouvé',
      });
    }

    // Find all failed results
    const failedResults = batch.results.filter((r) => r.status === 'failed' && r.member);

    if (failedResults.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun envoi échoué à relancer',
      });
    }

    batch.status = 'processing';
    batch.retryCount += 1;
    batch.lastRetryAt = new Date();
    await batch.save();

    logger.info(`Retrying ${failedResults.length} failed sends from batch ${batch._id}`);

    let retriedSuccess = 0;
    let retriedFailed = 0;

    // Retry each failed send
    for (const failedResult of failedResults) {
      try {
        const member = await Member.findById(failedResult.member);

        if (!member) {
          retriedFailed += 1;
          continue;
        }

        const result = await generateAndSendQRCode(member, batch.validity);

        // Update result in batch
        const resultIndex = batch.results.findIndex(
          (r) => r.member && r.member.toString() === member._id.toString()
        );

        if (resultIndex !== -1) {
          batch.results[resultIndex] = {
            ...batch.results[resultIndex],
            status: result.emailSent ? 'success' : 'failed',
            qrGenerated: result.success,
            emailSent: result.emailSent,
            emailStatus: member.qrCode?.emailStatus,
            error: result.emailSent ? null : 'Email non envoyé',
            processedAt: new Date(),
          };

          if (result.emailSent) {
            batch.successfulSends += 1;
            batch.failedSends -= 1;
            retriedSuccess += 1;
          } else {
            retriedFailed += 1;
          }
        }
      } catch (error) {
        logger.error('Retry error:', error);
        retriedFailed += 1;
      }
    }

    batch.status = batch.failedSends === 0 ? 'completed' : 'partial';
    await batch.save();

    res.status(200).json({
      success: true,
      message: `Relance terminée: ${retriedSuccess} succès, ${retriedFailed} échecs`,
      data: {
        batch,
        retriedSuccess,
        retriedFailed,
      },
    });
  } catch (error) {
    logger.error('Error in retryFailedSends:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retry failed sends',
    });
  }
};

/**
 * Get all batches with filtering
 * @route GET /api/qrcodes/batches
 * @access Private (Admin)
 */
export const getBatches = async (req, res) => {
  try {
    const { status, batchType, limit = 20, skip = 0, sortBy = '-createdAt' } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (batchType) {
      query.batchType = batchType;
    }

    const batches = await QRCodeBatch.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort(sortBy)
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 10));

    const totalBatches = await QRCodeBatch.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        batches,
        pagination: {
          total: totalBatches,
          limit: parseInt(limit, 10),
          skip: parseInt(skip, 10),
          hasMore: totalBatches > parseInt(skip, 10) + parseInt(limit, 10),
        },
      },
    });
  } catch (error) {
    logger.error('Error in getBatches:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get batches',
    });
  }
};

/**
 * Get single batch details
 * @route GET /api/qrcodes/batch/:batchId
 * @access Private (Admin)
 */
export const getBatchDetails = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await QRCodeBatch.findById(batchId).populate(
      'createdBy',
      'firstName lastName email'
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    logger.error('Error in getBatchDetails:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get batch details',
    });
  }
};

/**
 * Get batch statistics
 * @route GET /api/qrcodes/batches/stats
 * @access Private (Admin)
 */
export const getBatchStats = async (req, res) => {
  try {
    const totalBatches = await QRCodeBatch.countDocuments();
    const completedBatches = await QRCodeBatch.countDocuments({ status: 'completed' });
    const failedBatches = await QRCodeBatch.countDocuments({ status: 'failed' });
    const processingBatches = await QRCodeBatch.countDocuments({ status: 'processing' });

    // Aggregate total sends
    const sendStats = await QRCodeBatch.aggregate([
      {
        $group: {
          _id: null,
          totalSends: { $sum: '$successfulSends' },
          totalFails: { $sum: '$failedSends' },
          totalProcessed: { $sum: '$processedMembers' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBatches,
        completedBatches,
        failedBatches,
        processingBatches,
        totalSends: sendStats[0]?.totalSends || 0,
        totalFails: sendStats[0]?.totalFails || 0,
        totalProcessed: sendStats[0]?.totalProcessed || 0,
        successRate:
          sendStats[0]?.totalProcessed > 0
            ? ((sendStats[0].totalSends / sendStats[0].totalProcessed) * 100).toFixed(2)
            : 0,
      },
    });
  } catch (error) {
    logger.error('Error in getBatchStats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get batch statistics',
    });
  }
};

export default {
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
};
