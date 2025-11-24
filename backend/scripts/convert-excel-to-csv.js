import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n📊 Conversion Excel → CSV\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Chemin du fichier Excel
const excelFilePath = path.join(__dirname, '..', 'templates', 'Ekipa Filoha sy Tantsoroka 2021-2022.xlsx');

// Vérifier que le fichier existe
if (!fs.existsSync(excelFilePath)) {
  console.error('❌ Fichier Excel introuvable :', excelFilePath);
  process.exit(1);
}

console.log('✅ Fichier Excel trouvé :', excelFilePath);
console.log('');

// Lire le fichier Excel
console.log('📖 Lecture du fichier Excel...');
const workbook = xlsx.readFile(excelFilePath);

// Afficher les noms des feuilles
console.log('\n📄 Feuilles disponibles :');
workbook.SheetNames.forEach((name, index) => {
  console.log(`   ${index + 1}. ${name}`);
});

// Vérifier qu'il y a au moins 2 feuilles
if (workbook.SheetNames.length < 2) {
  console.error('\n❌ Le fichier ne contient pas de feuille 2');
  process.exit(1);
}

// Récupérer la feuille 2 (index 1)
const sheetName = workbook.SheetNames[1];
const worksheet = workbook.Sheets[sheetName];

console.log(`\n✅ Feuille sélectionnée : "${sheetName}"\n`);

// Convertir en CSV
console.log('🔄 Conversion en CSV...');
const csvData = xlsx.utils.sheet_to_csv(worksheet);

// Afficher un aperçu des données
const lines = csvData.split('\n');
console.log(`\n📊 Aperçu des données (${lines.length} lignes) :\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
lines.slice(0, 5).forEach(line => {
  if (line.trim()) {
    console.log(line);
  }
});
if (lines.length > 5) {
  console.log('...');
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Nom du fichier CSV de sortie
const csvFileName = `ekipa-filoha-tantsoroka-${sheetName.toLowerCase().replace(/\s+/g, '-')}.csv`;
const csvFilePath = path.join(__dirname, '..', 'templates', csvFileName);

// Sauvegarder le fichier CSV
console.log('💾 Sauvegarde du fichier CSV...');
fs.writeFileSync(csvFilePath, csvData, 'utf8');

console.log(`\n✅ Fichier CSV créé avec succès !\n`);
console.log('📁 Emplacement :', csvFilePath);
console.log(`📊 Nombre de lignes : ${lines.length}`);
console.log('');

// Statistiques supplémentaires
const headers = lines[0] ? lines[0].split(',') : [];
if (headers.length > 0) {
  console.log(`📋 Colonnes détectées (${headers.length}) :`);
  headers.forEach((header, index) => {
    console.log(`   ${index + 1}. ${header.trim()}`);
  });
  console.log('');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n🎉 Conversion terminée avec succès !\n');
console.log('Vous pouvez maintenant utiliser ce fichier pour :');
console.log('  • Import CSV dans l\'application');
console.log('  • Envoi en masse de QR Codes');
console.log('  • Import dans une base de données\n');
