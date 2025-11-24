import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('\n🔍 Test de Configuration SMTP\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Display configuration
console.log('📋 Configuration chargée :');
console.log(`   • SMTP_HOST: ${process.env.SMTP_HOST || '❌ Non défini'}`);
console.log(`   • SMTP_PORT: ${process.env.SMTP_PORT || '❌ Non défini'}`);
console.log(`   • SMTP_USER: ${process.env.SMTP_USER || '❌ Non défini'}`);
console.log(`   • SMTP_PASS: ${process.env.SMTP_PASS ? '✅ Défini (masqué)' : '❌ Non défini'}`);
console.log(`   • EMAIL_FROM: ${process.env.EMAIL_FROM || '❌ Non défini'}`);
console.log(`   • EMAIL_FROM_NAME: ${process.env.EMAIL_FROM_NAME || '❌ Non défini'}`);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check required variables
const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables manquantes dans .env :');
  missingVars.forEach(varName => console.error(`   • ${varName}`));
  console.error('\nVeuillez configurer le fichier backend/.env\n');
  process.exit(1);
}

// Create transporter
console.log('🔄 Création du transporteur SMTP...\n');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test 1: Verify connection
console.log('📡 Test 1/2 : Vérification de la connexion SMTP...\n');

transporter.verify()
  .then(() => {
    console.log('✅ Connexion SMTP réussie !\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 2: Send test email
    console.log('📧 Test 2/2 : Envoi d\'un email de test...\n');

    const testEmail = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: process.env.SMTP_USER, // Send to self
      subject: '✅ Test SMTP - MHM Backend',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              border: 2px solid #4CAF50;
            }
            h1 {
              color: #4CAF50;
              text-align: center;
            }
            .info {
              background-color: white;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .success {
              color: #4CAF50;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Configuration SMTP Réussie !</h1>

            <div class="info">
              <p class="success">Félicitations !</p>
              <p>Votre configuration SMTP fonctionne correctement.</p>

              <h3>📋 Détails de la configuration :</h3>
              <ul>
                <li><strong>Serveur SMTP :</strong> ${process.env.SMTP_HOST}</li>
                <li><strong>Port :</strong> ${process.env.SMTP_PORT}</li>
                <li><strong>Utilisateur :</strong> ${process.env.SMTP_USER}</li>
                <li><strong>Email de :</strong> ${process.env.EMAIL_FROM}</li>
                <li><strong>Nom de :</strong> ${process.env.EMAIL_FROM_NAME}</li>
              </ul>

              <h3>🎯 Prochaines étapes :</h3>
              <ol>
                <li>Votre système d'envoi d'emails est opérationnel</li>
                <li>Vous pouvez maintenant tester l'adhésion d'un membre</li>
                <li>Le QR Code sera envoyé automatiquement par email</li>
              </ol>

              <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                <em>Cet email de test a été généré par le script test-smtp.js</em>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ✅ Configuration SMTP Réussie !

        Félicitations ! Votre configuration SMTP fonctionne correctement.

        Détails de la configuration :
        • Serveur SMTP : ${process.env.SMTP_HOST}
        • Port : ${process.env.SMTP_PORT}
        • Utilisateur : ${process.env.SMTP_USER}
        • Email de : ${process.env.EMAIL_FROM}
        • Nom de : ${process.env.EMAIL_FROM_NAME}

        Prochaines étapes :
        1. Votre système d'envoi d'emails est opérationnel
        2. Vous pouvez maintenant tester l'adhésion d'un membre
        3. Le QR Code sera envoyé automatiquement par email

        Cet email de test a été généré par le script test-smtp.js
      `,
    };

    return transporter.sendMail(testEmail);
  })
  .then((info) => {
    console.log('✅ Email de test envoyé avec succès !\n');
    console.log('📬 Détails de l\'envoi :');
    console.log(`   • Message ID: ${info.messageId}`);
    console.log(`   • Destinataire: ${process.env.SMTP_USER}`);

    // If using Ethereal, show preview URL
    if (process.env.SMTP_HOST === 'smtp.ethereal.email' && info.messageId) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`\n🌐 URL de prévisualisation (Ethereal) :`);
      console.log(`   ${previewUrl}\n`);
      console.log('   👆 Cliquez sur ce lien pour voir l\'email\n');
    } else {
      console.log('\n📧 Vérifiez votre boîte de réception !\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ TOUS LES TESTS SONT RÉUSSIS !\n');
    console.log('🎉 Votre système d\'envoi d\'emails est 100% opérationnel.\n');
    console.log('Vous pouvez maintenant tester l\'adhésion d\'un membre.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ ERREUR :\n');
    console.error(`   ${error.message}\n`);

    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.error('💡 Solutions possibles :\n');

    if (error.message.includes('EAUTH')) {
      console.error('   ❌ Authentification échouée\n');
      console.error('   Solutions :');
      console.error('   1. Vérifiez SMTP_USER et SMTP_PASS dans .env');
      console.error('   2. Si Gmail : créez un "mot de passe d\'application"');
      console.error('   3. Activez l\'authentification à 2 facteurs sur Gmail\n');
    } else if (error.message.includes('ECONNECTION') || error.message.includes('ETIMEDOUT')) {
      console.error('   ❌ Impossible de se connecter au serveur SMTP\n');
      console.error('   Solutions :');
      console.error('   1. Vérifiez SMTP_HOST et SMTP_PORT dans .env');
      console.error('   2. Vérifiez votre connexion internet');
      console.error('   3. Vérifiez que le serveur SMTP est accessible\n');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('   ❌ Serveur SMTP introuvable\n');
      console.error('   Solutions :');
      console.error('   1. Vérifiez SMTP_HOST dans .env');
      console.error('   2. Exemples valides :');
      console.error('      • smtp.gmail.com (Gmail)');
      console.error('      • smtp.ethereal.email (Test)\n');
    } else {
      console.error('   Solutions générales :');
      console.error('   1. Vérifiez toutes les variables SMTP dans .env');
      console.error('   2. Redémarrez le serveur après modification du .env');
      console.error('   3. Consultez la documentation de votre fournisseur SMTP\n');
    }

    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.error('📚 Documentation :\n');
    console.error('   • Gmail : https://support.google.com/accounts/answer/185833');
    console.error('   • Ethereal : https://ethereal.email\n');

    process.exit(1);
  });
