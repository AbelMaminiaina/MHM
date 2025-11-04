import nodemailer from 'nodemailer';
import config from '../config/env.js';

/**
 * Create email transporter
 */
const createTransporter = () => {
  // Check if we're in production or development
  const isProduction = config.nodeEnv === 'production';

  if (isProduction) {
    // Production: Use real SMTP server (e.g., Gmail, SendGrid, etc.)
    return nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.secure, // true for 465, false for other ports
      auth: config.email.smtp.auth,
    });
  } else {
    // Development: Use Ethereal Email (fake SMTP service for testing)
    // Or configure your own test SMTP
    return nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: false,
      auth: config.email.smtp.auth,
    });
  }
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @param {Array} options.attachments - Attachments (optional)
 * @returns {Promise<Object>} Send result
 */
export const sendEmail = async ({ to, subject, html, text, attachments = [] }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${config.email.fromName} <${config.email.from}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to,
      subject,
    });

    // If using Ethereal Email in development, log preview URL
    if (config.nodeEnv !== 'production' && info.messageId) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send membership approval email with QR code
 * @param {Object} member - Member document
 * @param {Object} qrCodeData - QR code data with buffer
 * @returns {Promise<Object>} Send result
 */
export const sendApprovalEmail = async (member, qrCodeData) => {
  const subject = `Bienvenue à Madagasikara Hoan'ny Malagasy - Votre adhésion est approuvée !`;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Adhésion Approuvée</title>
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
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎉 Félicitations ${member.firstName} !</h1>
          <p>Votre adhésion à MHM a été approuvée</p>
        </div>

        <div class="content">
          <p>Cher(e) ${member.firstName} ${member.lastName},</p>

          <p>Nous sommes ravis de vous informer que votre demande d'adhésion à <strong>Madagasikara Hoan'ny Malagasy (MHM)</strong> a été approuvée avec succès !</p>

          <div class="member-info">
            <h3>📋 Vos informations d'adhérent</h3>
            <p><strong>Numéro de membre :</strong> ${member.memberNumber}</p>
            <p><strong>Nom complet :</strong> ${member.fullName}</p>
            <p><strong>Type d'adhésion :</strong> ${getMemberTypeLabel(member.memberType)}</p>
            <p><strong>Date d'adhésion :</strong> ${new Date(member.membershipDate).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
            <p><strong>Statut :</strong> <span style="color: #4CAF50; font-weight: bold;">Actif</span></p>
          </div>

          <div class="qr-section">
            <h2>🎫 Votre QR Code Personnel</h2>
            <p>Présentez ce QR code lors de vos visites et événements MHM</p>
            <img src="cid:qrcode" alt="QR Code Membre" />
            <p style="color: #666; font-size: 14px;">
              Code unique : <code style="background-color: #e0e0e0; padding: 2px 8px; border-radius: 3px;">${qrCodeData.code}</code>
            </p>
          </div>

          <div class="instructions">
            <h3>📱 Comment utiliser votre QR code ?</h3>
            <ul>
              <li>Sauvegardez ce QR code sur votre téléphone</li>
              <li>Présentez-le lors de votre arrivée aux événements MHM</li>
              <li>Il peut être scanné directement depuis votre écran</li>
              <li>Gardez une copie imprimée en cas de besoin</li>
            </ul>
          </div>

          <p>Nous sommes impatients de vous accueillir lors de nos prochains événements et activités !</p>

          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        </div>

        <div class="footer">
          <p><strong>Madagasikara Hoan'ny Malagasy (MHM)</strong></p>
          <p>Email : contact@mhm.mg | Téléphone : +261 XX XX XXX XX</p>
          <p>
            <a href="#">Site Web</a> |
            <a href="#">Facebook</a> |
            <a href="#">Instagram</a>
          </p>
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
      filename: `qrcode-${member.memberNumber}.png`,
      content: qrCodeData.buffer,
      cid: 'qrcode', // Content ID for embedding in HTML
    },
  ];

  return await sendEmail({
    to: member.email,
    subject,
    html,
    attachments,
  });
};

/**
 * Get member type label in French
 * @param {string} memberType
 * @returns {string}
 */
const getMemberTypeLabel = (memberType) => {
  const labels = {
    regular: 'Membre Régulier',
    student: 'Membre Étudiant',
    honorary: 'Membre Honoraire',
    family: 'Membre Familial',
  };
  return labels[memberType] || memberType;
};

/**
 * Send rejection email
 * @param {Object} member - Member document
 * @returns {Promise<Object>} Send result
 */
export const sendRejectionEmail = async (member) => {
  const subject = `MHM - Réponse à votre demande d'adhésion`;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
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
          border-bottom: 3px solid #f44336;
        }
        .content {
          padding: 30px 0;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #e0e0e0;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Réponse à votre demande d'adhésion</h1>
        </div>
        <div class="content">
          <p>Cher(e) ${member.firstName} ${member.lastName},</p>
          <p>Nous vous remercions de l'intérêt que vous portez à Madagasikara Hoan'ny Malagasy (MHM).</p>
          <p>Après examen attentif de votre demande, nous regrettons de vous informer que nous ne pouvons pas donner suite à votre candidature pour le moment.</p>
          ${member.rejectionReason ? `<p><strong>Raison :</strong> ${member.rejectionReason}</p>` : ''}
          <p>N'hésitez pas à nous recontacter si vous souhaitez soumettre une nouvelle demande à l'avenir.</p>
          <p>Cordialement,<br>L'équipe MHM</p>
        </div>
        <div class="footer">
          <p><strong>Madagasikara Hoan'ny Malagasy (MHM)</strong></p>
          <p>Email : contact@mhm.mg</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: member.email,
    subject,
    html,
  });
};
