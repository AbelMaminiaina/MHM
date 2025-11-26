import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env') });

const MemberSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dateOfBirth: Date,
    address: Object,
    status: String,
    memberType: String,
    memberNumber: String,
    notes: String,
  },
  { timestamps: true }
);

const Member = mongoose.model('Member', MemberSchema);

async function purgeMembers() {
  console.log('\n🗑️  Épuration de la table MEMBERS en PRODUCTION\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error('❌ ERREUR : MONGO_URI non défini dans .env');
    process.exit(1);
  }

  try {
    console.log('🔄 Connexion à MongoDB...');
    console.log(`   URI : ${MONGO_URI.replace(/\/\/.*:.*@/, '//***:***@')}\n`);

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Compter les membres avant suppression
    const countBefore = await Member.countDocuments();
    console.log(`📊 Nombre de membres avant épuration : ${countBefore}\n`);

    if (countBefore === 0) {
      console.log('⚠️  La collection members est déjà vide !\n');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Afficher un échantillon des membres qui vont être supprimés
    const sampleMembers = await Member.find().limit(5).select('firstName lastName email memberNumber');
    console.log('📋 Aperçu des membres qui vont être supprimés :\n');
    sampleMembers.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.firstName} ${member.lastName} (${member.email}) - ${member.memberNumber}`);
    });
    if (countBefore > 5) {
      console.log(`   ... et ${countBefore - 5} autres\n`);
    } else {
      console.log('');
    }

    // Demander confirmation (en production, on supprime directement)
    console.log('⚠️  ATTENTION : Cette action est IRRÉVERSIBLE !\n');
    console.log('🗑️  Suppression en cours...\n');

    // Supprimer tous les membres
    const result = await Member.deleteMany({});

    console.log('✅ Épuration terminée !\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📊 Résultats :\n`);
    console.log(`   Membres supprimés : ${result.deletedCount}`);
    console.log(`   Membres restants  : 0\n`);

    // Vérification
    const countAfter = await Member.countDocuments();
    console.log(`✅ Vérification : ${countAfter} membres dans la collection\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('✅ Déconnexion de MongoDB\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error('\nDétails :', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

purgeMembers();
