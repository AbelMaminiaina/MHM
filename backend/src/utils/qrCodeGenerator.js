import QRCode from 'qrcode';
import crypto from 'crypto';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate a unique member number
 * Format: MHM-YYYY-XXXXX (e.g., MHM-2024-00001)
 */
export const generateMemberNumber = async (Member) => {
  const year = new Date().getFullYear();
  const prefix = `MHM-${year}-`;

  // Get the count of members created this year
  const startOfYear = new Date(year, 0, 1);
  const count = await Member.countDocuments({
    createdAt: { $gte: startOfYear },
  });

  // Generate sequential number with padding
  const sequentialNumber = String(count + 1).padStart(5, '0');

  return `${prefix}${sequentialNumber}`;
};

/**
 * Generate a unique QR code for a member
 * @param {Object} memberData - Member information
 * @returns {Object} QR code data (code, imageUrl, buffer)
 */
export const generateMemberQRCode = async (memberData) => {
  try {
    // Create unique code for the member
    const uniqueCode = crypto.randomBytes(16).toString('hex');

    // Prepare member data to encode in QR
    const qrData = {
      id: memberData._id.toString(),
      memberNumber: memberData.memberNumber,
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      email: memberData.email,
      memberType: memberData.memberType,
      status: memberData.status,
      code: uniqueCode,
      generatedAt: new Date().toISOString(),
    };

    // Convert to JSON string
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
      code: uniqueCode,
      dataURL: qrCodeDataURL,
      buffer: qrCodeBuffer,
      data: qrData,
    };
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

/**
 * Save QR code image to file system
 * @param {Buffer} qrCodeBuffer - QR code image buffer
 * @param {string} memberId - Member ID
 * @returns {string} File path
 */
export const saveQRCodeToFile = async (qrCodeBuffer, memberId) => {
  try {
    // Create qrcodes directory if it doesn't exist
    const qrCodesDir = path.join(__dirname, '../../public/qrcodes');

    if (!fs.existsSync(qrCodesDir)) {
      fs.mkdirSync(qrCodesDir, { recursive: true });
    }

    // Generate filename
    const filename = `qr-${memberId}.png`;
    const filePath = path.join(qrCodesDir, filename);

    // Save file
    fs.writeFileSync(filePath, qrCodeBuffer);

    // Return relative URL
    return `/qrcodes/${filename}`;
  } catch (error) {
    throw new Error(`Failed to save QR code: ${error.message}`);
  }
};

/**
 * Verify QR code data
 * @param {string} qrCodeData - QR code content (JSON string)
 * @param {Object} Member - Member model
 * @returns {Object} Verification result
 */
export const verifyQRCode = async (qrCodeData, Member) => {
  try {
    // Parse QR code data
    const data = JSON.parse(qrCodeData);

    // Find member by ID and QR code
    const member = await Member.findOne({
      _id: data.id,
      'qrCode.code': data.code,
    });

    if (!member) {
      return {
        valid: false,
        message: 'QR code invalide ou membre non trouvé',
      };
    }

    // Check if member is active
    if (member.status !== 'active') {
      return {
        valid: false,
        message: `Membre non actif (statut: ${member.status})`,
        member: {
          fullName: member.fullName,
          memberNumber: member.memberNumber,
          status: member.status,
        },
      };
    }

    return {
      valid: true,
      message: 'QR code valide',
      member: {
        _id: member._id,
        fullName: member.fullName,
        memberNumber: member.memberNumber,
        email: member.email,
        memberType: member.memberType,
        status: member.status,
        membershipDate: member.membershipDate,
        photo: member.photo,
      },
    };
  } catch (error) {
    return {
      valid: false,
      message: 'Format de QR code invalide',
      error: error.message,
    };
  }
};

/**
 * Regenerate QR code for a member
 * @param {Object} member - Member document
 * @returns {Object} New QR code data
 */
export const regenerateQRCode = async (member) => {
  try {
    // Generate new QR code
    const qrCodeData = await generateMemberQRCode(member);

    // Save to file
    const imageUrl = await saveQRCodeToFile(qrCodeData.buffer, member._id);

    return {
      code: qrCodeData.code,
      imageUrl,
      generatedAt: new Date(),
    };
  } catch (error) {
    throw new Error(`Failed to regenerate QR code: ${error.message}`);
  }
};
