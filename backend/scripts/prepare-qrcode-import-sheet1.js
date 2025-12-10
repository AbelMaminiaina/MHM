import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n📋 Préparation du fichier CSV (Feuille 1) pour import QR Code\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Lire le fichier CSV converti
const inputCsvPath = path.join(__dirname, '..', 'templates', 'ekipa-filoha-tantsoroka-feuil1.csv');
const outputCsvPath = path.join(__dirname, '..', 'templates', 'ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv');

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

console.log(`📊 Nombre total de lignes : ${lines.length}`);
console.log('');

// Sauter les 2 premières lignes (en-têtes)
const dataLines = lines.slice(2);

console.log(`📊 Lignes de données : ${dataLines.length}`);
console.log('');

// Préparer les données pour l'import
console.log('🔄 Transformation des données...\n');

const outputLines = [];

// Ajouter l'en-tête pour l'import QR Code avec TOUS les champs requis
outputLines.push('memberNumber,firstName,lastName,dateOfBirth,email,phone,address,status,memberType,cin,entite,responsabilite,validity');

let successCount = 0;
let errorCount = 0;
let withEmailCount = 0;
let withoutEmailCount = 0;
const errors = [];

// Traiter chaque ligne
dataLines.forEach((line, index) => {
  const lineNumber = index + 3; // +3 car on a sauté 2 lignes d'en-têtes

  // Parser le CSV manuellement pour gérer les virgules dans les champs
  const columns = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      columns.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  columns.push(currentField.trim()); // Dernier champ

  // Vérifier qu'on a au moins 8 colonnes
  if (columns.length < 8) {
    errorCount++;
    errors.push(`Ligne ${lineNumber} : Format invalide (${columns.length} colonnes)`);
    return;
  }

  // Extraire les données
  // Format : NOM, PRENOMS, CIN, ENTITE, RESPONSABILITE, (vide), Numero, Adresse Email
  const lastName = columns[0].trim();
  const firstName = columns[1].trim();
  const cin = columns[2].trim();
  const entite = columns[3].trim();
  const responsabilite = columns[4].trim();
  const phone = columns[6].trim(); // colonne 6 (index 6)
  const email = columns[7].trim(); // colonne 7 (index 7)

  // Vérifier que les données essentielles sont présentes
  if (!lastName) {
    errorCount++;
    errors.push(`Ligne ${lineNumber} : Nom de famille manquant`);
    return;
  }

  // Construire le nom complet
  const fullName = firstName ? `${firstName} ${lastName}` : lastName;

  // Générer un memberId
  const memberNumber = String(index + 1).padStart(4, '0');
  const memberId = `M-2022-${memberNumber}`;

  // Utiliser l'email s'il existe, sinon générer un email temporaire
  let finalEmail = email;
  if (!email || email === '') {
    finalEmail = `membre${memberNumber}@HFM.mg`;
    withoutEmailCount++;
  } else {
    withEmailCount++;
  }

  // Statut par défaut
  const status = 'active';

  // Validité (année du fichier)
  const validity = '2022';

  // Formater le téléphone (ajouter +261 si nécessaire)
  let finalPhone = phone;
  if (phone && phone !== '' && !phone.startsWith('+')) {
    // Si le numéro commence par 0, remplacer par +261
    if (phone.startsWith('0')) {
      finalPhone = `+261 ${phone.substring(1)}`;
    } else {
      finalPhone = `+261 ${phone}`;
    }
  }

  // Nettoyer le CIN (enlever les décimales inutiles)
  const finalCin = cin.replace('.00', '');

  // Date de naissance par défaut (01/01/1990) - format ISO
  const dateOfBirth = '1990-01-01';

  // Adresse par défaut
  const address = 'Madagascar';

  // Type de membre basé sur l'entité
  let memberType = 'regular';
  if (entite.toLowerCase().includes('etudiant') || entite.toLowerCase().includes('étudiant')) {
    memberType = 'student';
  }

  // Ajouter la ligne transformée avec échappement des guillemets
  const escapedLastName = lastName.replace(/"/g, '""');
  const escapedFirstName = firstName.replace(/"/g, '""');
  const escapedEntite = entite.replace(/"/g, '""');
  const escapedResponsabilite = responsabilite.replace(/"/g, '""');
  const escapedAddress = address.replace(/"/g, '""');

  // Format: memberNumber,firstName,lastName,dateOfBirth,email,phone,address,status,memberType,cin,entite,responsabilite,validity
  outputLines.push(
    `${memberId},"${escapedFirstName}","${escapedLastName}",${dateOfBirth},${finalEmail},${finalPhone},"${escapedAddress}",${status},${memberType},${finalCin},"${escapedEntite}","${escapedResponsabilite}",${validity}`
  );
  successCount++;
});

console.log('📈 Résultats de la transformation :');
console.log(`   ✅ Succès : ${successCount} lignes`);
console.log(`   ❌ Erreurs : ${errorCount} lignes`);
console.log(`   📧 Avec email réel : ${withEmailCount} (${Math.round(withEmailCount / successCount * 100)}%)`);
console.log(`   ⚠️  Sans email (généré) : ${withoutEmailCount} (${Math.round(withoutEmailCount / successCount * 100)}%)`);
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
outputLines.slice(0, 6).forEach(line => {
  // Tronquer les lignes trop longues pour l'affichage
  if (line.length > 120) {
    console.log(line.substring(0, 117) + '...');
  } else {
    console.log(line);
  }
});
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📊 Statistiques détaillées :\n');
console.log(`   • Membres avec email : ${withEmailCount}`);
console.log(`   • Membres sans email : ${withoutEmailCount}`);
console.log(`   • Taux de couverture email : ${Math.round(withEmailCount / successCount * 100)}%`);
console.log('');

if (withoutEmailCount > 0) {
  console.log('⚠️  ATTENTION - Emails manquants :\n');
  console.log(`   ${withoutEmailCount} membres n'ont pas d'adresse email`);
  console.log('   Des emails temporaires ont été générés (membreXXXX@HFM.mg)');
  console.log('   Vous devez les compléter avant l\'import\n');
}

console.log('✅ AVANTAGES de cette feuille :\n');
console.log(`   • ${withEmailCount} emails réels déjà présents (${Math.round(withEmailCount / successCount * 100)}%)`);
console.log('   • Informations complètes (entité, responsabilité, téléphone)');
console.log('   • ${successCount} membres au total');
console.log('');

console.log('📅 Actions recommandées :\n');
console.log('1. Compléter les emails manquants (si possible)');
console.log('2. Vérifier les numéros de téléphone');
console.log('3. Ajuster l\'année de validité (2022 → 2025 si nécessaire)');
console.log('4. Importer via l\'interface : /admin/qrcodes\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('🎉 Préparation terminée !\n');
console.log(`Fichier prêt avec ${successCount} membres dont ${withEmailCount} avec des emails réels.\n`);
