import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

/**
 * Script de backup MongoDB
 *
 * Usage:
 *   npm run backup              - Backup complet avec timestamp
 *   npm run backup:restore      - Restaurer le dernier backup
 *
 * Prérequis:
 *   - MongoDB Database Tools installés (mongodump, mongorestore)
 *   - Télécharger: https://www.mongodb.com/try/download/database-tools
 */

// Configuration
const MONGO_URI = process.env.MONGO_URI;
const BACKUP_DIR = path.join(__dirname, '../backups');

// Fonction pour créer le dossier de backup
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`✅ Dossier de backup créé: ${BACKUP_DIR}`);
  }
}

// Fonction pour formater la date
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
}

// Fonction pour parser l'URI MongoDB
function parseMongoUri(uri) {
  try {
    const url = new URL(uri);
    const dbName = url.pathname.replace('/', '');

    return {
      host: url.hostname,
      port: url.port || '27017',
      database: dbName,
      username: url.username,
      password: url.password,
      isAtlas: url.hostname.includes('mongodb.net'),
      fullUri: uri
    };
  } catch (error) {
    throw new Error(`URI MongoDB invalide: ${error.message}`);
  }
}

// Fonction de backup
async function createBackup() {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('💾 BACKUP MONGODB - SAUVEGARDE DE LA BASE DE DONNÉES');
    console.log('='.repeat(70) + '\n');

    if (!MONGO_URI) {
      throw new Error('MONGO_URI non défini dans les variables d\'environnement');
    }

    ensureBackupDir();

    const mongoInfo = parseMongoUri(MONGO_URI);
    const timestamp = getTimestamp();
    const backupName = `backup_${mongoInfo.database}_${timestamp}`;
    const backupPath = path.join(BACKUP_DIR, backupName);

    console.log('📊 Informations de connexion:');
    console.log(`   • Base de données: ${mongoInfo.database}`);
    console.log(`   • Type: ${mongoInfo.isAtlas ? 'MongoDB Atlas' : 'Local/Self-hosted'}`);
    console.log(`   • Destination: ${backupPath}\n`);

    console.log('🔄 Début du backup...\n');

    // Commande mongodump
    const command = `mongodump --uri="${MONGO_URI}" --out="${backupPath}"`;

    // Exécuter mongodump
    const { stdout, stderr } = await execPromise(command, {
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    if (stdout) console.log(stdout);
    if (stderr && !stderr.includes('done dumping')) console.error(stderr);

    // Vérifier que le backup existe
    if (fs.existsSync(backupPath)) {
      // Calculer la taille du backup
      let totalSize = 0;
      const getSize = (dirPath) => {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
          const filePath = path.join(dirPath, file);
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            getSize(filePath);
          } else {
            totalSize += stats.size;
          }
        });
      };
      getSize(backupPath);

      const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);

      console.log('\n' + '='.repeat(70));
      console.log('✅ BACKUP TERMINÉ AVEC SUCCÈS');
      console.log('='.repeat(70));
      console.log(`📁 Emplacement: ${backupPath}`);
      console.log(`📊 Taille: ${sizeMB} MB`);
      console.log(`🕐 Date: ${new Date().toLocaleString('fr-FR')}`);
      console.log('='.repeat(70) + '\n');

      // Lister tous les backups existants
      const backups = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('backup_'))
        .sort()
        .reverse();

      console.log(`📋 Backups disponibles (${backups.length}):`);
      backups.slice(0, 5).forEach((backup, index) => {
        const backupFullPath = path.join(BACKUP_DIR, backup);
        const stats = fs.statSync(backupFullPath);
        const date = stats.mtime.toLocaleString('fr-FR');
        console.log(`   ${index + 1}. ${backup} (${date})`);
      });

      if (backups.length > 5) {
        console.log(`   ... et ${backups.length - 5} autre(s)`);
      }

      console.log('\n💡 Pour restaurer ce backup:');
      console.log(`   npm run backup:restore ${backupName}\n`);

    } else {
      throw new Error('Le backup n\'a pas été créé correctement');
    }

  } catch (error) {
    console.error('\n❌ Erreur lors du backup:', error.message);

    if (error.message.includes('mongodump')) {
      console.error('\n⚠️  MongoDB Database Tools n\'est pas installé ou pas dans le PATH');
      console.error('📥 Téléchargez-le depuis: https://www.mongodb.com/try/download/database-tools');
      console.error('📖 Installation: https://www.mongodb.com/docs/database-tools/installation/installation/\n');
    }

    throw error;
  }
}

// Fonction de restauration
async function restoreBackup(backupName) {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('♻️  RESTAURATION MONGODB - RESTORATION DE LA BASE DE DONNÉES');
    console.log('='.repeat(70) + '\n');

    if (!MONGO_URI) {
      throw new Error('MONGO_URI non défini dans les variables d\'environnement');
    }

    const mongoInfo = parseMongoUri(MONGO_URI);

    // Si aucun backup spécifié, utiliser le plus récent
    if (!backupName) {
      const backups = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('backup_'))
        .sort()
        .reverse();

      if (backups.length === 0) {
        throw new Error('Aucun backup disponible');
      }

      backupName = backups[0];
      console.log(`ℹ️  Utilisation du backup le plus récent: ${backupName}\n`);
    }

    const backupPath = path.join(BACKUP_DIR, backupName, mongoInfo.database);

    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup non trouvé: ${backupPath}`);
    }

    console.log('⚠️  ATTENTION: Cette opération va ÉCRASER les données actuelles!');
    console.log(`📂 Source: ${backupPath}`);
    console.log(`🎯 Destination: ${mongoInfo.database}\n`);

    console.log('🔄 Début de la restauration...\n');

    // Commande mongorestore
    const command = `mongorestore --uri="${MONGO_URI}" --drop "${backupPath}"`;

    // Exécuter mongorestore
    const { stdout, stderr } = await execPromise(command, {
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    if (stdout) console.log(stdout);
    if (stderr && !stderr.includes('done restoring')) console.error(stderr);

    console.log('\n' + '='.repeat(70));
    console.log('✅ RESTAURATION TERMINÉE AVEC SUCCÈS');
    console.log('='.repeat(70));
    console.log(`🎯 Base de données: ${mongoInfo.database}`);
    console.log(`📂 Depuis: ${backupName}`);
    console.log(`🕐 Date: ${new Date().toLocaleString('fr-FR')}`);
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de la restauration:', error.message);

    if (error.message.includes('mongorestore')) {
      console.error('\n⚠️  MongoDB Database Tools n\'est pas installé ou pas dans le PATH');
      console.error('📥 Téléchargez-le depuis: https://www.mongodb.com/try/download/database-tools\n');
    }

    throw error;
  }
}

// Liste des backups
function listBackups() {
  console.log('\n' + '='.repeat(70));
  console.log('📋 LISTE DES BACKUPS DISPONIBLES');
  console.log('='.repeat(70) + '\n');

  ensureBackupDir();

  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('backup_'))
    .sort()
    .reverse();

  if (backups.length === 0) {
    console.log('ℹ️  Aucun backup disponible\n');
    return;
  }

  console.log(`Total: ${backups.length} backup(s)\n`);

  backups.forEach((backup, index) => {
    const backupFullPath = path.join(BACKUP_DIR, backup);
    const stats = fs.statSync(backupFullPath);
    const date = stats.mtime.toLocaleString('fr-FR');

    console.log(`${index + 1}. ${backup}`);
    console.log(`   📅 Date: ${date}`);
    console.log(`   📁 Emplacement: ${backupFullPath}\n`);
  });

  console.log('💡 Pour restaurer un backup:');
  console.log(`   npm run backup:restore <nom-du-backup>\n`);
}

// Point d'entrée
const command = process.argv[2];
const arg = process.argv[3];

if (command === 'restore') {
  restoreBackup(arg)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (command === 'list') {
  listBackups();
  process.exit(0);
} else {
  // Backup par défaut
  createBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
