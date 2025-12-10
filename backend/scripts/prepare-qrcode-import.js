import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n📋 Préparation du fichier CSV pour import QR Code\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Lire le fichier CSV converti
const inputCsvPath = path.join(__dirname, '..', 'templates', 'ekipa-filoha-tantsoroka-feuil2.csv');
const outputCsvPath = path.join(__dirname, '..', 'templates', 'ekipa-filoha-tantsoroka-import-qrcode.csv');

if (!fs.existsSync(inputCsvPath)) {
  console.error('❌ Fichier CSV source introuvable :', inputCsvPath);
  process.exit(1);
}

console.log('✅ Fichier CSV source trouvé');
console.log('📁 ', inputCsvPath);
console.log('');

// Lire le contenu du fichier
const csvContent = fs.readFileSync(inputCsvPath, 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim());

console.log(`📊 Nombre de lignes trouvées : ${lines.length}`);
console.log('');

// Préparer les données pour l'import
console.log('🔄 Transformation des données...\n');

const outputLines = [];

// Ajouter l'en-tête
outputLines.push('memberId,name,email,status,validity,cin,lastName,firstName');

let successCount = 0;
let errorCount = 0;
const errors = [];

// Traiter chaque ligne
lines.forEach((line, index) => {
  const lineNumber = index + 1;

  // Séparer les colonnes
  const columns = line.split(',');

  if (columns.length < 3) {
    errorCount++;
    errors.push(`Ligne ${lineNumber} : Format invalide (${columns.length} colonnes au lieu de 3)`);
    return;
  }

  const lastName = columns[0].trim();
  const firstName = columns[1].trim();
  const cin = columns[2].trim();

  // Vérifier que les données essentielles sont présentes
  if (!lastName) {
    errorCount++;
    errors.push(`Ligne ${lineNumber} : Nom de famille manquant`);
    return;
  }

  // Construire le nom complet
  const fullName = firstName ? `${firstName} ${lastName}` : lastName;

  // Générer un memberId (on utilisera le CIN comme base, mais il faudra le remplacer plus tard)
  // Format : M-2022-XXXX (année du fichier Excel)
  const memberNumber = String(lineNumber).padStart(4, '0');
  const memberId = `M-2022-${memberNumber}`;

  // Email par défaut (devra être complété manuellement)
  const email = `membre${memberNumber}@HFM.mg`;

  // Statut par défaut
  const status = 'active';

  // Validité (année du fichier)
  const validity = '2022';

  // Ajouter la ligne transformée
  outputLines.push(`${memberId},"${fullName}",${email},${status},${validity},${cin},"${lastName}","${firstName}"`);
  successCount++;
});

console.log('📈 Résultats de la transformation :');
console.log(`   ✅ Succès : ${successCount} lignes`);
console.log(`   ❌ Erreurs : ${errorCount} lignes`);
console.log('');

if (errors.length > 0) {
  console.log('⚠️  Détails des erreurs :');
  errors.slice(0, 10).forEach(err => console.log(`   • ${err}`));
  if (errors.length > 10) {
    console.log(`   ... et ${errors.length - 10} autres erreurs`);
  }
  console.log('');
}

// Écrire le fichier de sortie
console.log('💾 Sauvegarde du fichier CSV transformé...\n');
fs.writeFileSync(outputCsvPath, outputLines.join('\n'), 'utf8');

console.log('✅ Fichier CSV prêt pour l\'import QR Code !\n');
console.log('📁 Emplacement :', outputCsvPath);
console.log(`📊 Nombre total de membres : ${successCount}`);
console.log('');

// Afficher un aperçu
console.log('📋 Aperçu des données (5 premières lignes) :\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
outputLines.slice(0, 6).forEach(line => console.log(line));
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('⚠️  IMPORTANT - Actions requises :\n');
console.log('1. 📧 COMPLÉTER LES EMAILS');
console.log('   Les emails générés sont fictifs (membre0001@HFM.mg)');
console.log('   Vous devez les remplacer par les vrais emails des membres\n');

console.log('2. 🔢 VÉRIFIER LES NUMÉROS DE MEMBRE');
console.log('   Les memberIds générés suivent le format M-2022-XXXX');
console.log('   Vérifiez qu\'ils correspondent à vos numéros réels\n');

console.log('3. ✅ VÉRIFIER LES STATUTS');
console.log('   Tous les membres sont marqués "active"');
console.log('   Ajustez si nécessaire (pending, inactive, etc.)\n');

console.log('4. 📅 AJUSTER L\'ANNÉE DE VALIDITÉ');
console.log('   Actuellement définie sur 2022 (année du fichier source)');
console.log('   Changez en 2025 si vous voulez générer pour l\'année en cours\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('🎉 Préparation terminée !\n');
console.log('Prochaines étapes :');
console.log('  1. Ouvrir le fichier CSV et compléter les emails');
console.log('  2. Utiliser l\'interface d\'import CSV : /admin/qrcodes');
console.log('  3. Lancer l\'envoi en masse des QR Codes\n');
