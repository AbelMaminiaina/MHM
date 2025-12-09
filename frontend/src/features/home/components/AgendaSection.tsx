import { motion } from 'framer-motion';

interface AgendaEvent {
  id: string;
  day: string;
  month: string;
  time: string;
  title: string;
  category: 'Medias' | 'Evenements' | 'Deplacements';
  description: string;
  imageUrl?: string;
}

const categoryColors = {
  'Medias': 'bg-pink-600',
  'Evenements': 'bg-red-600',
  'Deplacements': 'bg-pink-700'
};

const agendaData: AgendaEvent[] = [
  {
    id: '1',
    day: '28',
    month: 'OCTOBRE',
    time: '07H45',
    title: 'VAL SUR MADAGASIKARA INFO',
    category: 'Medias',
    description: 'Val sera l\'invité de Madagasikara Info mardi 28 octobre à 7h45.',
    imageUrl: 'https://source.unsplash.com/200x200/?radio,interview,media'
  },
  {
    id: '2',
    day: '29',
    month: 'OCTOBRE',
    time: '10H30',
    title: 'Val SUR TVM',
    category: 'Medias',
    description: 'Valohery sera l\'invité de TVM mercredi 29 octobre à 10h30.',
    imageUrl: 'https://source.unsplash.com/200x200/?television,studio,broadcast'
  },
  {
    id: '3',
    day: '29',
    month: 'OCTOBRE',
    time: '12H00',
    title: '« CE QUE VEULENT LES MALAGASY »',
    category: 'Evenements',
    description: '« Ce que veulent les Malagasy » : précommandez dès maintenant le nouveau livre de Valohery',
    imageUrl: 'https://source.unsplash.com/200x200/?book,library,reading'
  },
  {
    id: '4',
    day: '29',
    month: 'OCTOBRE',
    time: '18H00',
    title: 'SÉANCE DE DÉDICACES À VELIZY',
    category: 'Deplacements',
    description: 'Séance de dédicaces du nouveau livre de Valohery',
    imageUrl: 'https://source.unsplash.com/200x200/?book,signing,author'
  }
];

const actionItems = [
  {
    id: '1',
    title: 'MILITER',
    description: 'Rejoignez le mouvement',
    color: 'from-red-600 to-red-800',
    imageUrl: 'https://source.unsplash.com/800x600/?protest,activism',
    link: '#'
  },
  {
    id: '2',
    title: 'FAIRE UN DON',
    description: 'Soutenez nos actions',
    color: 'from-pink-600 to-pink-800',
    imageUrl: 'https://source.unsplash.com/800x600/?donation,charity',
    link: '#'
  },
  {
    id: '3',
    title: 'ADHÉRER',
    description: 'Devenez membre MHM',
    color: 'from-rose-600 to-rose-800',
    imageUrl: 'https://source.unsplash.com/800x600/?handshake,team',
    link: '#'
  },
  {
    id: '4',
    title: 'PROJET',
    description: 'Découvrez notre vision',
    color: 'from-red-700 to-red-900',
    imageUrl: 'https://source.unsplash.com/800x600/?future,vision',
    link: '#'
  }
];

export const AgendaSection = () => {
  return (
    <section className="bg-gradient-to-b from-pink-50 to-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
        {/* Left - Agenda */}
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-pink-900 mb-6 sm:mb-8 lg:mb-10 uppercase">
            AGENDA
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {agendaData.map((event, index) => (
              <motion.div
                key={event.id}
                className="flex flex-col sm:flex-row gap-3 sm:gap-5 p-4 sm:p-5 rounded-xl border-2 border-pink-100 hover:border-pink-400 bg-white hover:bg-gradient-to-r hover:from-pink-50 hover:to-white transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                {/* Date */}
                <motion.div
                  className="flex-shrink-0 text-center w-full sm:min-w-[100px] sm:w-auto bg-gradient-to-br from-pink-600 to-pink-800 text-white rounded-lg p-3 sm:p-4 shadow-md"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl sm:text-4xl font-black leading-none">
                    {event.day}
                  </div>
                  <div className="text-xs font-bold uppercase mt-1 opacity-90">
                    {event.month}
                  </div>
                  <div className="text-sm font-bold mt-2 bg-white/20 px-2 py-1 rounded">
                    {event.time}
                  </div>
                </motion.div>

                {/* Details */}
                <div className="flex gap-3 sm:gap-5 flex-1">
                  {event.imageUrl && (
                    <div className="relative overflow-hidden rounded-lg flex-shrink-0 shadow-md w-20 h-20 sm:w-24 sm:h-24">
                      <motion.img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.15 }}
                        animate={{ scale: [1.15, 1.05, 1.15] }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 4.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: index * 0.15
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-black text-gray-900 mb-2 uppercase group-hover:text-pink-700 transition-colors">
                      {event.title}
                    </h3>
                    <motion.span
                      className={`inline-flex items-center gap-1 text-xs font-bold text-white px-2.5 sm:px-3 py-1 rounded-full mb-2 sm:mb-3 ${categoryColors[event.category]}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {event.category}
                    </motion.span>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right - Actions */}
        <div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {actionItems.map((action, index) => (
              <motion.a
                key={action.id}
                href={action.link}
                className="relative h-56 sm:h-64 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-2xl border-2 border-transparent hover:border-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5)",
                  transition: { duration: 0.4 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Image de fond avec effet zoom */}
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${action.imageUrl})` }}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: [1.15, 1.05, 1.15] }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 5.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: index * 0.15
                  }}
                />
                {/* Gradient overlay avec couleur dynamique */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
                />

                {/* Effet de brillance animé */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {/* Contenu */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6">
                  {/* Titre */}
                  <motion.h3
                    className="text-white text-2xl sm:text-3xl lg:text-4xl font-black text-center uppercase drop-shadow-2xl mb-2 sm:mb-3"
                    whileHover={{ scale: 1.15, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {action.title}
                  </motion.h3>

                  {/* Description qui apparaît au hover */}
                  <motion.p
                    className="text-white text-sm sm:text-base font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 px-4 sm:px-5 py-2 sm:py-3 rounded-full backdrop-blur-sm"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    {action.description}
                  </motion.p>
                </div>

                {/* Flèche d'action */}
                <motion.div
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white text-gray-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-lg sm:text-xl opacity-0 group-hover:opacity-100 shadow-2xl"
                  initial={{ scale: 0, rotate: -180 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                >
                  →
                </motion.div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
