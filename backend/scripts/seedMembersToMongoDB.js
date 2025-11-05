import mongoose from 'mongoose';
import Member from '../src/models/Member.js';

// URI MongoDB fourni
const MONGO_URI = 'mongodb+srv://mhm_db_user:20240522Iaina%40@cluster0.vrg1xjv.mongodb.net/mhm_db?retryWrites=true&w=majority&appName=Cluster0';

// Données des membres à créer
const membersData = [
  {
    firstName: 'Jean',
    lastName: 'Dupont',
    dateOfBirth: new Date('1985-03-15'),
    address: {
      street: '12 Rue de la République',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      full: '12 Rue de la République, 75001 Paris, France'
    },
    phone: '+33 6 12 34 56 78',
    email: 'jean.dupont@example.com',
    memberType: 'regular',
    status: 'active',
    occupation: 'Ingénieur',
    interests: 'Technologie, Sport, Innovation',
    notes: 'Membre actif depuis plusieurs années, participe régulièrement aux événements'
  },
  {
    firstName: 'Marie',
    lastName: 'Martin',
    dateOfBirth: new Date('1990-07-22'),
    address: {
      street: '45 Avenue des Champs-Élysées',
      city: 'Paris',
      postalCode: '75008',
      country: 'France',
      full: '45 Avenue des Champs-Élysées, 75008 Paris, France'
    },
    phone: '+33 6 23 45 67 89',
    email: 'marie.martin@example.com',
    memberType: 'regular',
    status: 'active',
    occupation: 'Professeur',
    interests: 'Éducation, Culture, Littérature',
    notes: 'Participe régulièrement aux événements culturels'
  },
  {
    firstName: 'Pierre',
    lastName: 'Bernard',
    dateOfBirth: new Date('1978-11-08'),
    address: {
      street: '78 Boulevard Saint-Michel',
      city: 'Paris',
      postalCode: '75006',
      country: 'France',
      full: '78 Boulevard Saint-Michel, 75006 Paris, France'
    },
    phone: '+33 6 34 56 78 90',
    email: 'pierre.bernard@example.com',
    memberType: 'honorary',
    status: 'active',
    occupation: 'Médecin',
    interests: 'Santé, Bénévolat, Sciences',
    emergencyContact: {
      name: 'Catherine Bernard',
      phone: '+33 6 11 22 33 44',
      relationship: 'Épouse'
    },
    notes: 'Membre honoraire, contributions importantes à l\'association'
  },
  {
    firstName: 'Sophie',
    lastName: 'Lefebvre',
    dateOfBirth: new Date('2000-05-12'),
    address: {
      street: '23 Rue du Faubourg Saint-Antoine',
      city: 'Paris',
      postalCode: '75011',
      country: 'France',
      full: '23 Rue du Faubourg Saint-Antoine, 75011 Paris, France'
    },
    phone: '+33 6 45 67 89 01',
    email: 'sophie.lefebvre@example.com',
    memberType: 'student',
    status: 'active',
    occupation: 'Étudiante en Musicologie',
    interests: 'Musique, Voyages, Photographie',
    notes: 'Tarif étudiant appliqué, très active dans les événements jeunesse'
  },
  {
    firstName: 'Thomas',
    lastName: 'Moreau',
    dateOfBirth: new Date('1995-09-30'),
    address: {
      street: '56 Rue de Rivoli',
      city: 'Paris',
      postalCode: '75004',
      country: 'France',
      full: '56 Rue de Rivoli, 75004 Paris, France'
    },
    phone: '+33 6 56 78 90 12',
    email: 'thomas.moreau@example.com',
    memberType: 'regular',
    status: 'pending',
    occupation: 'Graphiste',
    interests: 'Design, Art, Créativité',
    notes: 'Demande d\'adhésion en attente de validation'
  },
  {
    firstName: 'Isabelle',
    lastName: 'Laurent',
    dateOfBirth: new Date('1982-12-25'),
    address: {
      street: '89 Avenue Montaigne',
      city: 'Paris',
      postalCode: '75008',
      country: 'France',
      full: '89 Avenue Montaigne, 75008 Paris, France'
    },
    phone: '+33 6 67 89 01 23',
    email: 'isabelle.laurent@example.com',
    memberType: 'family',
    status: 'active',
    occupation: 'Chef d\'entreprise',
    interests: 'Entrepreneuriat, Famille, Networking',
    emergencyContact: {
      name: 'Philippe Laurent',
      phone: '+33 6 77 88 99 00',
      relationship: 'Époux'
    },
    notes: 'Adhésion familiale avec 3 enfants'
  },
  {
    firstName: 'Lucas',
    lastName: 'Simon',
    dateOfBirth: new Date('1998-04-18'),
    address: {
      street: '34 Rue Mouffetard',
      city: 'Paris',
      postalCode: '75005',
      country: 'France',
      full: '34 Rue Mouffetard, 75005 Paris, France'
    },
    phone: '+33 6 78 90 12 34',
    email: 'lucas.simon@example.com',
    memberType: 'regular',
    status: 'active',
    occupation: 'Développeur Full-Stack',
    interests: 'Informatique, Gaming, Open Source',
    notes: 'Intéressé par les activités tech et développement'
  },
  {
    firstName: 'Emma',
    lastName: 'Petit',
    dateOfBirth: new Date('1987-08-05'),
    address: {
      street: '67 Rue de la Paix',
      city: 'Paris',
      postalCode: '75002',
      country: 'France',
      full: '67 Rue de la Paix, 75002 Paris, France'
    },
    phone: '+33 6 89 01 23 45',
    email: 'emma.petit@example.com',
    memberType: 'regular',
    status: 'active',
    occupation: 'Avocate',
    interests: 'Droit, Lecture, Théâtre',
    notes: 'Membre très impliquée dans les activités associatives'
  },
  {
    firstName: 'Alexandre',
    lastName: 'Dubois',
    dateOfBirth: new Date('1992-01-20'),
    address: {
      street: '101 Rue La Fayette',
      city: 'Paris',
      postalCode: '75010',
      country: 'France',
      full: '101 Rue La Fayette, 75010 Paris, France'
    },
    phone: '+33 6 90 12 34 56',
    email: 'alexandre.dubois@example.com',
    memberType: 'regular',
    status: 'active',
    occupation: 'Architecte',
    interests: 'Architecture, Design, Urbanisme',
    notes: 'Nouveau membre, très motivé'
  },
  {
    firstName: 'Camille',
    lastName: 'Rousseau',
    dateOfBirth: new Date('1988-06-14'),
    address: {
      street: '52 Boulevard Haussmann',
      city: 'Paris',
      postalCode: '75009',
      country: 'France',
      full: '52 Boulevard Haussmann, 75009 Paris, France'
    },
    phone: '+33 6 01 23 45 67',
    email: 'camille.rousseau@example.com',
    memberType: 'regular',
    status: 'active',
    occupation: 'Journaliste',
    interests: 'Journalisme, Politique, Société',
    notes: 'Couvre nos événements pour le journal local'
  },
  {
    firstName: 'Nicolas',
    lastName: 'Vincent',
    dateOfBirth: new Date('1975-10-03'),
    address: {
      street: '88 Rue du Commerce',
      city: 'Lyon',
      postalCode: '69002',
      country: 'France',
      full: '88 Rue du Commerce, 69002 Lyon, France'
    },
    phone: '+33 6 12 33 44 55',
    email: 'nicolas.vincent@example.com',
    memberType: 'regular',
    status: 'active',
    occupation: 'Consultant',
    interests: 'Business, Économie, Finance',
    emergencyContact: {
      name: 'Sophie Vincent',
      phone: '+33 6 22 33 44 55',
      relationship: 'Sœur'
    },
    notes: 'Membre de la région lyonnaise'
  },
  {
    firstName: 'Julie',
    lastName: 'Girard',
    dateOfBirth: new Date('1993-03-28'),
    address: {
      street: '15 Place Bellecour',
      city: 'Lyon',
      postalCode: '69002',
      country: 'France',
      full: '15 Place Bellecour, 69002 Lyon, France'
    },
    phone: '+33 6 23 44 55 66',
    email: 'julie.girard@example.com',
    memberType: 'regular',
    status: 'inactive',
    occupation: 'Infirmière',
    interests: 'Santé, Sport, Nature',
    notes: 'Membre inactif, à relancer pour renouvellement'
  },
  {
    firstName: 'Maxime',
    lastName: 'Roux',
    dateOfBirth: new Date('2001-11-17'),
    address: {
      street: '44 Rue Nationale',
      city: 'Lille',
      postalCode: '59000',
      country: 'France',
      full: '44 Rue Nationale, 59000 Lille, France'
    },
    phone: '+33 6 34 55 66 77',
    email: 'maxime.roux@example.com',
    memberType: 'student',
    status: 'active',
    occupation: 'Étudiant en Informatique',
    interests: 'Programmation, IA, Robotique',
    notes: 'Étudiant brillant, intéressé par les projets tech'
  },
  {
    firstName: 'Chloé',
    lastName: 'Fabre',
    dateOfBirth: new Date('1986-09-09'),
    address: {
      street: '77 Cours Mirabeau',
      city: 'Aix-en-Provence',
      postalCode: '13100',
      country: 'France',
      full: '77 Cours Mirabeau, 13100 Aix-en-Provence, France'
    },
    phone: '+33 6 45 66 77 88',
    email: 'chloe.fabre@example.com',
    memberType: 'regular',
    status: 'active',
    occupation: 'Artiste peintre',
    interests: 'Peinture, Sculpture, Expositions',
    notes: 'Organise des ateliers artistiques pour l\'association'
  },
  {
    firstName: 'Antoine',
    lastName: 'Mercier',
    dateOfBirth: new Date('1980-02-14'),
    address: {
      street: '33 Rue de la Liberté',
      city: 'Dijon',
      postalCode: '21000',
      country: 'France',
      full: '33 Rue de la Liberté, 21000 Dijon, France'
    },
    phone: '+33 6 56 77 88 99',
    email: 'antoine.mercier@example.com',
    memberType: 'honorary',
    status: 'active',
    occupation: 'Retraité',
    interests: 'Histoire, Patrimoine, Voyages',
    emergencyContact: {
      name: 'Marie Mercier',
      phone: '+33 6 66 77 88 99',
      relationship: 'Fille'
    },
    notes: 'Ancien président, membre d\'honneur'
  }
];

// Fonction principale
async function seedMembers() {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('🌱 SCRIPT DE SEEDING DES MEMBRES - BASE DE DONNÉES MONGODB');
    console.log('='.repeat(70));

    console.log('\n🔌 Connexion à MongoDB Atlas...');
    console.log(`📍 Base de données: mhm_db`);

    // Connexion à MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connecté à MongoDB Atlas avec succès!\n');

    console.log(`📝 Création de ${membersData.length} membres...\n`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Créer chaque membre
    for (let i = 0; i < membersData.length; i++) {
      const memberData = membersData[i];
      try {
        const member = await Member.create(memberData);
        successCount++;
        console.log(`✅ [${i + 1}/${membersData.length}] ${memberData.firstName} ${memberData.lastName} - Créé avec succès (ID: ${member._id})`);
      } catch (error) {
        errorCount++;
        errors.push({
          member: `${memberData.firstName} ${memberData.lastName}`,
          error: error.message
        });
        console.error(`❌ [${i + 1}/${membersData.length}] ${memberData.firstName} ${memberData.lastName} - Erreur: ${error.message}`);
      }
    }

    // Résumé
    console.log('\n' + '='.repeat(70));
    console.log('📊 RÉSUMÉ DU SEEDING');
    console.log('='.repeat(70));
    console.log(`✅ Succès: ${successCount}/${membersData.length}`);
    console.log(`❌ Erreurs: ${errorCount}/${membersData.length}`);

    if (successCount > 0) {
      console.log(`\n📈 Taux de réussite: ${((successCount / membersData.length) * 100).toFixed(1)}%`);
    }

    if (errors.length > 0) {
      console.log('\n❌ Détails des erreurs:');
      errors.forEach((err, index) => {
        console.log(`  ${index + 1}. ${err.member}: ${err.error}`);
      });
    }

    console.log('='.repeat(70));

    // Vérifier le nombre total de membres dans la base
    const totalMembers = await Member.countDocuments();
    console.log(`\n📊 Total de membres dans la base: ${totalMembers}`);

    // Afficher la distribution par statut
    const activeCount = await Member.countDocuments({ status: 'active' });
    const pendingCount = await Member.countDocuments({ status: 'pending' });
    const inactiveCount = await Member.countDocuments({ status: 'inactive' });

    console.log('\n📊 Distribution par statut:');
    console.log(`   • Actifs: ${activeCount}`);
    console.log(`   • En attente: ${pendingCount}`);
    console.log(`   • Inactifs: ${inactiveCount}`);

    console.log('\n🎉 Seeding terminé avec succès!\n');

  } catch (error) {
    console.error('\n❌ Erreur fatale:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée.\n');
  }
}

// Exécuter le script
seedMembers()
  .then(() => {
    console.log('✨ Script terminé avec succès.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erreur lors de l\'exécution du script:', error);
    process.exit(1);
  });
