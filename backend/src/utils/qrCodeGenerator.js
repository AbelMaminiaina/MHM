import QRCode from 'qrcode';
import crypto from 'crypto';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import config from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate SHA-256 signature for QR code anti-fraud
 * @param {string} memberId - Member ID
 * @param {string} validity - Year of validity (e.g., "2025")
 * @returns {string} SHA-256 hash
 */
export const generateQRSignature = (memberId, validity) => {
  const secretKey = config.qrCodeSecretKey || 'default-secret-key-change-in-production';
  const dataToHash = `${memberId}${secretKey}${validity}`;
  return crypto.createHash('sha256').update(dataToHash).digest('hex');
};

/**
 * Generate a unique member number
 * Format: MHM-YYYY-XXXXX (e.g., MHM-2025-00142)
 */
export const generateMemberNumber = async (Member) => {
  const year = new Date().getFullYear();
  const prefix = `MHM-${year}-`;

  // Get the count of members created this year
  const startOfYear = new Date(year, 0, 1);
  const count = await Member.countDocuments({
    createdAt: { $gte: startOfYear },
  });

  // Generate sequential number with padding (5 digits)
  const sequentialNumber = String(count + 1).padStart(5, '0');

  return `${prefix}${sequentialNumber}`;
};

/**
 * Generate a unique QR code for a member with secure signature
 * @param {Object} memberData - Member information
 * @param {string} validity - Year of validity (optional, defaults to current year)
 * @returns {Object} QR code data (code, imageUrl, buffer)
 */
export const generateMemberQRCode = async (memberData, validity = null) => {
  try {
    // Use provided validity year or default to current year
    const validityYear = validity || new Date().getFullYear().toString();

    // Generate SHA-256 signature for anti-fraud
    const signature = generateQRSignature(memberData.memberNumber, validityYear);

    // Prepare member data to encode in QR (following the exact structure requested)
    const qrData = {
      memberId: memberData.memberNumber,
      name: `${memberData.firstName} ${memberData.lastName}`,
      email: memberData.email,
      association: 'MHM',
      validity: validityYear,
      status: memberData.status === 'active' ? 'Membre actif' : memberData.status,
      signature,
    };

    // Convert to compact JSON string
    const qrContent = JSON.stringify(qrData);

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrContent, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Generate QR code as buffer for file storage
    const qrCodeBuffer = await QRCode.toBuffer(qrContent, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 400,
      margin: 2,
    });

    return {
      code: signature.substring(0, 16), // Use first 16 chars of signature as code
      dataURL: qrCodeDataURL,
      buffer: qrCodeBuffer,
      data: qrData,
      signature,
      validity: validityYear,
    };
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

/**
 * Save QR code image to file system
 * @param {Buffer} qrCodeBuffer - QR code image buffer
 * @param {string} memberId - Member ID (member number)
 * @returns {string} File path or null if in serverless environment
 */
export const saveQRCodeToFile = async (qrCodeBuffer, memberId) => {
  try {
    // Determine if we're in a serverless/read-only environment
    const isServerless =
      process.env.VERCEL === '1' ||
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.FUNCTION_NAME ||
      process.env.DISABLE_FILE_LOGGING === 'true' ||
      process.env.NOW_REGION ||
      process.env.LAMBDA_TASK_ROOT;

    // In serverless environments, skip file saving (use cloud storage instead)
    if (isServerless) {
      console.warn(
        'Skipping QR code file save in serverless environment. Consider using cloud storage (S3, Cloudinary, etc.)'
      );
      return null;
    }

    // Create qrcodes directory if it doesn't exist
    const qrCodesDir = path.join(__dirname, '../../public/qrcodes');

    if (!fs.existsSync(qrCodesDir)) {
      fs.mkdirSync(qrCodesDir, { recursive: true });
    }

    // Generate filename with format: qr_<memberId>.png
    const filename = `qr_${memberId}.png`;
    const filePath = path.join(qrCodesDir, filename);

    // Save file
    fs.writeFileSync(filePath, qrCodeBuffer);

    // Return relative URL
    return `/qrcodes/${filename}`;
  } catch (error) {
    console.error(`Failed to save QR code: ${error.message}`);
    return null; // Return null instead of throwing to prevent crashes
  }
};

/**
 * Verify QR code data with SHA-256 signature validation
 * @param {string} qrCodeData - QR code content (JSON string)
 * @param {Object} Member - Member model
 * @param {Object} options - Additional options (incrementScan, trackScan)
 * @returns {Object} Standardized verification result
 */
export const verifyQRCode = async (qrCodeData, Member, options = {}) => {
  const { incrementScan = false } = options;

  try {
    // Parse QR code data
    const data = JSON.parse(qrCodeData);

    // Verify required fields (structure validation)
    if (!data.memberId || !data.signature || !data.validity) {
      return {
        memberId: data.memberId || 'unknown',
        name: data.name || 'Unknown',
        emailStatus: 'not-found',
        status: 'invalid',
        message: '❌ Structure invalide : données obligatoires manquantes',
        details: {
          hasMemberId: !!data.memberId,
          hasSignature: !!data.signature,
          hasValidity: !!data.validity,
        },
      };
    }

    // Verify signature
    const expectedSignature = generateQRSignature(data.memberId, data.validity);
    if (data.signature !== expectedSignature) {
      return {
        memberId: data.memberId,
        name: data.name || 'Unknown',
        emailStatus: 'not-found',
        status: 'forged',
        message: '❌ QR falsifié : signature incorrecte (possible fraude)',
        details: {
          providedSignature: `${data.signature.substring(0, 16)}...`,
          expectedSignature: `${expectedSignature.substring(0, 16)}...`,
        },
      };
    }

    // Find member by member number
    const member = await Member.findOne({
      memberNumber: data.memberId,
    });

    if (!member) {
      return {
        memberId: data.memberId,
        name: data.name || 'Unknown',
        emailStatus: 'not-found',
        status: 'not-found',
        message: '❌ QR Code non trouvé : membre non trouvé dans la base de données',
      };
    }

    // Determine email status
    const emailStatus = member.qrCode?.emailStatus || 'not-found';

    // Check if QR code is still valid (check year)
    const currentYear = new Date().getFullYear().toString();
    if (data.validity !== currentYear) {
      return {
        memberId: member.memberNumber,
        name: member.fullName,
        emailStatus,
        status: 'expired',
        message: `❌ Adhésion expirée (valide pour ${data.validity}, année actuelle: ${currentYear})`,
        member: {
          _id: member._id,
          fullName: member.fullName,
          memberNumber: member.memberNumber,
          memberType: member.memberType,
          status: member.status,
          validity: data.validity,
        },
      };
    }

    // Check if member is active
    if (member.status !== 'active') {
      return {
        memberId: member.memberNumber,
        name: member.fullName,
        emailStatus,
        status: 'disabled',
        message: `❌ Membre désactivé (statut: ${member.status})`,
        member: {
          _id: member._id,
          fullName: member.fullName,
          memberNumber: member.memberNumber,
          memberType: member.memberType,
          status: member.status,
        },
      };
    }

    // Increment scan count if requested
    if (incrementScan && member.qrCode) {
      member.qrCode.scanCount = (member.qrCode.scanCount || 0) + 1;
      member.qrCode.lastScannedAt = new Date();
      await member.save();
    }

    // Check email status and provide appropriate message
    let statusMessage = '✅ Membre valide';
    if (emailStatus === 'pending' || emailStatus === 'not-generated') {
      statusMessage = '✅ Valide mais email non confirmé';
    }

    return {
      memberId: member.memberNumber,
      name: member.fullName,
      emailStatus,
      status: 'valid',
      message: statusMessage,
      member: {
        _id: member._id,
        fullName: member.fullName,
        memberNumber: member.memberNumber,
        email: member.email,
        memberType: member.memberType,
        status: member.status,
        membershipDate: member.membershipDate,
        validity: data.validity,
        qrCode: {
          scanCount: member.qrCode?.scanCount || 0,
          lastScannedAt: member.qrCode?.lastScannedAt,
          emailStatus: member.qrCode?.emailStatus,
          emailSentAt: member.qrCode?.emailSentAt,
        },
      },
    };
  } catch (error) {
    return {
      memberId: 'unknown',
      name: 'Unknown',
      emailStatus: 'not-found',
      status: 'invalid',
      message: '❌ Structure invalide : format de QR code invalide',
      error: error.message,
    };
  }
};

/**
 * Regenerate QR code for a member with validity year
 * @param {Object} member - Member document
 * @param {string} validity - Year of validity (optional, defaults to current year)
 * @returns {Object} New QR code data
 */
export const regenerateQRCode = async (member, validity = null) => {
  try {
    // Generate new QR code with validity
    const qrCodeData = await generateMemberQRCode(member, validity);

    // Save to file using member number
    const imageUrl = await saveQRCodeToFile(qrCodeData.buffer, member.memberNumber);

    return {
      code: qrCodeData.code,
      imageUrl,
      generatedAt: new Date(),
      signature: qrCodeData.signature,
      validity: qrCodeData.validity,
    };
  } catch (error) {
    throw new Error(`Failed to regenerate QR code: ${error.message}`);
  }
};
