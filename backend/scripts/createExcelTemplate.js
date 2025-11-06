import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script pour créer un template Excel d'import de membres
 *
 * Usage:
 *   node scripts/createExcelTemplate.js
 *
 * Génère: ./data/members_template.xlsx
 */

// Colonnes du template
const headers = [
  'firstName',
  'lastName',
  'dateOfBirth',
  'email',
  'phone',
  'street',
  'city',
  'postalCode',
  'country',
  'memberType',
  'status',
  'occupation',
  'interests',
  'emergencyContactName',
  'emergencyContactPhone',
  'emergencyContactRelationship',
  'notes'
];

// Données d'exemple
const exampleData = [
  {
    firstName: 'Jean',
    lastName: 'Dupont',
    dateOfBirth: '1990-05-15',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    street: '123 Rue de la Paix',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    memberType: 'regular',
    status: 'active',
    occupation: 'Ingénieur',
    interests: 'Technologie, Sport',
    emergencyContactName: 'Marie Dupont',
    emergencyContactPhone: '+33 6 98 76 54 32',
    emergencyContactRelationship: 'Épouse',
    notes: 'Membre actif'
  },
  {
    firstName: 'Sophie',
    lastName: 'Martin',
    dateOfBirth: '1995-08-22',
    email: 'sophie.martin@example.com',
    phone: '+33 6 23 45 67 89',
    street: '45 Avenue des Champs',
    city: 'Lyon',
    postalCode: '69001',
    country: 'France',
    memberType: 'student',
    status: 'pending',
    occupation: 'Étudiante',
    interests: 'Culture, Voyages',
    emergencyContactName: 'Pierre Martin',
    emergencyContactPhone: '+33 6 11 22 33 44',
    emergencyContactRelationship: 'Père',
    notes: 'En attente de validation'
  }
];

// Instructions
const instructions = [
  '=== INSTRUCTIONS D\'UTILISATION ===',
  '',
  '1. Remplissez les données à partir de la ligne 4 (après les exemples)',
  '2. Les colonnes avec * sont OBLIGATOIRES',
  '3. Formats attendus:',
  '   - dateOfBirth: YYYY-MM-DD (ex: 1990-05-15)',
  '   - email: format email valide',
  '   - memberType: regular, student, family, honorary',
  '   - status: active, inactive, pending, suspended',
  '   - country: nom du pays (défaut: France)',
  '',
  '4. Colonnes obligatoires (*):',
  '   firstName*, lastName*, dateOfBirth*, email*, phone*',
  '',
  '5. Colonnes optionnelles:',
  '   street, city, postalCode, country, occupation, interests,',
  '   emergencyContactName, emergencyContactPhone,',
  '   emergencyContactRelationship, notes',
  '',
  '6. Une fois rempli, exécutez:',
  '   npm run import:members ./data/your_file.xlsx',
  '',
  '=== NE PAS MODIFIER LES LIGNES CI-DESSUS ==='
];

function createTemplate() {
  console.log('\n' + '='.repeat(70));
  console.log('📝 CRÉATION DU TEMPLATE EXCEL D\'IMPORT');
  console.log('='.repeat(70) + '\n');

  // Créer le workbook
  const workbook = xlsx.utils.book_new();

  // Créer la feuille avec les instructions
  const instructionsSheet = xlsx.utils.aoa_to_sheet(
    instructions.map(line => [line])
  );
  xlsx.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

  // Créer la feuille de données
  const dataSheet = xlsx.utils.json_to_sheet([]);

  // Ajouter les en-têtes
  xlsx.utils.sheet_add_aoa(dataSheet, [headers], { origin: 'A1' });

  // Ajouter les données d'exemple
  xlsx.utils.sheet_add_json(dataSheet, exampleData, {
    origin: 'A2',
    skipHeader: true
  });

  // Ajuster la largeur des colonnes
  const columnWidths = [
    { wch: 15 }, // firstName
    { wch: 15 }, // lastName
    { wch: 12 }, // dateOfBirth
    { wch: 25 }, // email
    { wch: 18 }, // phone
    { wch: 30 }, // street
    { wch: 20 }, // city
    { wch: 12 }, // postalCode
    { wch: 12 }, // country
    { wch: 12 }, // memberType
    { wch: 10 }, // status
    { wch: 20 }, // occupation
    { wch: 30 }, // interests
    { wch: 20 }, // emergencyContactName
    { wch: 18 }, // emergencyContactPhone
    { wch: 15 }, // emergencyContactRelationship
    { wch: 40 }  // notes
  ];
  dataSheet['!cols'] = columnWidths;

  xlsx.utils.book_append_sheet(workbook, dataSheet, 'Membres');

  // Créer le dossier data s'il n'existe pas
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Enregistrer le fichier
  const outputPath = path.join(dataDir, 'members_template.xlsx');
  xlsx.writeFile(workbook, outputPath);

  console.log(`✅ Template créé avec succès: ${outputPath}`);
  console.log('\n📋 Le template contient:');
  console.log('   • Une feuille "Instructions" avec le guide d\'utilisation');
  console.log('   • Une feuille "Membres" avec les colonnes et 2 exemples');
  console.log('\n💡 Utilisation:');
  console.log('   1. Ouvrez le fichier avec Excel/LibreOffice');
  console.log('   2. Remplissez vos données dans la feuille "Membres"');
  console.log('   3. Sauvegardez le fichier');
  console.log('   4. Exécutez: npm run import:members <chemin-vers-fichier>');
  console.log('\n' + '='.repeat(70) + '\n');
}

createTemplate();
