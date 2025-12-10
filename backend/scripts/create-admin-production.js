import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env') });

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  console.log('\n🔧 Création de l\'admin en PRODUCTION\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error('❌ ERREUR : MONGO_URI non défini dans .env');
    console.error('\nPour la production, ajoutez votre MongoDB Atlas URI :');
    console.error('MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mhm_db\n');
    process.exit(1);
  }

  try {
    console.log('🔄 Connexion à MongoDB...');
    console.log(`   URI : ${MONGO_URI.replace(/\/\/.*:.*@/, '//***:***@')}\n`);

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@HFM.mg' });

    if (existingAdmin) {
      console.log('⚠️  L\'admin existe déjà !\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('Détails de l\'admin existant :');
      console.log('  📧 Email :', existingAdmin.email);
      console.log('  👤 Nom   :', existingAdmin.firstName, existingAdmin.lastName);
      console.log('  🔑 Rôle  :', existingAdmin.role || '⚠️  AUCUN RÔLE (problème !)');
      console.log('  🆔 ID    :', existingAdmin._id);
      console.log('  📅 Créé  :', existingAdmin.createdAt);
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      // Si le rôle est manquant, le mettre à jour
      if (!existingAdmin.role) {
        console.log('🔧 Mise à jour du rôle admin...\n');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Rôle admin ajouté avec succès !\n');
      }

      console.log('💡 Si vous voulez réinitialiser le mot de passe :');
      console.log('   1. Supprimez l\'admin avec MongoDB Compass ou Atlas');
      console.log('   2. Relancez ce script\n');

      await mongoose.connection.close();
      process.exit(0);
    }

    // Hasher le mot de passe
    const password = 'Admin123!';
    console.log('🔐 Hashage du mot de passe...\n');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'admin
    console.log('👤 Création de l\'utilisateur admin...\n');
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'HFM',
      email: 'admin@HFM.mg',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin créé avec succès !\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 Informations de connexion :\n');
    console.log('  📧 Email       : admin@HFM.mg');
    console.log('  🔑 Mot de passe: Admin123!');
    console.log('  👤 Nom         : Admin HFM');
    console.log('  🆔 ID          :', admin._id);
    console.log('  🔐 Rôle        : admin');
    console.log('  📅 Créé le     :', admin.createdAt);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Vous pouvez maintenant vous connecter sur :\n');
    console.log('   🌐 Production : https://www.madagasikarahoanymalagasy.org/login');
    console.log('   🌐 Local      : http://localhost:5173/login\n');
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

createAdmin();
