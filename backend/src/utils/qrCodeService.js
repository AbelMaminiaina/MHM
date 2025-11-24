import Member from '../models/Member.js';
import { generateMemberQRCode, saveQRCodeToFile } from './qrCodeGenerator.js';
import { sendEmail } from './emailService.js';
import logger from '../config/logger.js';

/**
 * Generate QR code and send email for a single member
 * @param {Object} member - Member document
 * @param {string} validity - Year of validity (optional, defaults to current year)
 * @returns {Object} Result with success status and details
 */
export const generateAndSendQRCode = async (member, validity = null) => {
  try {
    // Validate member has required fields
    if (!member.email) {
      throw new Error('Member email is required');
    }

    if (!member.memberNumber) {
      throw new Error('Member number is required');
    }

    // Use provided validity or default to current year
    const validityYear = validity || new Date().getFullYear().toString();

    // Generate QR code
    const qrCodeData = await generateMemberQRCode(member, validityYear);

    // Save QR code to file
    const imageUrl = await saveQRCodeToFile(qrCodeData.buffer, member.memberNumber);

    // Update member with QR code info (set email status to pending initially)
    member.qrCode = {
      code: qrCodeData.code,
      imageUrl,
      generatedAt: new Date(),
      signature: qrCodeData.signature,
      validity: validityYear,
      emailStatus: 'pending',
      scanCount: member.qrCode?.scanCount || 0,
      lastScannedAt: member.qrCode?.lastScannedAt,
    };
    await member.save();

    // Send email with QR code
    let emailResult;
    try {
      emailResult = await sendQRCodeEmail(member, qrCodeData);

      // Update email status based on result
      member.qrCode.emailStatus = emailResult.success ? 'sent' : 'failed';
      if (emailResult.success) {
        member.qrCode.emailSentAt = new Date();
      }
      await member.save();
    } catch (emailError) {
      // Mark email as failed
      member.qrCode.emailStatus = 'failed';
      await member.save();
      emailResult = { success: false, error: emailError.message };
    }

    logger.info(`QR code generated and sent for member ${member.memberNumber}`, {
      memberId: member._id,
      memberNumber: member.memberNumber,
      validity: validityYear,
    });

    return {
      success: true,
      memberId: member._id,
      memberNumber: member.memberNumber,
      email: member.email,
      emailSent: emailResult.success,
      validity: validityYear,
    };
  } catch (error) {
    logger.error(`Failed to generate and send QR code for member ${member.memberNumber}:`, error);
    throw error;
  }
};

/**
 * Send QR code email to a member
 * @param {Object} member - Member document
 * @param {Object} qrCodeData - QR code data with buffer
 * @returns {Promise<Object>} Send result
 */
export const sendQRCodeEmail = async (member, qrCodeData) => {
  const subject = `Votre QR Code Membre ${qrCodeData.validity} - MHM`;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Votre QR Code Membre</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .email-container {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 3px solid #4CAF50;
        }
        .header h1 {
          color: #4CAF50;
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 30px 0;
        }
        .member-info {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .member-info p {
          margin: 10px 0;
        }
        .member-info strong {
          color: #4CAF50;
          display: inline-block;
          width: 150px;
        }
        .qr-section {
          text-align: center;
          margin: 30px 0;
          padding: 20px;
          background-color: #f0f8ff;
          border-radius: 8px;
        }
        .qr-section h2 {
          color: #2196F3;
          margin-top: 0;
        }
        .qr-section img {
          max-width: 300px;
          margin: 20px auto;
          display: block;
          border: 3px solid #2196F3;
          border-radius: 8px;
          padding: 10px;
          background-color: white;
        }
        .validity-badge {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          margin: 10px 0;
        }
        .instructions {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
        }
        .instructions h3 {
          margin-top: 0;
          color: #856404;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #e0e0e0;
          color: #666;
          font-size: 14px;
        }
        .footer a {
          color: #4CAF50;
          text-decoration: none;
        }
        .security-note {
          background-color: #e3f2fd;
          border-left: 4px solid #2196F3;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Votre QR Code Membre ${qrCodeData.validity}</h1>
          <p>MHM - Madagasikara Hoan'ny Malagasy</p>
        </div>

        <div class="content">
          <p>Bonjour ${member.firstName} ${member.lastName},</p>

          <p>Votre QR Code membre pour l'année <strong>${qrCodeData.validity}</strong> a été généré avec succès. Vous trouverez ci-dessous votre QR Code personnel sécurisé.</p>

          <div class="member-info">
            <h3>📋 Vos informations</h3>
            <p><strong>Numéro de membre :</strong> ${member.memberNumber}</p>
            <p><strong>Nom complet :</strong> ${member.firstName} ${member.lastName}</p>
            <p><strong>Email :</strong> ${member.email}</p>
            <p><strong>Association :</strong> MHM</p>
            <p><strong>Statut :</strong> <span style="color: #4CAF50; font-weight: bold;">Membre actif</span></p>
          </div>

          <div class="qr-section">
            <h2>🎫 Votre QR Code Personnel</h2>
            <div class="validity-badge">Valable pour l'année ${qrCodeData.validity}</div>
            <img src="cid:qrcode" alt="QR Code Membre" />
            <p style="color: #666; font-size: 14px;">
              Signature sécurisée : <code style="background-color: #e0e0e0; padding: 2px 8px; border-radius: 3px; font-size: 11px;">${qrCodeData.signature.substring(0, 16)}...</code>
            </p>
          </div>

          <div class="instructions">
            <h3>📱 Comment utiliser votre QR code ?</h3>
            <ul>
              <li>Sauvegardez ce QR code sur votre téléphone</li>
              <li>Présentez-le lors de votre arrivée aux événements de l'association</li>
              <li>Il peut être scanné directement depuis votre écran</li>
              <li>Gardez une copie imprimée en cas de besoin</li>
              <li>Ce QR code est valable pour toute l'année ${qrCodeData.validity}</li>
            </ul>
          </div>

          <div class="security-note">
            <h3 style="margin-top: 0;">🔒 Sécurité</h3>
            <p style="margin: 0;">Votre QR code contient une signature numérique sécurisée (SHA-256) qui garantit son authenticité. Ne partagez pas votre QR code avec des tiers non autorisés.</p>
          </div>

          <p>Nous sommes heureux de vous compter parmi nos membres pour l'année ${qrCodeData.validity} !</p>

          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        </div>

        <div class="footer">
          <p><strong>MHM - Madagasikara Hoan'ny Malagasy</strong></p>
          <p>Email : contact@madagasikarahoanymalagasy.org</p>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Prepare attachments with QR code
  const attachments = [
    {
      filename: `qr_${member.memberNumber}.png`,
      content: qrCodeData.buffer,
      cid: 'qrcode', // Content ID for embedding in HTML
    },
  ];

  return sendEmail({
    to: member.email,
    subject,
    html,
    attachments,
  });
};

/**
 * Generate and send QR codes for multiple members (bulk operation)
 * @param {Object} options - Options for bulk generation
 * @param {string} options.validity - Year of validity (optional, defaults to current year)
 * @param {string} options.status - Filter by member status (optional, defaults to 'active')
 * @param {Array<string>} options.memberIds - Specific member IDs to process (optional)
 * @returns {Object} Summary of bulk operation
 */
export const bulkGenerateAndSendQRCodes = async (options = {}) => {
  const { validity = null, status = 'active', memberIds = null } = options;

  const validityYear = validity || new Date().getFullYear().toString();

  try {
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (memberIds && Array.isArray(memberIds) && memberIds.length > 0) {
      query._id = { $in: memberIds };
    }

    // Find members
    const members = await Member.find(query);

    if (members.length === 0) {
      return {
        success: true,
        message: 'No members found matching criteria',
        processed: 0,
        successful: 0,
        failed: 0,
        results: [],
      };
    }

    logger.info(`Starting bulk QR code generation for ${members.length} members`, {
      validity: validityYear,
      status,
      memberCount: members.length,
    });

    const results = [];
    let successful = 0;
    let failed = 0;

    // Process each member
    for (const member of members) {
      try {
        const result = await generateAndSendQRCode(member, validityYear);
        results.push(result);
        successful += 1;
      } catch (error) {
        results.push({
          success: false,
          memberId: member._id,
          memberNumber: member.memberNumber,
          email: member.email,
          error: error.message,
        });
        failed += 1;
        logger.error(`Failed to process member ${member.memberNumber}:`, error);
      }
    }

    logger.info(`Bulk QR code generation completed`, {
      total: members.length,
      successful,
      failed,
      validity: validityYear,
    });

    return {
      success: true,
      message: `Processed ${members.length} members: ${successful} successful, ${failed} failed`,
      processed: members.length,
      successful,
      failed,
      validity: validityYear,
      results,
    };
  } catch (error) {
    logger.error('Bulk QR code generation failed:', error);
    throw new Error(`Bulk operation failed: ${error.message}`);
  }
};

/**
 * Regenerate QR codes for all members for a new year
 * @param {string} newYear - The new year for QR codes (e.g., "2026")
 * @returns {Object} Summary of regeneration
 */
export const regenerateQRCodesForNewYear = async (newYear) => {
  if (!newYear || !/^\d{4}$/.test(newYear)) {
    throw new Error('Invalid year format. Please provide a 4-digit year (e.g., "2025")');
  }

  logger.info(`Starting QR code regeneration for year ${newYear}`);

  return bulkGenerateAndSendQRCodes({
    validity: newYear,
    status: 'active',
  });
};

export default {
  generateAndSendQRCode,
  sendQRCodeEmail,
  bulkGenerateAndSendQRCodes,
  regenerateQRCodesForNewYear,
};
