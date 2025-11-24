import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  console.log('\n🔧 Création du compte administrateur\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB\n');

    const email = 'admin@mhm.mg';
    const password = 'Admin123!';

    // Vérifier si l'admin existe déjà
    console.log('🔍 Vérification de l\'existence de l\'admin...');
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('\n⚠️  Un administrateur existe déjà avec cet email !\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', email);
      console.log('👤 Nom:', existingAdmin.firstName, existingAdmin.lastName);
      console.log('🆔 ID:', existingAdmin._id);
      console.log('📅 Créé le:', existingAdmin.createdAt);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('💡 Si vous avez oublié le mot de passe, supprimez cet utilisateur');
      console.log('   dans MongoDB et relancez ce script.\n');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log('✅ Aucun admin existant trouvé\n');

    // Hasher le mot de passe
    console.log('🔐 Génération du hash du mot de passe...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('✅ Hash généré\n');

    // Créer l'admin
    console.log('👤 Création de l\'utilisateur admin...');
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'MHM',
      email: email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Utilisateur admin créé avec succès !\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ COMPTE ADMINISTRATEUR CRÉÉ');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📧 Email     :', email);
    console.log('🔐 Mot de passe :', password);
    console.log('👤 Rôle      : admin');
    console.log('🆔 ID        :', admin._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🌐 Connexion :');
    console.log('   http://localhost:5173/login\n');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !\n');

    await mongoose.connection.close();
    console.log('✅ Déconnexion de MongoDB\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error('\n💡 Vérifiez que :');
    console.error('   1. MongoDB est démarré');
    console.error('   2. La chaîne MONGO_URI dans .env est correcte');
    console.error('   3. Le fichier .env existe dans backend/\n');

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

createAdmin();
