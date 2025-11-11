import mongoose from 'mongoose';
import xlsx from 'xlsx';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Member from '../src/models/Member.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

/**
 * Script d'import de membres depuis un fichier Excel
 *
 * Usage:
 *   node scripts/importMembersFromExcel.js <chemin-vers-fichier.xlsx>
 *
 * Format du fichier Excel attendu:
 * - firstName, lastName, dateOfBirth, email, phone
 * - street, city, postalCode, country
 * - memberType, status, occupation, interests
 * - emergencyContactName, emergencyContactPhone, emergencyContactRelationship
 * - notes
 */

// Fonction pour parser la date
function parseDate(dateValue) {
  if (!dateValue) return null;

  // Si c'est déjà un objet Date
  if (dateValue instanceof Date) return dateValue;

  // Si c'est un nombre (format Excel)
  if (typeof dateValue === 'number') {
    return new Date((dateValue - 25569) * 86400 * 1000);
  }

  // Si c'est une chaîne, essayer de la parser
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

// Fonction pour valider les données
function validateMemberData(row, rowIndex) {
  const errors = [];

  if (!row.firstName) errors.push(`Ligne ${rowIndex}: firstName est requis`);
  if (!row.lastName) errors.push(`Ligne ${rowIndex}: lastName est requis`);
  if (!row.email) errors.push(`Ligne ${rowIndex}: email est requis`);
  if (!row.phone) errors.push(`Ligne ${rowIndex}: phone est requis`);
  if (!row.dateOfBirth) errors.push(`Ligne ${rowIndex}: dateOfBirth est requis`);

  // Valider le type de membre
  const validMemberTypes = ['regular', 'student', 'family', 'honorary'];
  if (row.memberType && !validMemberTypes.includes(row.memberType)) {
    errors.push(`Ligne ${rowIndex}: memberType invalide (doit être: ${validMemberTypes.join(', ')})`);
  }

  // Valider le statut
  const validStatuses = ['active', 'inactive', 'pending', 'suspended'];
  if (row.status && !validStatuses.includes(row.status)) {
    errors.push(`Ligne ${rowIndex}: status invalide (doit être: ${validStatuses.join(', ')})`);
  }

  return errors;
}

// Fonction utilitaire pour convertir en string et trim
function safeString(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

// Fonction pour transformer une ligne Excel en objet Member
function transformRowToMember(row) {
  const memberData = {
    firstName: safeString(row.firstName),
    lastName: safeString(row.lastName),
    dateOfBirth: parseDate(row.dateOfBirth),
    email: safeString(row.email).toLowerCase(),
    phone: safeString(row.phone),
    memberType: safeString(row.memberType) || 'regular',
    status: safeString(row.status) || 'pending',
  };

  // Adresse
  if (row.street || row.city || row.postalCode || row.country) {
    memberData.address = {
      street: safeString(row.street),
      city: safeString(row.city),
      postalCode: safeString(row.postalCode),
      country: safeString(row.country) || 'France',
    };
  }

  // Champs optionnels
  if (row.occupation) memberData.occupation = safeString(row.occupation);
  if (row.interests) memberData.interests = safeString(row.interests);
  if (row.notes) memberData.notes = safeString(row.notes);

  // Contact d'urgence
  if (row.emergencyContactName && row.emergencyContactPhone) {
    memberData.emergencyContact = {
      name: safeString(row.emergencyContactName),
      phone: safeString(row.emergencyContactPhone),
      relationship: safeString(row.emergencyContactRelationship),
    };
  }

  return memberData;
}

// Fonction principale
async function importMembers(filePath) {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('📥 IMPORT DE MEMBRES DEPUIS EXCEL VERS MONGODB');
    console.log('='.repeat(70));

    // Vérifier que le fichier existe
    const absolutePath = path.resolve(filePath);
    console.log(`\n📂 Lecture du fichier: ${absolutePath}`);

    // Lire le fichier Excel
    const workbook = xlsx.readFile(absolutePath);

    // Chercher la feuille "Membres" ou utiliser la dernière feuille (pas la première qui est souvent "Instructions")
    let sheetName;
    if (workbook.SheetNames.includes('Membres')) {
      sheetName = 'Membres';
    } else if (workbook.SheetNames.includes('Members')) {
      sheetName = 'Members';
    } else {
      // Si pas de feuille "Membres", utiliser la dernière feuille (qui n'est généralement pas les instructions)
      sheetName = workbook.SheetNames[workbook.SheetNames.length - 1];
    }

    const worksheet = workbook.Sheets[sheetName];

    console.log(`📊 Feuille sélectionnée: ${sheetName}`);

    // Convertir en JSON
    const rows = xlsx.utils.sheet_to_json(worksheet);
    console.log(`📝 Nombre de lignes trouvées: ${rows.length}\n`);

    if (rows.length === 0) {
      console.log('⚠️  Aucune donnée trouvée dans le fichier.');
      return;
    }

    // Connexion à MongoDB
    console.log('🔌 Connexion à MongoDB...');
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI non défini dans les variables d\'environnement');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB\n');

    // Validation et transformation
    console.log('🔍 Validation des données...\n');
    const validationErrors = [];
    const membersToImport = [];

    rows.forEach((row, index) => {
      const errors = validateMemberData(row, index + 2); // +2 car ligne 1 = header
      if (errors.length > 0) {
        validationErrors.push(...errors);
      } else {
        membersToImport.push(transformRowToMember(row));
      }
    });

    // Afficher les erreurs de validation
    if (validationErrors.length > 0) {
      console.log('❌ Erreurs de validation détectées:\n');
      validationErrors.forEach(error => console.log(`   ${error}`));
      console.log(`\n⚠️  ${validationErrors.length} erreur(s) trouvée(s).`);
      console.log(`✅ ${membersToImport.length} ligne(s) valide(s).\n`);

      // Demander confirmation pour continuer
      if (membersToImport.length === 0) {
        console.log('❌ Aucune donnée valide à importer. Abandon.\n');
        return;
      }

      console.log('⏩ Import des lignes valides uniquement...\n');
    }

    // Import des membres
    let successCount = 0;
    let errorCount = 0;
    const importErrors = [];

    console.log(`📤 Import de ${membersToImport.length} membre(s)...\n`);

    for (let i = 0; i < membersToImport.length; i++) {
      const memberData = membersToImport[i];
      try {
        // Vérifier si le membre existe déjà (par email)
        const existingMember = await Member.findOne({ email: memberData.email });

        if (existingMember) {
          console.log(`⚠️  [${i + 1}/${membersToImport.length}] ${memberData.firstName} ${memberData.lastName} (${memberData.email}) - Déjà existant, ignoré`);
          errorCount++;
          continue;
        }

        const member = await Member.create(memberData);
        successCount++;
        console.log(`✅ [${i + 1}/${membersToImport.length}] ${memberData.firstName} ${memberData.lastName} - Importé avec succès (ID: ${member._id})`);
      } catch (error) {
        errorCount++;
        importErrors.push({
          member: `${memberData.firstName} ${memberData.lastName}`,
          error: error.message
        });
        console.error(`❌ [${i + 1}/${membersToImport.length}] ${memberData.firstName} ${memberData.lastName} - Erreur: ${error.message}`);
      }
    }

    // Résumé
    console.log('\n' + '='.repeat(70));
    console.log('📊 RÉSUMÉ DE L\'IMPORT');
    console.log('='.repeat(70));
    console.log(`📄 Lignes dans le fichier: ${rows.length}`);
    console.log(`✅ Importés avec succès: ${successCount}`);
    console.log(`❌ Erreurs/Ignorés: ${errorCount}`);

    if (successCount > 0) {
      console.log(`\n📈 Taux de réussite: ${((successCount / rows.length) * 100).toFixed(1)}%`);
    }

    if (importErrors.length > 0) {
      console.log('\n❌ Détails des erreurs d\'import:');
      importErrors.forEach((err, index) => {
        console.log(`  ${index + 1}. ${err.member}: ${err.error}`);
      });
    }

    console.log('='.repeat(70));

    // Statistiques finales
    const totalMembers = await Member.countDocuments();
    console.log(`\n📊 Total de membres dans la base: ${totalMembers}`);

    const activeCount = await Member.countDocuments({ status: 'active' });
    const pendingCount = await Member.countDocuments({ status: 'pending' });
    const inactiveCount = await Member.countDocuments({ status: 'inactive' });

    console.log('\n📊 Distribution par statut:');
    console.log(`   • Actifs: ${activeCount}`);
    console.log(`   • En attente: ${pendingCount}`);
    console.log(`   • Inactifs: ${inactiveCount}`);

    console.log('\n🎉 Import terminé!\n');

  } catch (error) {
    console.error('\n❌ Erreur fatale:', error.message);
    console.error(error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée.\n');
  }
}

// Point d'entrée
const filePath = process.argv[2];

if (!filePath) {
  console.error('\n❌ Usage: node scripts/importMembersFromExcel.js <chemin-vers-fichier.xlsx>\n');
  console.log('Exemple: node scripts/importMembersFromExcel.js ./data/members.xlsx\n');
  process.exit(1);
}

importMembers(filePath)
  .then(() => {
    console.log('✨ Script terminé avec succès.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erreur lors de l\'exécution du script:', error.message);
    process.exit(1);
  });
