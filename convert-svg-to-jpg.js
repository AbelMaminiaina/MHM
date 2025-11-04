// Script pour convertir le SVG en JPG
// Nécessite : npm install sharp

const sharp = require('sharp');
const fs = require('fs');

const svgBuffer = fs.readFileSync('./frontend/public/images/i-tech-branding.svg');

sharp(svgBuffer)
  .jpeg({ quality: 95 })
  .toFile('./frontend/public/images/i-tech-branding.jpg')
  .then(() => {
    console.log('✅ Image JPG créée avec succès : frontend/public/images/i-tech-branding.jpg');
  })
  .catch(err => {
    console.error('❌ Erreur lors de la conversion:', err);
  });
