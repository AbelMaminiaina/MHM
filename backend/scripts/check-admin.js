import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function checkAdmin() {
  console.log('\n🔍 Vérification de l\'admin dans MongoDB\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Chercher tous les utilisateurs avec le rôle admin
    const admins = await User.find({ role: 'admin' });

    if (admins.length === 0) {
      console.log('❌ Aucun administrateur trouvé dans la base de données\n');
      console.log('💡 Exécutez : node scripts/create-admin.js\n');
    } else {
      console.log(`✅ ${admins.length} administrateur(s) trouvé(s) :\n`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      admins.forEach((admin, index) => {
        console.log(`Admin #${index + 1}:`);
        console.log(`  📧 Email      : ${admin.email}`);
        console.log(`  👤 Nom        : ${admin.firstName} ${admin.lastName}`);
        console.log(`  🆔 ID         : ${admin._id}`);
        console.log(`  📅 Créé le    : ${admin.createdAt}`);
        console.log(`  🔄 Modifié le : ${admin.updatedAt}`);
        console.log('');
      });

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    // Statistiques
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRegularUsers = await User.countDocuments({ role: 'user' });

    console.log('📊 Statistiques utilisateurs :\n');
    console.log(`  • Total utilisateurs : ${totalUsers}`);
    console.log(`  • Administrateurs    : ${totalAdmins}`);
    console.log(`  • Utilisateurs       : ${totalRegularUsers}`);
    console.log('');

    await mongoose.connection.close();
    console.log('✅ Déconnexion de MongoDB\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

checkAdmin();
